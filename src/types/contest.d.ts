import { type Address } from 'viem';

export type Contest = {
    id: bigint;
    gameId: bigint;
    creator: string;
    boxCost: {
        currency: Address;
        decimals: number;
        symbol: string;
        name: string;
        amount: bigint;
        image: string;
    };
    boxesCanBeClaimed: boolean;
    rewardsPaid: {
        q1Paid: boolean;
        q2Paid: boolean;
        q3Paid: boolean;
        finalPaid: boolean;
    };
    totalRewards: bigint;
    boxesClaimed: bigint;
    randomValuesSet: boolean;
    cols: number[];
    rows: number[];
    boxesAddress: Address;
    q1Paid: boolean;
    q2Paid: boolean;
    q3Paid: boolean;
    finalPaid: boolean;
};

export type ScoresOnChain = {
    awayFLastDigit: number;
    awayQ1LastDigit: number;
    awayQ2LastDigit: number;
    awayQ3LastDigit: number;
    homeFLastDigit: number;
    homeQ1LastDigit: number;
    homeQ2LastDigit: number;
    homeQ3LastDigit: number;
    id: bigint;
    qComplete: number;
    requestInProgress: boolean;
  }