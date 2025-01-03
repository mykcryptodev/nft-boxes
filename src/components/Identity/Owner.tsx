import { Socials } from "@coinbase/onchainkit/identity";
import { ArrowTopRightOnSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { Blobbie } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { type Address } from "viem";
import { base } from "viem/chains";

import { Portal } from "~/components/utils/Portal";
import { DEFAULT_CHAIN } from "~/constants";
import { CONTEST_CONTRACT } from "~/constants/addresses";
import { api } from "~/utils/api";

type Props = {
  owner: Address | null;
  boxId: string;
  boxesAddress: string;
  showName?: boolean;
  avatarSize?: number;
}
export const Owner: FC<Props> = ({ owner, boxId, boxesAddress, showName, avatarSize = 6 }) => {
  const { data: identity, isLoading } = api.identity.getOrFetchIdentity.useQuery({
    address: owner ?? ''
  }, {
    enabled: !!owner,
  });

  if (isLoading) {
    return (
      <div className={`avatar w-${avatarSize} h-${avatarSize}`}>
        <div className="rounded-full">
          <Blobbie address={owner ?? ""} className="w-full h-full" />
        </div>
      </div>
    )
  }

  return (
    <>
      <label 
        htmlFor={`${owner}-${boxId}`} 
        className={"cursor-pointer flex flex-col items-center"}
      >
        {owner && owner !== CONTEST_CONTRACT[DEFAULT_CHAIN.id] ? (
          // <Avatar className={`w-${avatarSize} h-${avatarSize}`} address={owner} defaultComponent={OwnerAvatarComponent} />
          <div className={`avatar w-${avatarSize} h-${avatarSize}`}>
            <div className="rounded-full">
              <Image
                src={identity?.image ?? ''}
                alt={identity?.name ?? shortenAddress(owner)}
                width={48}
                height={48}
              />
            </div>
          </div>
        ) : null}
        {showName && (
          <span className="font-bold text-lg">{identity?.name ?? shortenAddress(owner!)}</span>
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
              {/* <Avatar className="w-12 h-12" address={owner} defaultComponent={OwnerAvatarComponent} /> */}
              <div className="avatar w-12 h-12">
                <div className="rounded-full">
                  <Image
                    src={identity?.image ?? ''}
                    alt={identity?.name ?? shortenAddress(owner!)}
                    width={48}
                    height={48}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span>{identity?.name ?? shortenAddress(owner!)}</span>
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
            {identity?.bio && (
              <p className="py-4 prose text-xs">{identity.bio}</p>
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