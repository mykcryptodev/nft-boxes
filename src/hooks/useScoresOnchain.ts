import { useCallback, useEffect, useState } from "react";
import { createThirdwebClient, getContract } from "thirdweb";

import { DEFAULT_CHAIN } from "~/constants";
import { CONTEST_CONTRACT } from "~/constants/addresses";
import { env } from "~/env";
import { getThirdwebChain } from "~/helpers/getThirdwebChain";
import useGameIdForContest from "~/hooks/useGameIdForContest";
import { getGameScores } from "~/thirdweb/84532/0xb9647d7982cefb104d332ba818b8971d76e7fa1f";

type ScoresOnChain = {
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

const useScoresOnchain = (contestId: string) => {
  const [data, setData] = useState<ScoresOnChain | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(undefined);
  const { data: gameId, isLoading: isLoadingGameId, error: gameIdError } = useGameIdForContest(contestId);

  const fetchGameScores = useCallback(async () => {
    if (!gameId) return;
    
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
        gameId,
      });
      setData(gameScores);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    void fetchGameScores();
  }, [gameId, fetchGameScores]);

  const refetch = () => {
    void fetchGameScores();
  };

  return {
    data,
    isLoading: isLoading || isLoadingGameId,
    error: error ?? gameIdError,
    refetch,
  }
}

export default useScoresOnchain;