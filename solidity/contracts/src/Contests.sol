// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {VRFV2PlusWrapperConsumerBase} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFV2PlusWrapperConsumerBase.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {GameScoreOracle} from "./GameScoreOracle.sol";
import {Boxes} from "./Boxes.sol";

contract Contests is VRFV2PlusWrapperConsumerBase, ConfirmedOwner, IERC721Receiver {
    using SafeERC20 for IERC20;

    uint256 private _nextTokenId;

    struct Cost {
        address currency; // use zero address for ether
        uint256 amount;
    }

    struct RewardPayment {
        bool q1Paid; // track if user claimed their q1 reward
        bool q2Paid; // track if user claimed their q2 reward
        bool q3Paid; // track if user claimed their q3 reward
        bool finalPaid; // track if user claimed their final reward
    }

    struct Contest {
        uint256 id; // a unique id for this contest based on the contestId counter
        uint256 gameId; // the id that maps to the real-world contest
        address creator; // the user who created the contest
        uint8[] rows; // the row scores
        uint8[] cols; // the col scores
        Cost boxCost; // the amount of ETH or tokens needed to claim a box
        bool boxesCanBeClaimed; // whether or not boxes can be claimed by users (this is false once boxes have values)
        RewardPayment rewardsPaid; // track if rewards have been claimed
        uint256 totalRewards; // track the total amount of buy-ins collected for the contest
        uint256 boxesClaimed; // amount of boxes claimed by users in this contest
        uint256[] randomValues; // random numbers used to assign values to rows and cols
        bool randomValuesSet; // used to know whether or not chainlink has provided this contest with random values
    }

    struct GameScore {
        uint256 id; // a unique id for this game determined by the outside world data set
        uint8 homeQ1LastDigit; // last digit of the home teams score at the end of q2
        uint8 homeQ2LastDigit; // last digit of the home team's cumulative score at the end of q1
        uint8 homeQ3LastDigit; 
        uint8 homeFLastDigit; // last digit of the home team's cumulative score at the end of the final period including OT
        uint8 awayQ1LastDigit; 
        uint8 awayQ2LastDigit; 
        uint8 awayQ3LastDigit; 
        uint8 awayFLastDigit;
        uint8 qComplete; // the number of the last period that has been completed including OT. expect 100 for the game to be considered final.
        bool requestInProgress; // true if there is a pending oracle request
    }

    // contest counter
    uint256 public contestIdCounter = 0;

    // a list of all contests created
    mapping (uint256 contestId => Contest contest) public contests;

    // a list of all contests created by the user
    mapping (address creator => uint256[] contestId) public contestsByUser;

    // the number of boxes on a grid
    uint256 private constant NUM_BOXES_IN_CONTEST = 100;

    // Treasury Address
    address public treasury;

    // Game Score Oracle
    GameScoreOracle public gameScoreOracle;

    // Box NFT
    Boxes public boxes;

    // default row and columns
    uint8[] private defaultScores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    // payouts
    uint256 public constant Q1_PAYOUT = 150; // q1 wins 15% of the pot
    uint256 public constant Q2_PAYOUT = 300; // q2 wins 30% of the pot
    uint256 public constant Q3_PAYOUT = 150; // q3 wins 15% of the pot
    uint256 public constant FINAL_PAYOUT = 380; // final wins 38% of the pot
    // treasury fee is set at 2%
    uint256 public constant TREASURY_FEE = 20;
    // denominator for fees and payouts
    uint256 public constant PERCENT_DENOMINATOR = 1000;

    // modifier to check if caller is the game creator
    modifier onlyContestCreator(uint256 contestId) {
        Contest memory contest = contests[contestId];
        if (msg.sender != contest.creator) revert CallerNotContestCreator();
        _;
    }

    ////////////////////////////////////
    ///////////    EVENTS    ///////////
    ////////////////////////////////////
    event ContestCreated(uint256 contestId); // someone made a new contest
    event ScoresAssigned(uint256 contestId); // rows and cols were assigned values via the random values from chainlink
    event ScoresRequested(uint256 contestId); // someone requested random numbers for their rows and cols
    event BoxClaimed(uint256 contestId, uint256 tokenId); // someone claimed a box
    event GameScoresRequested(uint256 indexed gameId, bytes32 requestId); // someone requested game scores from the real world
    event GameScoresUpdated(uint256 indexed gameId, bytes32 requestId); // game scores were updated
    event GameScoreError(uint256 indexed gameId, bytes error); // there was an error fetching game scores

    ////////////////////////////////////
    ///////////    ERRORS    ////////////
    ////////////////////////////////////
    error ZeroAddress();
    error InsufficientPayment();
    error BoxAlreadyClaimed();
    error BoxDoesNotExist();
    error RandomValuesAlreadyFetched();
    error CooldownNotMet();
    error FailedToSendETH();
    error RewardsNotClaimable();
    error GameIdNotSet();
    error BoxCostNotSet();
    error BoxesCannotBeClaimed();
    error CallerNotContestCreator();

    ////////////////////////////////////////////////
    ///////////   CHAINLINK VARIABLES    ///////////
    ////////////////////////////////////////////////
    uint256 public vrfFee = 0.001 ether;

    // Gas For VRF Trigger
    uint32 public vrfGas = 250_000;

    // the request for randomly assigning scores to rows and cols
    mapping (uint256 vrfRequest => uint256 contestId) private vrfScoreAssignments;

    constructor(
        address treasury_,
        Boxes boxes_,
        GameScoreOracle gameScoreOracle_,
        address _vrfWrapper
    )
    VRFV2PlusWrapperConsumerBase(_vrfWrapper)
    ConfirmedOwner(msg.sender) {
        if (treasury_ == address(0)) revert ZeroAddress();
        treasury = treasury_;
        boxes = boxes_;
        gameScoreOracle = gameScoreOracle_;
    }

    ////////////////////////////////////////////////
    ////////  CONTEST CREATOR FUNCTIONS  ///////////
    ////////////////////////////////////////////////
    /**
        Request randomness to assign numbers to rows and cols
        The contest creator can call this before all boxes are claimed
        however _fetchRandomValues will be called automatically by the 
        user who claims the last box. Calling this prevents future boxes
        from being claimed.
     */
    function fetchRandomValues(uint256 _contestId) external payable onlyContestCreator(_contestId) {
        if (msg.value < vrfFee) revert InsufficientPayment();
        _fetchRandomValues(_contestId);
    }

    ////////////////////////////////////////////////
    ///////////    PUBLIC FUNCTIONS      ///////////
    ////////////////////////////////////////////////

    /**
        Create a new contest
     */
    function createContest(uint256 gameId, uint256 boxCost, address boxCurrency) external {
        if (gameId == 0) revert GameIdNotSet();
        if (boxCost == 0) revert BoxCostNotSet();
        // create the contest struct
        Contest memory contest = Contest({
            id: contestIdCounter, // the id of the contest
            gameId: gameId, // the game that this contest is tied to
            creator: msg.sender, // sender is the creator
            rows: defaultScores, // default rows
            cols: defaultScores, // default cols
            boxCost: Cost(boxCurrency, boxCost), // the cost of a box
            boxesCanBeClaimed: true, // boxes can be claimed
            rewardsPaid: RewardPayment(false, false, false, false), // rewards have not been paid out yet
            totalRewards: 0, // total amount collected for the contest
            boxesClaimed: 0, // no boxes have been claimed yet
            randomValues: new uint [](2), // holds random values to be used when assigning values to rows and cols
            randomValuesSet: false // chainlink has not yet given us random values for row and col values
        });
        // save this to the list of contests
        contests[contestIdCounter] = contest;
        // add this to the list of contests created by the user
        contestsByUser[msg.sender].push(contestIdCounter);
        // mint 100 nfts for this contest
        for (uint8 i = 0; i < NUM_BOXES_IN_CONTEST;) {
            boxes.mint(_nextTokenId);
            unchecked{ ++_nextTokenId; }
            unchecked{ ++i; }
        }
        // emit event
        emit ContestCreated(contestIdCounter);
        // increment for the next contest that gets created
        unchecked{ ++contestIdCounter; }
    }

    /**
        Claim boxes
     */
    function claimBoxes(uint256 contestId, uint256[] memory tokenIds, address player) external payable {
        // fetch the contest
        Contest memory contest = contests[contestId];
        // check to make sure that the contest still allows for boxes to be claimed
        if (!contest.boxesCanBeClaimed) revert BoxesCannotBeClaimed();
        // determine cost based on number of boxes to claim
        uint256 numBoxesToClaim = tokenIds.length;
        uint256 totalCost = contest.boxCost.amount * numBoxesToClaim;
        // check to make sure that they sent enough ETH to buy the boxes
        if (contest.boxCost.currency == address(0)) {
            if (totalCost > msg.value) revert InsufficientPayment();
        } else {
            // transfer the tokens to this contract. safeTransferFrom will revert if the transfer fails
            IERC20(contest.boxCost.currency).safeTransferFrom(player, address(this), totalCost);
        }
        // claim the boxes
        for (uint8 i = 0; i < numBoxesToClaim;) {
            if (i >= _nextTokenId) revert BoxDoesNotExist();
            // boxes that are claimed must exist within the 10x10 grid
            uint256 tokenId = tokenIds[i];
            // check to make sure the box they are trying to claim isnt already claimed
            // check that the owner of this tokenId is this contract address
            if (boxes.ownerOf(tokenId) != address(this)) revert BoxAlreadyClaimed();
            // claim the box by transferring the ownership of this token id from this contract to player
            boxes.update(player, tokenId, address(this));
            // emit event that the box was claimed
            emit BoxClaimed(contestId, tokenId);
            // iterate through the loop
            unchecked{ ++i; }
        }
        // increase the number of boxes claimed in this game
        contest.boxesClaimed += numBoxesToClaim;
        // increase the total amount in the contest by the total amount purchased by this user
        contest.totalRewards += totalCost;
        // set the contest changes in state
        contests[contestId] = contest;
        // if this is the final box claimed, assign the scores of rows and cols randomly
        if (contest.boxesClaimed == NUM_BOXES_IN_CONTEST) {
            _fetchRandomValues(contestId);
        }

        // refund any excess ETH that was sent
        if (msg.value > totalCost) {
            _sendEth(player, msg.value - totalCost);
        }
    }

    /**
        Claim reward
     */
    function claimReward(uint256 contestId, uint256 tokenId) external {
        // fetch the contest
        Contest memory contest = contests[contestId];
        // check to make sure that the contest rewards are able to be claimed
        if (!contest.randomValuesSet) revert RewardsNotClaimable();
        // get the scores assigned to the boxes
        (uint256 rowScore, uint256 colScore) = _fetchBoxScores(contest, tokenId);
        // fetch the game scores
        GameScore memory gameScores_ = getGameScores(contest.gameId);
        // calculate the total reward
        uint256 userReward;
        // check q1
        if (!contest.rewardsPaid.q1Paid && gameScores_.qComplete >= 1 && gameScores_.awayQ1LastDigit == rowScore && gameScores_.homeQ1LastDigit == colScore) {
            userReward += contest.totalRewards * Q1_PAYOUT / PERCENT_DENOMINATOR;
            contest.rewardsPaid.q1Paid = true;
        }
        // check q2
        if (!contest.rewardsPaid.q2Paid && gameScores_.qComplete >= 2 && gameScores_.awayQ2LastDigit == rowScore && gameScores_.homeQ2LastDigit == colScore) {
            userReward += contest.totalRewards * Q2_PAYOUT / PERCENT_DENOMINATOR;
            contest.rewardsPaid.q2Paid = true;
        }
        // check q3
        if (!contest.rewardsPaid.q3Paid && gameScores_.qComplete >= 3 && gameScores_.awayQ3LastDigit == rowScore && gameScores_.homeQ3LastDigit == colScore) {
            userReward += contest.totalRewards * Q3_PAYOUT / PERCENT_DENOMINATOR;
            contest.rewardsPaid.q3Paid = true;
        }
        // check final
        if (!contest.rewardsPaid.finalPaid && gameScores_.qComplete > 99 && gameScores_.awayFLastDigit == rowScore && gameScores_.homeFLastDigit == colScore) {
            userReward += contest.totalRewards * FINAL_PAYOUT / PERCENT_DENOMINATOR;
            contest.rewardsPaid.finalPaid = true;
            // send the treasury fee when the final score is paid out
            _sendTreasuryFee(contest.totalRewards, contest.boxCost.currency);
        }
        // set the contest
        contests[contestId] = contest;
        // send the reward to the box owner
        if (userReward > 0) {
            _sendReward(boxes.ownerOf(tokenId), userReward, contest.boxCost.currency);
        }
    }

    function fetchFreshGameScores(
        string memory source,
        string[] memory args,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 jobId,
        uint256 gameId
    ) external {
        gameScoreOracle.fetchGameScores(
            source,
            args,
            subscriptionId,
            gasLimit,
            jobId,
            gameId
        );
    }

    ////////////////////////////////////////////////
    ///////////   INTERNAL FUNCTIONS     ///////////
    ////////////////////////////////////////////////
    /**
        Reach out to chainlink to request random values for a contests rows and cols
     */
    function _fetchRandomValues (uint256 _contestId) internal {
        // fetch the contest
        Contest memory contest = contests[_contestId];
        // do not allow for another chainlink request if one has already been made
        if (contest.randomValuesSet) revert RandomValuesAlreadyFetched();
        // fetch 2 random numbers from chainlink: one for rows, and one for cols
        uint256 requestId;
        uint256 reqPrice;
        (requestId, reqPrice) = requestRandomnessPayInNative(
            vrfGas, // callbackGasLimit
            3, // requestConfirmations
            2, // numWords
            VRFV2PlusClient._argsToBytes(
                VRFV2PlusClient.ExtraArgsV1({nativePayment: true})
            )
        );
        // store this request to be looked up later when the randomness is fulfilled
        vrfScoreAssignments[requestId] = _contestId;
        // update the contest so that boxes cannot be claimed anymore
        // we update this here instead of the fulfill so that nobody can front run
        // claiming box after the randomness of the rows and cols were determined
        contest.boxesCanBeClaimed = false;
        contests[_contestId] = contest;
        // emit event that the boxes were requested to be assigned scores
        emit ScoresRequested(_contestId);
    }

    /**
        Returns true if the user owns a box in the given contest
     */
    function _userOwnsBoxInContest (address user, uint256 contestId) internal view returns (bool) {
        // tokenIds 0-99 belong to contestId 0, 100-199 belong to contestId 1, etc.
        // if the user owns an NFT with a tokenId that is less than 100, then they own a box in contestId 0
        uint256 tokenIdRangeToCheck = contestId * 100;
        for (uint8 i = 0; i < 100; i++) {
            if (boxes.ownerOf(tokenIdRangeToCheck + i) == user) {
                return true;
            }
        }
        return false;
    }

    /**
        Send ETH to the treasury account based on the treasury fee amount
     */
    function _sendTreasuryFee (uint256 totalRewards, address currency) internal {
        if (currency == address(0)) {
            _sendEth(treasury, totalRewards * TREASURY_FEE / PERCENT_DENOMINATOR);
        } else {
            IERC20(currency).safeTransfer(treasury, totalRewards * TREASURY_FEE / PERCENT_DENOMINATOR);
        }
    }

    /**
        Send ETH to the treasury account based on the treasury fee amount
     */
    function _sendReward(address winner, uint256 amount, address currency) internal {
        // if nobody claimed this box, send half of the reward to the treasury and the other half to the user who executed this
        // otherwise send the total winnings to the winner
        if (winner == address(this)) {
            if (currency == address(0)) {
                _sendEth(treasury, amount / 2);
                _sendEth(msg.sender, amount / 2);
            } else {
                IERC20(currency).safeTransfer(treasury, amount / 2);
                IERC20(currency).safeTransfer(msg.sender, amount / 2);
            }
        } else {
            if (currency == address(0)) {
                _sendEth(winner, amount);
            } else {
                IERC20(currency).safeTransfer(winner, amount);
            }
        }
    }

    /**
        Given an address and amount, send the amount in ETH to the address
     */
    function _sendEth (address to, uint256 amount) internal {
        (bool sent,) = payable(to).call{ value: amount }("");
        if (!sent) revert FailedToSendETH();
    }

    /**
        Given a contest and tokenId, return the assigned scores for the box's row and col position
     */
    function _fetchBoxScores(
        Contest memory contest, uint256 tokenId
    ) internal pure returns(uint256 rowScore, uint256 colScore) {
        uint256 boxId = tokenId % 100; // makes this a number between 0-99
        // get the row and col positions of the box
        uint256 colPosition = boxId % 10; // box 45 becomes 5, 245 becomes 5, etc.
        uint256 rowPosition = (boxId - colPosition) * 100 / 1000; // 92 - 2 = 90. 90 * 100 = 9000. 9000 / 1000 = 9th row
        // get the scores of the box
        rowScore = contest.rows[rowPosition];
        colScore = contest.cols[colPosition];
        return (rowScore, colScore);
    }

    /**
        Chainlink's callback to provide us with randomness
     */
    function fulfillRandomWords(
        uint256 requestId, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        // the contest id that made this request
        uint256 contestId = vrfScoreAssignments[requestId];
        // fetch the contest object from the id
        Contest memory contest = contests[contestId];
        // flag that chainlink has provided this contest with random values
        contest.randomValuesSet = true;
        // randomly assign scores to the rows and cols
        contest.rows = _shuffleScores(randomWords[0]);
        contest.cols = _shuffleScores(randomWords[1]);
        // save the contest
        contests[contestId] = contest;
        // emit the event
        emit ScoresAssigned(contest.id);
    }

    /**
        Randomly shuffle array of scores
     */
    function _shuffleScores(
        uint256 randomNumber
    ) internal view returns(uint8[] memory shuffledScores) {
        // set shuffled scores to the default
        shuffledScores = defaultScores;
        // randomly shuffle the array of scores
        for (uint8 i = 0; i < 10;) {
            uint256 n = i + uint256(keccak256(abi.encodePacked(randomNumber))) % (10 - i);
            uint8 temp = shuffledScores[n];
            shuffledScores[n] = shuffledScores[i];
            shuffledScores[i] = temp;
            unchecked{ ++i; }
        }
        // return the shuffled array
        return shuffledScores;
    }

    ////////////////////////////////////////////////
    ///////////     OWNER FUNCTIONS      ///////////
    ////////////////////////////////////////////////

    /**
        Sets Gas Limits for VRF Callback
     */
    function setGasLimits(uint32 vrfGas_) external onlyOwner {
        vrfGas = vrfGas_;
    }

    function setVrfFee(uint256 vrfFee_) external onlyOwner {
        vrfFee = vrfFee_;
    }

    /**
        Sets The Address Of The Treasury
        @param treasury_ treasury address - cannot be 0
     */
    function setTreasury(address treasury_) external onlyOwner {
        if (treasury_ == address(0)) revert ZeroAddress();
        treasury = treasury_;
    }

    ////////////////////////////////////////////////
    ///////////      READ FUNCTIONS      ///////////
    ////////////////////////////////////////////////

    function getGameScores(uint256 gameId) public view returns (GameScore memory) {
        (
            uint8 homeQ1LastDigit,
            uint8 homeQ2LastDigit,
            uint8 homeQ3LastDigit,
            uint8 homeFLastDigit,
            uint8 awayQ1LastDigit,
            uint8 awayQ2LastDigit,
            uint8 awayQ3LastDigit,
            uint8 awayFLastDigit,
            uint8 qComplete,
            bool requestInProgress
        ) = gameScoreOracle.getGameScores(gameId);
        return GameScore({
            id: gameId,
            homeQ1LastDigit: homeQ1LastDigit,
            homeQ2LastDigit: homeQ2LastDigit,
            homeQ3LastDigit: homeQ3LastDigit,
            homeFLastDigit: homeFLastDigit,
            awayQ1LastDigit: awayQ1LastDigit,
            awayQ2LastDigit: awayQ2LastDigit,
            awayQ3LastDigit: awayQ3LastDigit,
            awayFLastDigit: awayFLastDigit,
            qComplete: qComplete,
            requestInProgress: requestInProgress
        });
    }
    /**
        Read all contests with owned boxes by user
     */
    function fetchAllContestsWithUser(address user) external view returns (uint256[] memory) {
        uint256 tokenCount = boxes.balanceOf(user);
        uint256[] memory contestIds = new uint256[](tokenCount);
        uint256 uniqueContestCount = 0;

        for (uint256 i = 0; i < tokenCount; i++) {
            uint256 tokenId = boxes.tokenOfOwnerByIndex(user, i);
            uint256 contestId = tokenId / 100;
            
            // Check if this contestId is already in the array
            bool isUnique = true;
            for (uint256 j = 0; j < uniqueContestCount; j++) {
                if (contestIds[j] == contestId) {
                    isUnique = false;
                    break;
                }
            }
            
            // If it's a unique contestId, add it to the array
            if (isUnique) {
                contestIds[uniqueContestCount] = contestId;
                uniqueContestCount++;
            }
        }

        // Create a new array with only the unique contest IDs
        uint256[] memory uniqueContestIds = new uint256[](uniqueContestCount);
        for (uint256 i = 0; i < uniqueContestCount; i++) {
            uniqueContestIds[i] = contestIds[i];
        }

        return uniqueContestIds;
    }

    /**
        Read all boxes by the contest
     */
    function fetchAllBoxesByContest(uint256 contestId) external pure returns (uint256[] memory tokenIds) {
        // get the 100 nfts that belong to this contest.
        // nfts 0-99 belong to game 0, 100-199 belong to game 1, etc.
        tokenIds = new uint256[](NUM_BOXES_IN_CONTEST);
        for (uint8 i = 0; i < NUM_BOXES_IN_CONTEST;) {
            tokenIds[i] = contestId * 100 + i;
            unchecked{ ++i; }
        }
    }

    /**
        Read the scores of the rows of a contest
     */
    function fetchContestRows(uint256 contestId) external view returns (uint8[] memory) {
        // fetch the contest object from the id
        Contest memory contest = contests[contestId];
        return (contest.rows);
    }

    /**
        Read the scores of the cols of a contest
     */
    function fetchContestCols(uint256 contestId) external view returns (uint8[] memory) {
        // fetch the contest object from the id
        Contest memory contest = contests[contestId];
        return (contest.cols);
    }

    function getTokenIdContestNumber(uint256 tokenId) public pure returns (uint256) {
        return tokenId / 100;
    }

    /**
     * @dev Whenever an {IERC721} `tokenId` token is transferred to this contract via {IERC721-safeTransferFrom}
     * by `operator` from `from`, this function is called.
     *
     * It must return its Solidity selector to confirm the token transfer.
     * If any other value is returned or the interface is not implemented by the recipient, the transfer will be reverted.
     *
     * The selector can be obtained in Solidity with `IERC721Receiver.onERC721Received.selector`.
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
