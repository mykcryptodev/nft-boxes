// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {IContests} from "../src/RandomNumbers.sol";
import {RandomNumbers} from "../src/RandomNumbers.sol";
import {DummyVRF} from "./DummyVRF.sol";

contract DummyRandomNumbers is DummyVRF, RandomNumbers {
    uint8[] private defaultScores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    constructor(address _vrfWrapper) 
        RandomNumbers(_vrfWrapper)
    {}

    function requestRandomNumbers(uint256 contestId) external payable override onlyContests {
        if (msg.value < vrfFee) revert InsufficientPayment();
        
        emit RandomNumberRequested(contestId, block.timestamp);
        
        // Immediately fulfill the request with deterministic values for testing
        // _fulfillRandomness(contestId);
    }

    function _fulfillRandomness(uint256 contestId) internal {
        // Generate deterministic shuffled scores for testing
        uint8[] memory rows = _shuffleScores(12345);
        uint8[] memory cols = _shuffleScores(67890);

        // Update the contest with the random numbers
        contests.fulfillRandomNumbers(contestId, rows, cols);
    }
}