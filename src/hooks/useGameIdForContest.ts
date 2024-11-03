import { useCallback, useEffect, useState } from "react";
import { createThirdwebClient, getContract } from "thirdweb";

import { DEFAULT_CHAIN } from "~/constants";
import { CONTEST_CONTRACT } from "~/constants/addresses";
import { env } from "~/env";
import { getThirdwebChain } from "~/helpers/getThirdwebChain";
import { getGameIdForContest } from "~/thirdweb/84532/0xb9647d7982cefb104d332ba818b8971d76e7fa1f";

const useGameIdForContest = (contestId: string) => {
  const [data, setData] = useState<bigint | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(undefined);

  const fetchGameId = useCallback(async () => {
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
      const gameId = await getGameIdForContest({
        contract,
        contestId: BigInt(contestId),
      });
      setData(gameId);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    void fetchGameId();
  }, [contestId, fetchGameId]);

  const refetch = () => {
    void fetchGameId();
  };

  return {
    data: data,
    isLoading,
    error,
    refetch,
  };
};

export default useGameIdForContest; 