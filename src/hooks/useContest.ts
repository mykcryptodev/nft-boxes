import { useCallback, useEffect, useState } from "react";
import { createThirdwebClient, getContract } from "thirdweb";

import { CACHE_CONTESTS, DEFAULT_CHAIN } from "~/constants";
import { CONTEST_CONTRACT, CONTEST_READER_CONTRACT } from "~/constants/addresses";
import { env } from "~/env";
import { getThirdwebChain } from "~/helpers/getThirdwebChain";
import { boxes, contests, fetchContestCols, fetchContestRows, isRewardPaidForQuarter } from "~/thirdweb/84532/0x7bbc05e8e8eada7845fa106dfd3fc41a159b90f5";
import { getContestCurrency } from "~/thirdweb/84532/0x534dc0b2ac842d411d1e15c6b794c1ecea9170c7";
import { type Contest } from "~/types/contest";
import { api } from "~/utils/api";

const useContest = (contestId: string) => {
  const [data, setData] = useState<Contest | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(undefined);

  const { mutateAsync: getTokenImage } = api.coingecko.getTokenImage.useMutation();
  const { data: cachedContest } = api.contest.getCached.useQuery(
    { contestId }, 
    { 
      enabled: CACHE_CONTESTS,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    }
  );
  const { mutateAsync: setContestCache } = api.contest.setCache.useMutation();

  const fetchContest = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);

    // If we have cached data, use it immediately
    if (cachedContest && CACHE_CONTESTS) {
      setData(cachedContest as Contest);
      setIsLoading(false);
      return;
    }

    const client = createThirdwebClient({
      clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    });
    const contract = getContract({
      chain: getThirdwebChain(DEFAULT_CHAIN),
      address: CONTEST_CONTRACT[DEFAULT_CHAIN.id]!,
      client,
    });
    const readerContract = getContract({
      chain: getThirdwebChain(DEFAULT_CHAIN),
      address: CONTEST_READER_CONTRACT[DEFAULT_CHAIN.id]!,
      client,
    });
    try {
      const [
        contest, 
        cols, 
        rows, 
        boxesAddress,
        q1Paid,
        q2Paid,
        q3Paid,
        finalPaid,
        currency,
      ] = await Promise.all([
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
        boxes({
          contract,
        }),
        isRewardPaidForQuarter({
          contract,
          contestId: BigInt(contestId),
          quarter: 1,
        }),
        isRewardPaidForQuarter({
          contract,
          contestId: BigInt(contestId),
          quarter: 2,
        }),
        isRewardPaidForQuarter({
          contract,
          contestId: BigInt(contestId),
          quarter: 3,
        }),
        isRewardPaidForQuarter({
          contract,
          contestId: BigInt(contestId),
          quarter: 4,
        }),
        getContestCurrency({
          contract: readerContract,
          contestId: BigInt(contestId),
        })
      ]);
      const tokenImage = await getTokenImage({
        chainId: DEFAULT_CHAIN.id,
        tokenAddress: currency[0],
      });
      const contestData: Contest = {
        id: contest[0],
        gameId: contest[1],
        creator: contest[2],
        boxCost: {
          currency: contest[3].currency,
          amount: contest[3].amount,
          decimals: Number(currency[1]),
          symbol: currency[2],
          name: currency[3],
          image: tokenImage,
        },
        boxesCanBeClaimed: contest[4],
        rewardsPaid: {
          q1Paid,
          q2Paid,
          q3Paid,
          finalPaid,
        },
        totalRewards: contest[6],
        boxesClaimed: contest[7],
        randomValuesSet: contest[8],
        cols: cols.map(Number),
        rows: rows.map(Number),
        boxesAddress,
        q1Paid,
        q2Paid,
        q3Paid,
        finalPaid,
      };
      setData(contestData);

      // Cache the contest data
      if (CACHE_CONTESTS) {
        await setContestCache({
          contestId,
          contestData,
        });
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [contestId, getTokenImage, setContestCache]);

  useEffect(() => {
    void fetchContest();
  }, [contestId, fetchContest]);

  const refetch = useCallback(() => {
    void fetchContest();
  }, [fetchContest]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};

export default useContest; 