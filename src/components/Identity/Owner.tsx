import { Socials } from "@coinbase/onchainkit/identity";
import { ArrowTopRightOnSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { type FC, useMemo, useState } from "react";
import { Blobbie } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { type Address, isAddressEqual } from "viem";
import { base } from "viem/chains";
import { useAccount } from "wagmi";

import { Portal } from "~/components/utils/Portal";
import { DEFAULT_CHAIN } from "~/constants";
import { CONTEST_CONTRACT } from "~/constants/addresses";
import { type Contest } from "~/types/contest";
import { api } from "~/utils/api";

type Props = {
  owner: Address | null;
  boxId: string;
  boxesAddress: string;
  showName?: boolean;
  avatarSize?: number;
  contest: Contest;
}

export const Owner: FC<Props> = ({ owner, boxId, boxesAddress, showName, avatarSize = 6, contest }) => {
  const { address } = useAccount();
  const { data: identity, isLoading } = api.identity.getOrFetchIdentity.useQuery({
    address: owner ?? ''
  }, {
    enabled: !!owner,
  });
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOwnBox = useMemo(() => address && owner && isAddressEqual(address, owner), [address, owner]);

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
          <div className={`avatar w-${avatarSize} h-${avatarSize}`}>
            <div className="rounded-full">
              {isError ? (
                <Blobbie address={owner} className="w-full h-full" />
              ) : (
                <Image
                  src={identity?.image ?? ''}
                  alt={identity?.name ?? shortenAddress(owner)}
                  width={48}
                  height={48}
                  onError={() => setIsError(true)}
                />
              )}
            </div>
          </div>
        ) : null}
        {showName && (
          <span className="font-bold text-lg">{identity?.name ?? shortenAddress(owner!)}</span>
        )}
      </label>
      <Portal>
        <input 
          type="checkbox" 
          id={`${owner}-${boxId}`} 
          className="modal-toggle" 
          onChange={(e) => setIsModalOpen(e.target.checked)}
        />
        <div className="modal modal-bottom sm:modal-middle" role="dialog">
          <div className="modal-box relative">
            <label 
              htmlFor={`${owner}-${boxId}`} 
              className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2"
            >
              <XMarkIcon className="w-4 h-4 stroke-2" />
            </label>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <div className="avatar w-12 h-12">
                <div className="rounded-full">
                  {isError ? (
                    <Blobbie address={owner ?? ''} className="w-full h-full" />
                  ) : (
                    <Image
                      src={identity?.image ?? ''}
                      alt={identity?.name ?? shortenAddress(owner!)}
                      width={48}
                      height={48}
                      onError={() => setIsError(true)}
                    />
                  )}
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
            {owner && isModalOpen && (
              <Socials
                address={owner}
                chain={base}
              />
            )}
            {identity?.bio && (
              <p className="py-4 prose text-xs">{identity.bio}</p>
            )}
            <div className="modal-action flex gap-2">
              {isOwnBox && contest?.id && (
                <Link
                  href={`/identity?contestId=${contest.id.toString()}&returnUrl=/contest/${contest.id}`}
                  className="btn btn-primary"
                >
                  Update Profile
                </Link>
              )}
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