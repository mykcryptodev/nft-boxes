import { useEffect } from "react";
import { useState } from "react";
import { createThirdwebClient, getContract } from "thirdweb";
import { ownerOf } from "thirdweb/extensions/erc721";
import { getSocialProfiles, type SocialProfile } from "thirdweb/social";
import { type Address } from "viem";

import { DEFAULT_CHAIN } from "~/constants";
import { env } from "~/env";
import { getThirdwebChain } from "~/helpers/getThirdwebChain";
import { api } from "~/utils/api";

export const useBoxOwner = (
  boxesAddress: string, 
  tokenId: number,
  includeThirdwebProfiles = false
) => {
  const [owner, setOwner] = useState<Address | null>(null);
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data: localProfile } = api.user.getIdentity.useQuery({
    address: owner ?? "",
  });

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
      if (includeThirdwebProfiles) {
        const profiles = await getSocialProfiles({
          address: result as Address,
          client,
        });
        setProfiles(profiles);
      }
      setIsLoading(false);
    }
    void getOwner();
  }, [boxesAddress, includeThirdwebProfiles, tokenId]);

  return { owner, profiles, isLoading, localProfile };
}