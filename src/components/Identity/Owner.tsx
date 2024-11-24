import { Avatar, Socials, useName } from "@coinbase/onchainkit/identity";
import { ArrowTopRightOnSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { type User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { type FC,useEffect, useMemo, useState } from "react";
import { createThirdwebClient } from "thirdweb";
import { getSocialProfiles } from "thirdweb/social";
import { type SocialProfile } from "thirdweb/social";
import { shortenAddress } from "thirdweb/utils";
import { type Address } from "viem";
import { base } from "viem/chains";

import { Portal } from "~/components/utils/Portal";
import { DEFAULT_CHAIN } from "~/constants";
import { CONTEST_CONTRACT } from "~/constants/addresses";
import { env } from "~/env";

import { GradientAvatar } from "./GradientAvatar";

type Props = {
  owner: Address | null;
  boxId: string;
  localProfile: User | null | undefined;
  boxesAddress: string;
  showName?: boolean;
  avatarSize?: number;
}
export const Owner: FC<Props> = ({ owner, boxId, localProfile, boxesAddress, showName, avatarSize = 6 }) => {
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);
  const [shouldFetchProfiles, setShouldFetchProfiles] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data: basename }: { data: string | null } = useName({ address: owner!, chain: base });

  const displayName = useMemo(() => {
    if (basename) return basename;
    if (localProfile?.name) return localProfile.name;
    // loop through each profile until we find a name
    for (const profile of profiles) {
      if (profile.name) return profile.name;
    }
    return shortenAddress(owner ?? "");
  }, [basename, profiles, localProfile, owner]);

  const bio = useMemo(() => {
    // loop through each profile until we find a bio
    for (const profile of profiles) {
      if (profile.bio) return profile.bio;
    }
    return null;
  }, [profiles]);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!owner || !shouldFetchProfiles) return;
      console.log("fetching profiles...");
      const client = createThirdwebClient({
        clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
      });
      const profiles = await getSocialProfiles({
        address: owner,
        client,
      });
      setProfiles(profiles);
    }
    void fetchProfiles();
  }, [owner, boxId, shouldFetchProfiles]);

  console.log({ profiles, localProfile });

  const OwnerAvatarComponent = useMemo(() => {
    if (localProfile?.image && localProfile.image !== "") {
      return (
        <Image
          src={localProfile.image}
          alt={localProfile?.name ?? shortenAddress(owner!)}
          width={48}
          height={48}
        />
      )
    }
    return (
      <GradientAvatar address={owner ?? ""} className="w-full h-full" />
    )
  }, [localProfile?.image, localProfile?.name, owner]);

  return (
    <>
      <label 
        htmlFor={`${owner}-${boxId}`} 
        onClick={() => setShouldFetchProfiles(true)} 
        className={"cursor-pointer flex flex-col items-center"}
      >
        {owner && owner !== CONTEST_CONTRACT[DEFAULT_CHAIN.id] ? (
          <Avatar className={`w-${avatarSize} h-${avatarSize}`} address={owner} defaultComponent={OwnerAvatarComponent} />
        ) : null}
        {showName && (
          <span className="font-bold text-lg">{displayName}</span>
        )}
      </label>
      <Portal>
        <input type="checkbox" id={`${owner}-${boxId}`} className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle" role="dialog">
          <div className="modal-box relative">
            <label htmlFor={`${owner}-${boxId}`} className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2">
              <XMarkIcon className="w-4 h-4 stroke-2" />
            </label>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Avatar className="w-12 h-12" address={owner} defaultComponent={OwnerAvatarComponent} />
              <div className="flex flex-col">
                <span>{displayName}</span>
                <div className="flex items-center gap-1 opacity-50">
                  <span className="text-sm">{shortenAddress(owner!)}</span>
                  <Link href={`https://basescan.org/address/${owner}`} target="_blank">
                    <ArrowTopRightOnSquareIcon className="w-3 h-3 stroke-2" />
                  </Link>
                </div>
              </div>
            </h3>
            {owner && (
              <Socials
                address={owner}
                chain={base}
              />
            )}
            {bio && (
              <p className="py-4 prose text-xs">{bio}</p>
            )}
            <div className="modal-action">
              <Link
                href={`https://opensea.io/assets/${DEFAULT_CHAIN.name.toLowerCase()}/${boxesAddress}/${boxId}`}
                target="_blank"
                className="btn"
              >
                View Box on OpenSea
                <ArrowTopRightOnSquareIcon className="w-4 h-4 stroke-2" />
              </Link>
            </div>
          </div>
        </div>
      </Portal>
    </>
  );
};

export default Owner;