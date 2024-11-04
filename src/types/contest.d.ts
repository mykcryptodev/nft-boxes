import { type Address } from 'viem';

export type Contest = {
    id: bigint;
    gameId: bigint;
    creator: string;
    boxCost: {
        currency: Address;
        amount: bigint;
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
    cols: readonly number[];
    rows: readonly number[];
    boxesAddress: Address;
};
