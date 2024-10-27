// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;
import {Contests} from "./Contests.sol";
import {Boxes} from "./Boxes.sol";
import {IContestTypes} from "./IContestTypes.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ContestsReader is Ownable {
    Contests public contestStorage;
    
    uint256 private constant NUM_BOXES_IN_CONTEST = 100;
    
    constructor() Ownable(msg.sender) {}

    /**
        Read all contests with owned boxes by user
     */
    function fetchAllContestsWithUser(address user) external view returns (uint256[] memory) {
        Boxes boxes = Boxes(contestStorage.boxes());
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


    function calculateWinningQuarters(uint256 rowScore, uint256 colScore, IContestTypes.GameScore memory gameScores) public view returns (uint8[] memory) {
        uint8[] memory winningQuarters = new uint8[](4);
        uint8 winCount = 0;

        winCount = checkQuarter(winningQuarters, winCount, rowScore, colScore, gameScores.awayQ1LastDigit, gameScores.homeQ1LastDigit, gameScores.qComplete, 1);
        winCount = checkQuarter(winningQuarters, winCount, rowScore, colScore, gameScores.awayQ2LastDigit, gameScores.homeQ2LastDigit, gameScores.qComplete, 2);
        winCount = checkQuarter(winningQuarters, winCount, rowScore, colScore, gameScores.awayQ3LastDigit, gameScores.homeQ3LastDigit, gameScores.qComplete, 3);
        winCount = checkQuarter(winningQuarters, winCount, rowScore, colScore, gameScores.awayFLastDigit, gameScores.homeFLastDigit, gameScores.qComplete, 4);

        return trimWinningQuarters(winningQuarters, winCount);
    }

    function checkQuarter(uint8[] memory winningQuarters, uint8 winCount, uint256 rowScore, uint256 colScore, uint8 awayLastDigit, uint8 homeLastDigit, uint8 qComplete, uint8 quarter) internal view returns (uint8) {
        if (contestStorage.isWinner(rowScore, colScore, homeLastDigit, awayLastDigit, qComplete, quarter)) {
            winningQuarters[winCount] = quarter;
            return winCount + 1;
        }
        return winCount;
    }

    function trimWinningQuarters(uint8[] memory winningQuarters, uint8 winCount) internal pure returns (uint8[] memory) {
        uint8[] memory result = new uint8[](winCount);
        for (uint8 i = 0; i < winCount; i++) {
            result[i] = winningQuarters[i];
        }
        return result;
    }

    function setContestStorage(address _contestStorage) external onlyOwner {
        contestStorage = Contests(_contestStorage);
    }
}