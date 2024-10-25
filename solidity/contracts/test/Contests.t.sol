// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Test.sol";
import "../src/Contests.sol";
import "../src/Boxes.sol";
import "../src/GameScoreOracle.sol";
import "./DummyVRF.sol";

contract ContestsTest is Test {
    Contests public contests;
    Boxes public boxes;
    GameScoreOracle public gameScoreOracle;
    DummyVRF public dummyVRF;

    address public treasury = address(1);
    address public player1 = address(2);
    address public player2 = address(3);

    uint96 constant FUND_AMOUNT = 1 ether;
    uint32 constant CALLBACK_GAS_LIMIT = 100000;
    uint32 constant NUM_WORDS = 2;
    uint16 constant REQUEST_CONFIRMATIONS = 3;

    function setUp() public {
        // Deploy dummy VRF
        dummyVRF = new DummyVRF();

        // Deploy Boxes contract
        boxes = new Boxes();

        // Deploy GameScoreOracle (you might need to mock this)
        gameScoreOracle = new GameScoreOracle(
            address(dummyVRF) // not really the router, but it's fine for testing
        );

        // Deploy Contests contract
        contests = new Contests(
          treasury, 
          boxes,
          gameScoreOracle, 
          address(dummyVRF)
        );

        // Set the Contests contract address in Boxes
        boxes.setContests(address(contests));

        // Create and fund a subscription
        uint64 subId = dummyVRF.createSubscription();
        dummyVRF.fundSubscription(subId, FUND_AMOUNT);

        // Add consumer to subscription
        dummyVRF.addConsumer(subId, address(contests));
    }

    function testCreateContest() public {
        uint256 gameId = 1;
        uint256 boxCost = 0.1 ether;
        address boxCurrency = address(0); // ETH

        uint256 contestsBefore = contests.contestIdCounter();
        contests.createContest(gameId, boxCost, boxCurrency);
        uint256 contestsAfter = contests.contestIdCounter();

        assertEq(contestsAfter, contestsBefore + 1, "Contest should be created");
    }

    function testClaimBoxes() public {
        // First create a contest
        uint256 gameId = 1;
        uint256 boxCost = 0.1 ether;
        address boxCurrency = address(0); // ETH
        contests.createContest(gameId, boxCost, boxCurrency);

        // Prepare to claim boxes
        uint256 contestId = 0; // First contest
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = 0;
        tokenIds[1] = 1;

        // Claim boxes
        vm.deal(player1, 1 ether); // Give player1 some ETH
        vm.prank(player1);
        contests.claimBoxes{value: 0.2 ether}(contestId, tokenIds, player1);

        // Check if boxes are claimed
        assertEq(boxes.ownerOf(0), player1, "Player1 should own box 0");
        assertEq(boxes.ownerOf(1), player1, "Player1 should own box 1");
    }

    function testFetchAllContestsWithUser() public {
        // Create multiple contests and claim boxes for a user
        contests.createContest(1, 0.1 ether, address(0));
        contests.createContest(2, 0.1 ether, address(0));

        vm.startPrank(player1);
        vm.deal(player1, 1 ether);

        uint256[] memory tokenIds1 = new uint256[](1);
        tokenIds1[0] = 0;
        contests.claimBoxes{value: 0.1 ether}(0, tokenIds1, player1);

        uint256[] memory tokenIds2 = new uint256[](1);
        tokenIds2[0] = 100;
        contests.claimBoxes{value: 0.1 ether}(1, tokenIds2, player1);

        vm.stopPrank();

        uint256[] memory userContests = contests.fetchAllContestsWithUser(player1);
        assertEq(userContests.length, 2, "Player should be in 2 contests");
        assertEq(userContests[0], 0, "First contest should be 0");
        assertEq(userContests[1], 1, "Second contest should be 1");
    }

}
