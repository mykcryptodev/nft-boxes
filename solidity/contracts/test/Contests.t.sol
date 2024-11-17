// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.22;

// import "forge-std/Test.sol";
// import "../src/Contests.sol";
// import "../src/Boxes.sol";
// import "../src/GameScoreOracle.sol";
// import "./DummyVRF.sol";

// contract ContestsTest is Test {
//     Contests public contests;
//     Boxes public boxes;
//     GameScoreOracle public gameScoreOracle;
//     DummyVRF public dummyVRF;

//     address public treasury = address(1);
//     address public player1 = address(2);
//     address public player2 = address(3);

//     uint96 constant FUND_AMOUNT = 1 ether;
//     uint32 constant CALLBACK_GAS_LIMIT = 100000;
//     uint32 constant NUM_WORDS = 2;
//     uint16 constant REQUEST_CONFIRMATIONS = 3;

//     function setUp() public {
//         // Deploy dummy VRF
//         dummyVRF = new DummyVRF();

//         // Deploy Boxes contract
//         boxes = new Boxes();

//         // Deploy GameScoreOracle (you might need to mock this)
//         gameScoreOracle = new GameScoreOracle(
//             address(dummyVRF) // not really the router, but it's fine for testing
//         );

//         // Deploy Contests contract
//         contests = new Contests(
//           treasury, 
//           boxes,
//           gameScoreOracle, 
//           address(dummyVRF)
//         );

//         // Set the Contests contract address in Boxes
//         boxes.setContests(contests);

//         // Create and fund a subscription
//         uint64 subId = dummyVRF.createSubscription();
//         dummyVRF.fundSubscription(subId, FUND_AMOUNT);

//         // Add consumer to subscription
//         dummyVRF.addConsumer(subId, address(contests));
//     }

//     function testCreateContest() public {
//         uint256 gameId = 1;
//         uint256 boxCost = 0.1 ether;
//         address boxCurrency = address(0); // ETH

//         uint256 contestsBefore = contests.contestIdCounter();
//         contests.createContest(gameId, boxCost, boxCurrency);
//         uint256 contestsAfter = contests.contestIdCounter();

//         assertEq(contestsAfter, contestsBefore + 1, "Contest should be created");
//     }
// }
