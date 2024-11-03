import {
  type AbiParameterToPrimitiveType,
  type BaseTransactionOptions,
  prepareContractCall,
  prepareEvent,
  readContract,
} from "thirdweb";

/**
* Contract events
*/



/**
 * Creates an event object for the BoxClaimed event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { boxClaimedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  boxClaimedEvent()
 * ],
 * });
 * ```
 */
export function boxClaimedEvent() {
  return prepareEvent({
    signature: "event BoxClaimed(uint256 contestId, uint256 tokenId)",
  });
};
  



/**
 * Creates an event object for the ContestCreated event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { contestCreatedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  contestCreatedEvent()
 * ],
 * });
 * ```
 */
export function contestCreatedEvent() {
  return prepareEvent({
    signature: "event ContestCreated(uint256 contestId)",
  });
};
  

/**
 * Represents the filters for the "GameScoreError" event.
 */
export type GameScoreErrorEventFilters = Partial<{
  gameId: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"uint256","name":"gameId","type":"uint256"}>
}>;

/**
 * Creates an event object for the GameScoreError event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { gameScoreErrorEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  gameScoreErrorEvent({
 *  gameId: ...,
 * })
 * ],
 * });
 * ```
 */
export function gameScoreErrorEvent(filters: GameScoreErrorEventFilters = {}) {
  return prepareEvent({
    signature: "event GameScoreError(uint256 indexed gameId, bytes error)",
    filters,
  });
};
  

/**
 * Represents the filters for the "GameScoresRequested" event.
 */
export type GameScoresRequestedEventFilters = Partial<{
  gameId: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"uint256","name":"gameId","type":"uint256"}>
}>;

/**
 * Creates an event object for the GameScoresRequested event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { gameScoresRequestedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  gameScoresRequestedEvent({
 *  gameId: ...,
 * })
 * ],
 * });
 * ```
 */
export function gameScoresRequestedEvent(filters: GameScoresRequestedEventFilters = {}) {
  return prepareEvent({
    signature: "event GameScoresRequested(uint256 indexed gameId, bytes32 requestId)",
    filters,
  });
};
  

/**
 * Represents the filters for the "GameScoresUpdated" event.
 */
export type GameScoresUpdatedEventFilters = Partial<{
  gameId: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"uint256","name":"gameId","type":"uint256"}>
}>;

/**
 * Creates an event object for the GameScoresUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { gameScoresUpdatedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  gameScoresUpdatedEvent({
 *  gameId: ...,
 * })
 * ],
 * });
 * ```
 */
export function gameScoresUpdatedEvent(filters: GameScoresUpdatedEventFilters = {}) {
  return prepareEvent({
    signature: "event GameScoresUpdated(uint256 indexed gameId, bytes32 requestId)",
    filters,
  });
};
  

/**
 * Represents the filters for the "OwnershipTransferRequested" event.
 */
export type OwnershipTransferRequestedEventFilters = Partial<{
  from: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"from","type":"address"}>
to: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"to","type":"address"}>
}>;

/**
 * Creates an event object for the OwnershipTransferRequested event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { ownershipTransferRequestedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  ownershipTransferRequestedEvent({
 *  from: ...,
 *  to: ...,
 * })
 * ],
 * });
 * ```
 */
export function ownershipTransferRequestedEvent(filters: OwnershipTransferRequestedEventFilters = {}) {
  return prepareEvent({
    signature: "event OwnershipTransferRequested(address indexed from, address indexed to)",
    filters,
  });
};
  

/**
 * Represents the filters for the "OwnershipTransferred" event.
 */
export type OwnershipTransferredEventFilters = Partial<{
  from: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"from","type":"address"}>
to: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"to","type":"address"}>
}>;

/**
 * Creates an event object for the OwnershipTransferred event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { ownershipTransferredEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  ownershipTransferredEvent({
 *  from: ...,
 *  to: ...,
 * })
 * ],
 * });
 * ```
 */
export function ownershipTransferredEvent(filters: OwnershipTransferredEventFilters = {}) {
  return prepareEvent({
    signature: "event OwnershipTransferred(address indexed from, address indexed to)",
    filters,
  });
};
  



/**
 * Creates an event object for the ScoresAssigned event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { scoresAssignedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  scoresAssignedEvent()
 * ],
 * });
 * ```
 */
export function scoresAssignedEvent() {
  return prepareEvent({
    signature: "event ScoresAssigned(uint256 contestId)",
  });
};
  



/**
 * Creates an event object for the ScoresRequested event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { scoresRequestedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  scoresRequestedEvent()
 * ],
 * });
 * ```
 */
export function scoresRequestedEvent() {
  return prepareEvent({
    signature: "event ScoresRequested(uint256 contestId)",
  });
};
  

/**
* Contract read functions
*/



/**
 * Calls the "FINAL_PAYOUT" function on the contract.
 * @param options - The options for the FINAL_PAYOUT function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { FINAL_PAYOUT } from "TODO";
 *
 * const result = await FINAL_PAYOUT();
 *
 * ```
 */
export async function FINAL_PAYOUT(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x735cf2c4",
  [],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "PERCENT_DENOMINATOR" function on the contract.
 * @param options - The options for the PERCENT_DENOMINATOR function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { PERCENT_DENOMINATOR } from "TODO";
 *
 * const result = await PERCENT_DENOMINATOR();
 *
 * ```
 */
export async function PERCENT_DENOMINATOR(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x9e6c2959",
  [],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "Q1_PAYOUT" function on the contract.
 * @param options - The options for the Q1_PAYOUT function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { Q1_PAYOUT } from "TODO";
 *
 * const result = await Q1_PAYOUT();
 *
 * ```
 */
export async function Q1_PAYOUT(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xee33056b",
  [],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "Q2_PAYOUT" function on the contract.
 * @param options - The options for the Q2_PAYOUT function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { Q2_PAYOUT } from "TODO";
 *
 * const result = await Q2_PAYOUT();
 *
 * ```
 */
export async function Q2_PAYOUT(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x1fef8bcb",
  [],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "Q3_PAYOUT" function on the contract.
 * @param options - The options for the Q3_PAYOUT function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { Q3_PAYOUT } from "TODO";
 *
 * const result = await Q3_PAYOUT();
 *
 * ```
 */
export async function Q3_PAYOUT(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xe7c8a958",
  [],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "TREASURY_FEE" function on the contract.
 * @param options - The options for the TREASURY_FEE function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { TREASURY_FEE } from "TODO";
 *
 * const result = await TREASURY_FEE();
 *
 * ```
 */
export async function TREASURY_FEE(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x8ce1a483",
  [],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "boxes" function on the contract.
 * @param options - The options for the boxes function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { boxes } from "TODO";
 *
 * const result = await boxes();
 *
 * ```
 */
export async function boxes(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x63f0385c",
  [],
  [
    {
      "internalType": "contract Boxes",
      "name": "",
      "type": "address"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "contestIdCounter" function on the contract.
 * @param options - The options for the contestIdCounter function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { contestIdCounter } from "TODO";
 *
 * const result = await contestIdCounter();
 *
 * ```
 */
export async function contestIdCounter(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x7d375daa",
  [],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "contests" function.
 */
export type ContestsParams = {
  contestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"contestId","type":"uint256"}>
};

/**
 * Calls the "contests" function on the contract.
 * @param options - The options for the contests function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { contests } from "TODO";
 *
 * const result = await contests({
 *  contestId: ...,
 * });
 *
 * ```
 */
export async function contests(
  options: BaseTransactionOptions<ContestsParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x9d7ed738",
  [
    {
      "internalType": "uint256",
      "name": "contestId",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "id",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "gameId",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "creator",
      "type": "address"
    },
    {
      "components": [
        {
          "internalType": "address",
          "name": "currency",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "internalType": "struct IContestTypes.Cost",
      "name": "boxCost",
      "type": "tuple"
    },
    {
      "internalType": "bool",
      "name": "boxesCanBeClaimed",
      "type": "bool"
    },
    {
      "components": [
        {
          "internalType": "bool",
          "name": "q1Paid",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "q2Paid",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "q3Paid",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "finalPaid",
          "type": "bool"
        }
      ],
      "internalType": "struct IContestTypes.RewardPayment",
      "name": "rewardsPaid",
      "type": "tuple"
    },
    {
      "internalType": "uint256",
      "name": "totalRewards",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "boxesClaimed",
      "type": "uint256"
    },
    {
      "internalType": "bool",
      "name": "randomValuesSet",
      "type": "bool"
    }
  ]
],
    params: [options.contestId]
  });
};


/**
 * Represents the parameters for the "contestsByUser" function.
 */
export type ContestsByUserParams = {
  creator: AbiParameterToPrimitiveType<{"internalType":"address","name":"creator","type":"address"}>
arg_1: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
};

/**
 * Calls the "contestsByUser" function on the contract.
 * @param options - The options for the contestsByUser function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { contestsByUser } from "TODO";
 *
 * const result = await contestsByUser({
 *  creator: ...,
 *  arg_1: ...,
 * });
 *
 * ```
 */
export async function contestsByUser(
  options: BaseTransactionOptions<ContestsByUserParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x08a0a31e",
  [
    {
      "internalType": "address",
      "name": "creator",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "contestId",
      "type": "uint256"
    }
  ]
],
    params: [options.creator, options.arg_1]
  });
};




/**
 * Calls the "contestsReader" function on the contract.
 * @param options - The options for the contestsReader function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { contestsReader } from "TODO";
 *
 * const result = await contestsReader();
 *
 * ```
 */
export async function contestsReader(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x826f75d5",
  [],
  [
    {
      "internalType": "contract ContestsReader",
      "name": "",
      "type": "address"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "fetchBoxScores" function.
 */
export type FetchBoxScoresParams = {
  contestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"contestId","type":"uint256"}>
tokenId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"tokenId","type":"uint256"}>
};

/**
 * Calls the "fetchBoxScores" function on the contract.
 * @param options - The options for the fetchBoxScores function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { fetchBoxScores } from "TODO";
 *
 * const result = await fetchBoxScores({
 *  contestId: ...,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function fetchBoxScores(
  options: BaseTransactionOptions<FetchBoxScoresParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xa070a066",
  [
    {
      "internalType": "uint256",
      "name": "contestId",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "rowScore",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "colScore",
      "type": "uint256"
    }
  ]
],
    params: [options.contestId, options.tokenId]
  });
};


/**
 * Represents the parameters for the "fetchContestCols" function.
 */
export type FetchContestColsParams = {
  contestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"contestId","type":"uint256"}>
};

/**
 * Calls the "fetchContestCols" function on the contract.
 * @param options - The options for the fetchContestCols function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { fetchContestCols } from "TODO";
 *
 * const result = await fetchContestCols({
 *  contestId: ...,
 * });
 *
 * ```
 */
export async function fetchContestCols(
  options: BaseTransactionOptions<FetchContestColsParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xb959c5eb",
  [
    {
      "internalType": "uint256",
      "name": "contestId",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "uint8[]",
      "name": "",
      "type": "uint8[]"
    }
  ]
],
    params: [options.contestId]
  });
};


/**
 * Represents the parameters for the "fetchContestRows" function.
 */
export type FetchContestRowsParams = {
  contestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"contestId","type":"uint256"}>
};

/**
 * Calls the "fetchContestRows" function on the contract.
 * @param options - The options for the fetchContestRows function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { fetchContestRows } from "TODO";
 *
 * const result = await fetchContestRows({
 *  contestId: ...,
 * });
 *
 * ```
 */
export async function fetchContestRows(
  options: BaseTransactionOptions<FetchContestRowsParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xf99484a8",
  [
    {
      "internalType": "uint256",
      "name": "contestId",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "uint8[]",
      "name": "",
      "type": "uint8[]"
    }
  ]
],
    params: [options.contestId]
  });
};




/**
 * Calls the "gameScoreOracle" function on the contract.
 * @param options - The options for the gameScoreOracle function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { gameScoreOracle } from "TODO";
 *
 * const result = await gameScoreOracle();
 *
 * ```
 */
export async function gameScoreOracle(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xdd17da4e",
  [],
  [
    {
      "internalType": "contract GameScoreOracle",
      "name": "",
      "type": "address"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "getBalance" function on the contract.
 * @param options - The options for the getBalance function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getBalance } from "TODO";
 *
 * const result = await getBalance();
 *
 * ```
 */
export async function getBalance(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x12065fe0",
  [],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "getGameIdForContest" function.
 */
export type GetGameIdForContestParams = {
  contestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"contestId","type":"uint256"}>
};

/**
 * Calls the "getGameIdForContest" function on the contract.
 * @param options - The options for the getGameIdForContest function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getGameIdForContest } from "TODO";
 *
 * const result = await getGameIdForContest({
 *  contestId: ...,
 * });
 *
 * ```
 */
export async function getGameIdForContest(
  options: BaseTransactionOptions<GetGameIdForContestParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xb76bcbd5",
  [
    {
      "internalType": "uint256",
      "name": "contestId",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: [options.contestId]
  });
};


/**
 * Represents the parameters for the "getGameScores" function.
 */
export type GetGameScoresParams = {
  gameId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"gameId","type":"uint256"}>
};

/**
 * Calls the "getGameScores" function on the contract.
 * @param options - The options for the getGameScores function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getGameScores } from "TODO";
 *
 * const result = await getGameScores({
 *  gameId: ...,
 * });
 *
 * ```
 */
export async function getGameScores(
  options: BaseTransactionOptions<GetGameScoresParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x55985b8f",
  [
    {
      "internalType": "uint256",
      "name": "gameId",
      "type": "uint256"
    }
  ],
  [
    {
      "components": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "homeQ1LastDigit",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "homeQ2LastDigit",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "homeQ3LastDigit",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "homeFLastDigit",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "awayQ1LastDigit",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "awayQ2LastDigit",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "awayQ3LastDigit",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "awayFLastDigit",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "qComplete",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "requestInProgress",
          "type": "bool"
        }
      ],
      "internalType": "struct IContestTypes.GameScore",
      "name": "",
      "type": "tuple"
    }
  ]
],
    params: [options.gameId]
  });
};




/**
 * Calls the "getLinkToken" function on the contract.
 * @param options - The options for the getLinkToken function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getLinkToken } from "TODO";
 *
 * const result = await getLinkToken();
 *
 * ```
 */
export async function getLinkToken(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xe76d5168",
  [],
  [
    {
      "internalType": "contract LinkTokenInterface",
      "name": "",
      "type": "address"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "getTokenIdContestNumber" function.
 */
export type GetTokenIdContestNumberParams = {
  tokenId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"tokenId","type":"uint256"}>
};

/**
 * Calls the "getTokenIdContestNumber" function on the contract.
 * @param options - The options for the getTokenIdContestNumber function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getTokenIdContestNumber } from "TODO";
 *
 * const result = await getTokenIdContestNumber({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getTokenIdContestNumber(
  options: BaseTransactionOptions<GetTokenIdContestNumberParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xab4b7094",
  [
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: [options.tokenId]
  });
};


/**
 * Represents the parameters for the "getWinningQuarters" function.
 */
export type GetWinningQuartersParams = {
  contestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"contestId","type":"uint256"}>
rowScore: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"rowScore","type":"uint256"}>
colScore: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"colScore","type":"uint256"}>
gameScores: AbiParameterToPrimitiveType<{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint8","name":"homeQ1LastDigit","type":"uint8"},{"internalType":"uint8","name":"homeQ2LastDigit","type":"uint8"},{"internalType":"uint8","name":"homeQ3LastDigit","type":"uint8"},{"internalType":"uint8","name":"homeFLastDigit","type":"uint8"},{"internalType":"uint8","name":"awayQ1LastDigit","type":"uint8"},{"internalType":"uint8","name":"awayQ2LastDigit","type":"uint8"},{"internalType":"uint8","name":"awayQ3LastDigit","type":"uint8"},{"internalType":"uint8","name":"awayFLastDigit","type":"uint8"},{"internalType":"uint8","name":"qComplete","type":"uint8"},{"internalType":"bool","name":"requestInProgress","type":"bool"}],"internalType":"struct IContestTypes.GameScore","name":"gameScores","type":"tuple"}>
};

/**
 * Calls the "getWinningQuarters" function on the contract.
 * @param options - The options for the getWinningQuarters function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getWinningQuarters } from "TODO";
 *
 * const result = await getWinningQuarters({
 *  contestId: ...,
 *  rowScore: ...,
 *  colScore: ...,
 *  gameScores: ...,
 * });
 *
 * ```
 */
export async function getWinningQuarters(
  options: BaseTransactionOptions<GetWinningQuartersParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x6cecf9e6",
  [
    {
      "internalType": "uint256",
      "name": "contestId",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "rowScore",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "colScore",
      "type": "uint256"
    },
    {
      "components": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "homeQ1LastDigit",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "homeQ2LastDigit",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "homeQ3LastDigit",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "homeFLastDigit",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "awayQ1LastDigit",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "awayQ2LastDigit",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "awayQ3LastDigit",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "awayFLastDigit",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "qComplete",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "requestInProgress",
          "type": "bool"
        }
      ],
      "internalType": "struct IContestTypes.GameScore",
      "name": "gameScores",
      "type": "tuple"
    }
  ],
  [
    {
      "internalType": "uint8[]",
      "name": "",
      "type": "uint8[]"
    }
  ]
],
    params: [options.contestId, options.rowScore, options.colScore, options.gameScores]
  });
};




/**
 * Calls the "i_vrfV2PlusWrapper" function on the contract.
 * @param options - The options for the i_vrfV2PlusWrapper function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { i_vrfV2PlusWrapper } from "TODO";
 *
 * const result = await i_vrfV2PlusWrapper();
 *
 * ```
 */
export async function i_vrfV2PlusWrapper(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x9ed0868d",
  [],
  [
    {
      "internalType": "contract IVRFV2PlusWrapper",
      "name": "",
      "type": "address"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "isRewardPaidForQuarter" function.
 */
export type IsRewardPaidForQuarterParams = {
  contestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"contestId","type":"uint256"}>
quarter: AbiParameterToPrimitiveType<{"internalType":"uint8","name":"quarter","type":"uint8"}>
};

/**
 * Calls the "isRewardPaidForQuarter" function on the contract.
 * @param options - The options for the isRewardPaidForQuarter function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isRewardPaidForQuarter } from "TODO";
 *
 * const result = await isRewardPaidForQuarter({
 *  contestId: ...,
 *  quarter: ...,
 * });
 *
 * ```
 */
export async function isRewardPaidForQuarter(
  options: BaseTransactionOptions<IsRewardPaidForQuarterParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x642f10ed",
  [
    {
      "internalType": "uint256",
      "name": "contestId",
      "type": "uint256"
    },
    {
      "internalType": "uint8",
      "name": "quarter",
      "type": "uint8"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.contestId, options.quarter]
  });
};


/**
 * Represents the parameters for the "isWinner" function.
 */
export type IsWinnerParams = {
  rowScore: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"rowScore","type":"uint256"}>
colScore: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"colScore","type":"uint256"}>
homeLastDigit: AbiParameterToPrimitiveType<{"internalType":"uint8","name":"homeLastDigit","type":"uint8"}>
awayLastDigit: AbiParameterToPrimitiveType<{"internalType":"uint8","name":"awayLastDigit","type":"uint8"}>
qComplete: AbiParameterToPrimitiveType<{"internalType":"uint8","name":"qComplete","type":"uint8"}>
quarter: AbiParameterToPrimitiveType<{"internalType":"uint8","name":"quarter","type":"uint8"}>
};

/**
 * Calls the "isWinner" function on the contract.
 * @param options - The options for the isWinner function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isWinner } from "TODO";
 *
 * const result = await isWinner({
 *  rowScore: ...,
 *  colScore: ...,
 *  homeLastDigit: ...,
 *  awayLastDigit: ...,
 *  qComplete: ...,
 *  quarter: ...,
 * });
 *
 * ```
 */
export async function isWinner(
  options: BaseTransactionOptions<IsWinnerParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x7f1debe6",
  [
    {
      "internalType": "uint256",
      "name": "rowScore",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "colScore",
      "type": "uint256"
    },
    {
      "internalType": "uint8",
      "name": "homeLastDigit",
      "type": "uint8"
    },
    {
      "internalType": "uint8",
      "name": "awayLastDigit",
      "type": "uint8"
    },
    {
      "internalType": "uint8",
      "name": "qComplete",
      "type": "uint8"
    },
    {
      "internalType": "uint8",
      "name": "quarter",
      "type": "uint8"
    }
  ],
  [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ]
],
    params: [options.rowScore, options.colScore, options.homeLastDigit, options.awayLastDigit, options.qComplete, options.quarter]
  });
};




/**
 * Calls the "nextTokenId" function on the contract.
 * @param options - The options for the nextTokenId function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { nextTokenId } from "TODO";
 *
 * const result = await nextTokenId();
 *
 * ```
 */
export async function nextTokenId(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x75794a3c",
  [],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "onERC721Received" function.
 */
export type OnERC721ReceivedParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"address","name":"","type":"address"}>
arg_1: AbiParameterToPrimitiveType<{"internalType":"address","name":"","type":"address"}>
arg_2: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
arg_3: AbiParameterToPrimitiveType<{"internalType":"bytes","name":"","type":"bytes"}>
};

/**
 * Calls the "onERC721Received" function on the contract.
 * @param options - The options for the onERC721Received function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { onERC721Received } from "TODO";
 *
 * const result = await onERC721Received({
 *  arg_0: ...,
 *  arg_1: ...,
 *  arg_2: ...,
 *  arg_3: ...,
 * });
 *
 * ```
 */
export async function onERC721Received(
  options: BaseTransactionOptions<OnERC721ReceivedParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x150b7a02",
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    },
    {
      "internalType": "bytes",
      "name": "",
      "type": "bytes"
    }
  ],
  [
    {
      "internalType": "bytes4",
      "name": "",
      "type": "bytes4"
    }
  ]
],
    params: [options.arg_0, options.arg_1, options.arg_2, options.arg_3]
  });
};




/**
 * Calls the "owner" function on the contract.
 * @param options - The options for the owner function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { owner } from "TODO";
 *
 * const result = await owner();
 *
 * ```
 */
export async function owner(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x8da5cb5b",
  [],
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "treasury" function on the contract.
 * @param options - The options for the treasury function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { treasury } from "TODO";
 *
 * const result = await treasury();
 *
 * ```
 */
export async function treasury(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x61d027b3",
  [],
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "vrfFee" function on the contract.
 * @param options - The options for the vrfFee function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { vrfFee } from "TODO";
 *
 * const result = await vrfFee();
 *
 * ```
 */
export async function vrfFee(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x1017507d",
  [],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "vrfGas" function on the contract.
 * @param options - The options for the vrfGas function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { vrfGas } from "TODO";
 *
 * const result = await vrfGas();
 *
 * ```
 */
export async function vrfGas(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x997430fa",
  [],
  [
    {
      "internalType": "uint32",
      "name": "",
      "type": "uint32"
    }
  ]
],
    params: []
  });
};


/**
* Contract write functions
*/



/**
 * Calls the "acceptOwnership" function on the contract.
 * @param options - The options for the "acceptOwnership" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { acceptOwnership } from "TODO";
 *
 * const transaction = acceptOwnership();
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function acceptOwnership(
  options: BaseTransactionOptions
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x79ba5097",
  [],
  []
],
    params: []
  });
};


/**
 * Represents the parameters for the "claimBoxes" function.
 */
export type ClaimBoxesParams = {
  tokenIds: AbiParameterToPrimitiveType<{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"}>
player: AbiParameterToPrimitiveType<{"internalType":"address","name":"player","type":"address"}>
};

/**
 * Calls the "claimBoxes" function on the contract.
 * @param options - The options for the "claimBoxes" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { claimBoxes } from "TODO";
 *
 * const transaction = claimBoxes({
 *  tokenIds: ...,
 *  player: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function claimBoxes(
  options: BaseTransactionOptions<ClaimBoxesParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x92a54cac",
  [
    {
      "internalType": "uint256[]",
      "name": "tokenIds",
      "type": "uint256[]"
    },
    {
      "internalType": "address",
      "name": "player",
      "type": "address"
    }
  ],
  []
],
    params: [options.tokenIds, options.player]
  });
};


/**
 * Represents the parameters for the "claimReward" function.
 */
export type ClaimRewardParams = {
  contestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"contestId","type":"uint256"}>
tokenId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"tokenId","type":"uint256"}>
};

/**
 * Calls the "claimReward" function on the contract.
 * @param options - The options for the "claimReward" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { claimReward } from "TODO";
 *
 * const transaction = claimReward({
 *  contestId: ...,
 *  tokenId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function claimReward(
  options: BaseTransactionOptions<ClaimRewardParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x86bb8f37",
  [
    {
      "internalType": "uint256",
      "name": "contestId",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.contestId, options.tokenId]
  });
};


/**
 * Represents the parameters for the "createContest" function.
 */
export type CreateContestParams = {
  gameId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"gameId","type":"uint256"}>
boxCost: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"boxCost","type":"uint256"}>
boxCurrency: AbiParameterToPrimitiveType<{"internalType":"address","name":"boxCurrency","type":"address"}>
};

/**
 * Calls the "createContest" function on the contract.
 * @param options - The options for the "createContest" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { createContest } from "TODO";
 *
 * const transaction = createContest({
 *  gameId: ...,
 *  boxCost: ...,
 *  boxCurrency: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createContest(
  options: BaseTransactionOptions<CreateContestParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x351118af",
  [
    {
      "internalType": "uint256",
      "name": "gameId",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "boxCost",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "boxCurrency",
      "type": "address"
    }
  ],
  []
],
    params: [options.gameId, options.boxCost, options.boxCurrency]
  });
};


/**
 * Represents the parameters for the "fetchFreshGameScores" function.
 */
export type FetchFreshGameScoresParams = {
  args: AbiParameterToPrimitiveType<{"internalType":"string[]","name":"args","type":"string[]"}>
subscriptionId: AbiParameterToPrimitiveType<{"internalType":"uint64","name":"subscriptionId","type":"uint64"}>
gasLimit: AbiParameterToPrimitiveType<{"internalType":"uint32","name":"gasLimit","type":"uint32"}>
jobId: AbiParameterToPrimitiveType<{"internalType":"bytes32","name":"jobId","type":"bytes32"}>
gameId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"gameId","type":"uint256"}>
};

/**
 * Calls the "fetchFreshGameScores" function on the contract.
 * @param options - The options for the "fetchFreshGameScores" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { fetchFreshGameScores } from "TODO";
 *
 * const transaction = fetchFreshGameScores({
 *  args: ...,
 *  subscriptionId: ...,
 *  gasLimit: ...,
 *  jobId: ...,
 *  gameId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function fetchFreshGameScores(
  options: BaseTransactionOptions<FetchFreshGameScoresParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xf1934333",
  [
    {
      "internalType": "string[]",
      "name": "args",
      "type": "string[]"
    },
    {
      "internalType": "uint64",
      "name": "subscriptionId",
      "type": "uint64"
    },
    {
      "internalType": "uint32",
      "name": "gasLimit",
      "type": "uint32"
    },
    {
      "internalType": "bytes32",
      "name": "jobId",
      "type": "bytes32"
    },
    {
      "internalType": "uint256",
      "name": "gameId",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.args, options.subscriptionId, options.gasLimit, options.jobId, options.gameId]
  });
};


/**
 * Represents the parameters for the "fetchRandomValues" function.
 */
export type FetchRandomValuesParams = {
  contestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_contestId","type":"uint256"}>
};

/**
 * Calls the "fetchRandomValues" function on the contract.
 * @param options - The options for the "fetchRandomValues" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { fetchRandomValues } from "TODO";
 *
 * const transaction = fetchRandomValues({
 *  contestId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function fetchRandomValues(
  options: BaseTransactionOptions<FetchRandomValuesParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x9c0c9cea",
  [
    {
      "internalType": "uint256",
      "name": "_contestId",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.contestId]
  });
};


/**
 * Represents the parameters for the "rawFulfillRandomWords" function.
 */
export type RawFulfillRandomWordsParams = {
  requestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"_requestId","type":"uint256"}>
randomWords: AbiParameterToPrimitiveType<{"internalType":"uint256[]","name":"_randomWords","type":"uint256[]"}>
};

/**
 * Calls the "rawFulfillRandomWords" function on the contract.
 * @param options - The options for the "rawFulfillRandomWords" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { rawFulfillRandomWords } from "TODO";
 *
 * const transaction = rawFulfillRandomWords({
 *  requestId: ...,
 *  randomWords: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function rawFulfillRandomWords(
  options: BaseTransactionOptions<RawFulfillRandomWordsParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x1fe543e3",
  [
    {
      "internalType": "uint256",
      "name": "_requestId",
      "type": "uint256"
    },
    {
      "internalType": "uint256[]",
      "name": "_randomWords",
      "type": "uint256[]"
    }
  ],
  []
],
    params: [options.requestId, options.randomWords]
  });
};


/**
 * Represents the parameters for the "setGasLimits" function.
 */
export type SetGasLimitsParams = {
  vrfGas_: AbiParameterToPrimitiveType<{"internalType":"uint32","name":"vrfGas_","type":"uint32"}>
};

/**
 * Calls the "setGasLimits" function on the contract.
 * @param options - The options for the "setGasLimits" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { setGasLimits } from "TODO";
 *
 * const transaction = setGasLimits({
 *  vrfGas_: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setGasLimits(
  options: BaseTransactionOptions<SetGasLimitsParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x74e2225d",
  [
    {
      "internalType": "uint32",
      "name": "vrfGas_",
      "type": "uint32"
    }
  ],
  []
],
    params: [options.vrfGas_]
  });
};


/**
 * Represents the parameters for the "setTreasury" function.
 */
export type SetTreasuryParams = {
  treasury_: AbiParameterToPrimitiveType<{"internalType":"address","name":"treasury_","type":"address"}>
};

/**
 * Calls the "setTreasury" function on the contract.
 * @param options - The options for the "setTreasury" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { setTreasury } from "TODO";
 *
 * const transaction = setTreasury({
 *  treasury_: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setTreasury(
  options: BaseTransactionOptions<SetTreasuryParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xf0f44260",
  [
    {
      "internalType": "address",
      "name": "treasury_",
      "type": "address"
    }
  ],
  []
],
    params: [options.treasury_]
  });
};


/**
 * Represents the parameters for the "setVrfFee" function.
 */
export type SetVrfFeeParams = {
  vrfFee_: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"vrfFee_","type":"uint256"}>
};

/**
 * Calls the "setVrfFee" function on the contract.
 * @param options - The options for the "setVrfFee" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { setVrfFee } from "TODO";
 *
 * const transaction = setVrfFee({
 *  vrfFee_: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setVrfFee(
  options: BaseTransactionOptions<SetVrfFeeParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xa2ddeab9",
  [
    {
      "internalType": "uint256",
      "name": "vrfFee_",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.vrfFee_]
  });
};


/**
 * Represents the parameters for the "transferOwnership" function.
 */
export type TransferOwnershipParams = {
  to: AbiParameterToPrimitiveType<{"internalType":"address","name":"to","type":"address"}>
};

/**
 * Calls the "transferOwnership" function on the contract.
 * @param options - The options for the "transferOwnership" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { transferOwnership } from "TODO";
 *
 * const transaction = transferOwnership({
 *  to: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function transferOwnership(
  options: BaseTransactionOptions<TransferOwnershipParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xf2fde38b",
  [
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    }
  ],
  []
],
    params: [options.to]
  });
};


