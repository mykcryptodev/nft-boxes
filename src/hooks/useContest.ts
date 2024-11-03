import { useCallback, useEffect, useState } from "react";
import { createThirdwebClient, getContract } from "thirdweb";

import { DEFAULT_CHAIN } from "~/constants";
import { CONTEST_CONTRACT } from "~/constants/addresses";
import { env } from "~/env";
import { getThirdwebChain } from "~/helpers/getThirdwebChain";
import { contests, fetchContestCols, fetchContestRows } from "~/thirdweb/84532/0xb9647d7982cefb104d332ba818b8971d76e7fa1f";

export type Contest = {
  id: bigint;
  gameId: bigint;
  creator: string;
  boxCost: {
    currency: string;
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
};

const useContest = (contestId: string) => {
  const [data, setData] = useState<Contest | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(undefined);

  const fetchContest = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    const client = createThirdwebClient({
      clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    });
    const contract = getContract({
      chain: getThirdwebChain(DEFAULT_CHAIN),
      address: CONTEST_CONTRACT[DEFAULT_CHAIN.id]!,
      client,
    });
    try {
      const [contest, cols, rows] = await Promise.all([
        contests({
          contract,
          contestId: BigInt(contestId),
        }),
        fetchContestCols({
          contract,
          contestId: BigInt(contestId),
        }),
        fetchContestRows({
          contract,
          contestId: BigInt(contestId),
        }),
      ]);
      setData({
        id: contest[0],
        gameId: contest[1],
        creator: contest[2],
        boxCost: {
          currency: contest[3].currency,
          amount: contest[3].amount,
        },
        boxesCanBeClaimed: contest[4],
        rewardsPaid: contest[5],
        totalRewards: contest[6],
        boxesClaimed: contest[7],
        randomValuesSet: contest[8],
        cols,
        rows,
      });
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    void fetchContest();
  }, [contestId, fetchContest]);

  const refetch = () => {
    void fetchContest();
  };

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useContest; 