import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { Blobbie } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";

import { type CachedIdentity } from "~/server/redis";
import { type Contest } from "~/types/contest";
import { usePlayers } from "~/hooks/usePlayers";

interface Props {
  contest: Contest;
}

export const Players: FC<Props> = ({ contest }) => {
  const { data: players, isLoading } = usePlayers(contest.id.toString());
  
  const getLinkUrl = (player: CachedIdentity) => {
    if (player.name?.endsWith(".base.eth")) {
      return `https://base.org/name/${player.name}`;
    }
    return `https://basescan.org/address/${player.address}`;
  }

  if (isLoading) {
    return (
      <div className="w-full pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="flex flex-col gap-2 rounded-lg py-2 px-4 items-center animate-pulse"
            >
              <div className="flex w-full justify-between gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10" />
                <div className="flex-grow">
                  <div className="h-6 w-3/4 bg-white/10 rounded mb-2" />
                  <div className="h-4 w-1/2 bg-white/10 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!players) return null;

  return (
    <div className="w-full pb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {players.identities.map((identity) => (
          <Link 
            key={identity.address} 
            href={getLinkUrl(identity)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-2 rounded-lg py-2 px-4 items-center hover:bg-white/10 transition-colors"
          >
            <div className="flex w-full justify-between gap-2">
              <div className="flex-shrink-0">
                {identity.image ? (
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <Image
                        src={identity.image}
                        alt={identity.name ?? "Player avatar"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Blobbie
                      address={identity.address!}
                      size={32}
                      className="rounded-full"
                    />
                  </div>
                )}
              </div>
              <div className="flex-grow overflow-hidden">
                <h3 className="font-semibold text-lg truncate">
                  {identity.name ?? shortenAddress(identity.address!)}
                </h3>
                <p className="text-sm text-gray-400">
                  {players.ownerCounts[identity.address!]} {players.ownerCounts[identity.address!] === 1 ? "box" : "boxes"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

