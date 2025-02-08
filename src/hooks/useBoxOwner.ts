import { useEffect } from "react";
import { useState } from "react";
import { createThirdwebClient, getContract } from "thirdweb";
import { ownerOf } from "thirdweb/extensions/erc721";
import { type Address } from "viem";

import { DEFAULT_CHAIN } from "~/constants";
import { env } from "~/env";
import { getThirdwebChain } from "~/helpers/getThirdwebChain";

import { usePlayers } from "./usePlayers";

export const useBoxOwner = (
  boxesAddress: string, 
  tokenId: number,
  contestId: string,
) => {
  const { data: players } = usePlayers(contestId);
  const tokenIdsToOwners = players?.tokenIdsToOwners;
  const cachedOwner = tokenIdsToOwners?.[tokenId];
  const [owner, setOwner] = useState<Address | null>(cachedOwner as Address | null);
  const [isLoading, setIsLoading] = useState<boolean>(!cachedOwner);

  useEffect(() => {
    // If we have a cached owner, no need to fetch
    if (cachedOwner) {
      setOwner(cachedOwner);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const getOwner = async () => {
      const client = createThirdwebClient({
        clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      });

      const contract = getContract({
        client,
        address: boxesAddress,
        chain: getThirdwebChain(DEFAULT_CHAIN),
      });
      const result = await ownerOf({
        contract,
        tokenId: BigInt(tokenId),
      });
      setOwner(result);
      setIsLoading(false);
    }
    void getOwner();
  }, [boxesAddress, tokenId, cachedOwner]);

  return { owner, isLoading };
}