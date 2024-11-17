import { useEffect } from "react";
import { useState } from "react";
import { createThirdwebClient, getContract } from "thirdweb";
import { ownerOf } from "thirdweb/extensions/erc721";
import { getSocialProfiles, type SocialProfile } from "thirdweb/social";
import { type Address } from "viem";

import { DEFAULT_CHAIN } from "~/constants";
import { env } from "~/env";
import { getThirdwebChain } from "~/helpers/getThirdwebChain";

export const useBoxOwner = (
  boxesAddress: string, 
  tokenId: number,
  includeProfiles = false
) => {
  const [owner, setOwner] = useState<Address | null>(null);
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);
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
      setOwner(result as Address);
      if (includeProfiles) {
        const profiles = await getSocialProfiles({
          address: result as Address,
          client,
        });
        setProfiles(profiles);
      }
      setIsLoading(false);
    }
    void getOwner();
  }, [boxesAddress, includeProfiles, tokenId]);

  return { owner, profiles, isLoading };
}