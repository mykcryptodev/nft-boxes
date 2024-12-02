import { useEffect } from "react";
import { useState } from "react";
import { createThirdwebClient, getContract } from "thirdweb";
import { ownerOf } from "thirdweb/extensions/erc721";
import { type Address } from "viem";

import { DEFAULT_CHAIN } from "~/constants";
import { env } from "~/env";
import { getThirdwebChain } from "~/helpers/getThirdwebChain";

export const useBoxOwner = (
  boxesAddress: string, 
  tokenId: number
) => {
  const [owner, setOwner] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
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
  }, [boxesAddress, tokenId]);

  return { owner, isLoading };
}