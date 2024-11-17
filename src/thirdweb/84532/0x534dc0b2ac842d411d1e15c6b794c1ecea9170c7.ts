import {
  prepareEvent,
  prepareContractCall,
  readContract,
  type BaseTransactionOptions,
  type AbiParameterToPrimitiveType,
} from "thirdweb";

/**
* Contract events
*/

/**
 * Represents the filters for the "OwnershipTransferred" event.
 */
export type OwnershipTransferredEventFilters = Partial<{
  previousOwner: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"}>
newOwner: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}>
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
 *  previousOwner: ...,
 *  newOwner: ...,
 * })
 * ],
 * });
 * ```
 */
export function ownershipTransferredEvent(filters: OwnershipTransferredEventFilters = {}) {
  return prepareEvent({
    signature: "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
    filters,
  });
};
  

/**
* Contract read functions
*/

/**
 * Represents the parameters for the "calculateWinningQuarters" function.
 */
export type CalculateWinningQuartersParams = {
  rowScore: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"rowScore","type":"uint256"}>
colScore: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"colScore","type":"uint256"}>
gameScores: AbiParameterToPrimitiveType<{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint8","name":"homeQ1LastDigit","type":"uint8"},{"internalType":"uint8","name":"homeQ2LastDigit","type":"uint8"},{"internalType":"uint8","name":"homeQ3LastDigit","type":"uint8"},{"internalType":"uint8","name":"homeFLastDigit","type":"uint8"},{"internalType":"uint8","name":"awayQ1LastDigit","type":"uint8"},{"internalType":"uint8","name":"awayQ2LastDigit","type":"uint8"},{"internalType":"uint8","name":"awayQ3LastDigit","type":"uint8"},{"internalType":"uint8","name":"awayFLastDigit","type":"uint8"},{"internalType":"uint8","name":"qComplete","type":"uint8"},{"internalType":"bool","name":"requestInProgress","type":"bool"}],"internalType":"struct IContestTypes.GameScore","name":"gameScores","type":"tuple"}>
};

/**
 * Calls the "calculateWinningQuarters" function on the contract.
 * @param options - The options for the calculateWinningQuarters function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { calculateWinningQuarters } from "TODO";
 *
 * const result = await calculateWinningQuarters({
 *  rowScore: ...,
 *  colScore: ...,
 *  gameScores: ...,
 * });
 *
 * ```
 */
export async function calculateWinningQuarters(
  options: BaseTransactionOptions<CalculateWinningQuartersParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xba5ae884",
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
    params: [options.rowScore, options.colScore, options.gameScores]
  });
};




/**
 * Calls the "contestStorage" function on the contract.
 * @param options - The options for the contestStorage function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { contestStorage } from "TODO";
 *
 * const result = await contestStorage();
 *
 * ```
 */
export async function contestStorage(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x1bf43d40",
  [],
  [
    {
      "internalType": "contract Contests",
      "name": "",
      "type": "address"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "fetchAllBoxesByContest" function.
 */
export type FetchAllBoxesByContestParams = {
  contestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"contestId","type":"uint256"}>
};

/**
 * Calls the "fetchAllBoxesByContest" function on the contract.
 * @param options - The options for the fetchAllBoxesByContest function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { fetchAllBoxesByContest } from "TODO";
 *
 * const result = await fetchAllBoxesByContest({
 *  contestId: ...,
 * });
 *
 * ```
 */
export async function fetchAllBoxesByContest(
  options: BaseTransactionOptions<FetchAllBoxesByContestParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x394c5765",
  [
    {
      "internalType": "uint256",
      "name": "contestId",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "uint256[]",
      "name": "tokenIds",
      "type": "uint256[]"
    }
  ]
],
    params: [options.contestId]
  });
};


/**
 * Represents the parameters for the "fetchAllContestsWithUser" function.
 */
export type FetchAllContestsWithUserParams = {
  user: AbiParameterToPrimitiveType<{"internalType":"address","name":"user","type":"address"}>
};

/**
 * Calls the "fetchAllContestsWithUser" function on the contract.
 * @param options - The options for the fetchAllContestsWithUser function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { fetchAllContestsWithUser } from "TODO";
 *
 * const result = await fetchAllContestsWithUser({
 *  user: ...,
 * });
 *
 * ```
 */
export async function fetchAllContestsWithUser(
  options: BaseTransactionOptions<FetchAllContestsWithUserParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xcf84f2d4",
  [
    {
      "internalType": "address",
      "name": "user",
      "type": "address"
    }
  ],
  [
    {
      "internalType": "uint256[]",
      "name": "",
      "type": "uint256[]"
    }
  ]
],
    params: [options.user]
  });
};


/**
 * Represents the parameters for the "getContestCurrency" function.
 */
export type GetContestCurrencyParams = {
  contestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"contestId","type":"uint256"}>
};

/**
 * Calls the "getContestCurrency" function on the contract.
 * @param options - The options for the getContestCurrency function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getContestCurrency } from "TODO";
 *
 * const result = await getContestCurrency({
 *  contestId: ...,
 * });
 *
 * ```
 */
export async function getContestCurrency(
  options: BaseTransactionOptions<GetContestCurrencyParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xf6836720",
  [
    {
      "internalType": "uint256",
      "name": "contestId",
      "type": "uint256"
    }
  ],
  [
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
      "internalType": "string",
      "name": "",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    },
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
* Contract write functions
*/



/**
 * Calls the "renounceOwnership" function on the contract.
 * @param options - The options for the "renounceOwnership" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { renounceOwnership } from "TODO";
 *
 * const transaction = renounceOwnership();
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function renounceOwnership(
  options: BaseTransactionOptions
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x715018a6",
  [],
  []
],
    params: []
  });
};


/**
 * Represents the parameters for the "setContestStorage" function.
 */
export type SetContestStorageParams = {
  contestStorage: AbiParameterToPrimitiveType<{"internalType":"address","name":"_contestStorage","type":"address"}>
};

/**
 * Calls the "setContestStorage" function on the contract.
 * @param options - The options for the "setContestStorage" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { setContestStorage } from "TODO";
 *
 * const transaction = setContestStorage({
 *  contestStorage: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setContestStorage(
  options: BaseTransactionOptions<SetContestStorageParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x2caf321e",
  [
    {
      "internalType": "address",
      "name": "_contestStorage",
      "type": "address"
    }
  ],
  []
],
    params: [options.contestStorage]
  });
};


/**
 * Represents the parameters for the "transferOwnership" function.
 */
export type TransferOwnershipParams = {
  newOwner: AbiParameterToPrimitiveType<{"internalType":"address","name":"newOwner","type":"address"}>
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
 *  newOwner: ...,
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
      "name": "newOwner",
      "type": "address"
    }
  ],
  []
],
    params: [options.newOwner]
  });
};


