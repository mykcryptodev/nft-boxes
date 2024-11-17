import { useCallback, useEffect, useState } from "react";
import { createThirdwebClient, getContract } from "thirdweb";

import { DEFAULT_CHAIN } from "~/constants";
import { CONTEST_CONTRACT } from "~/constants/addresses";
import { env } from "~/env";
import { getThirdwebChain } from "~/helpers/getThirdwebChain";
import { getGameScores } from "~/thirdweb/84532/0x7bbc05e8e8eada7845fa106dfd3fc41a159b90f5";
import { type Contest,type ScoresOnChain } from "~/types/contest";

const useScoresOnchain = (contest: Contest | undefined) => {
  const [data, setData] = useState<ScoresOnChain | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(undefined);

  const fetchGameScores = useCallback(async () => {
    if (!contest?.gameId) return;
    
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
      const gameScores = await getGameScores({
        contract,
        gameId:contest.gameId,
      });
      setData(gameScores);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [contest?.gameId]);

  useEffect(() => {
    void fetchGameScores();
  }, [fetchGameScores]);

  const refetch = () => {
    void fetchGameScores();
  };

  return {
    data,
    isLoading,
    error,
    refetch,
  }
}

export default useScoresOnchain;