import Image from "next/image";
import { useRouter } from "next/router";
import { type FC,useMemo,useState } from "react";
import { Blobbie } from "thirdweb/react";
import { shortenAddress, toTokens } from "thirdweb/utils";

import useContest from "~/hooks/useContest";
import { api } from "~/utils/api";
export const ContestList: FC = () => {
  const router = useRouter();
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = api.contest.list.useQuery({
    start: 0,
    limit: limit,
  });

  const TableRow = ({contestId}: {contestId: string}) => {
    const { data: contest } = useContest(contestId);
    const { data: identity, isLoading } = api.identity.getOrFetchIdentity.useQuery({
      address: contest?.creator ?? ''
    }, {
      enabled: !!contest?.creator,
    });
    const { data: game } = api.game.get.useQuery({
      id: Number(contest?.gameId)
    }, {
      enabled: !!contest?.gameId,
    });
    const [isImageError, setIsImageError] = useState(false);

    const badgeColor = useMemo(() => {
      switch (game?.status.type.state) {
        case "pre": return "badge-info";
        case "in": return "badge-accent animate-pulse";
        case "post": return "badge-success";
        default: return "badge-outline";
      }
    }, [game?.status.type.state]);
  
    if (isLoading || !game) return (
      <tr>
        <td>
          <div className="bg-base-300 animate-pulse rounded h-6 w-6" />
        </td>
        <td>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="bg-base-300 animate-pulse rounded h-6 w-24" />
            <div className="bg-base-300 animate-pulse rounded h-6 w-32" />
          </div>
        </td>
        <td>
          <div className="flex items-center gap-1 text-center">
            <div className="bg-base-300 animate-pulse rounded-full h-6 w-6" />
            <div className="bg-base-300 animate-pulse rounded h-6 w-24" />
          </div>
        </td>
        <td>
          <div className="bg-base-300 animate-pulse rounded h-6 w-16" />
        </td>
        <td>
          <div className="bg-base-300 animate-pulse rounded h-6 w-16" />
        </td>
      </tr>
    )

    if (!contest) return null;
    return (
      <tr key={contestId} className="cursor-pointer" onClick={() => router.push(`/contest/${contestId}`)}>
        <td>{contestId}</td>
        <td>
          <div className="flex flex-col items-center gap-0 text-center">
            <div className="text-sm flex items-center gap-1">
              <div>{game.shortName}</div>
              <div className={`badge badge-outline badge-sm my-0 ${badgeColor} ${game.status.type.state !== 'live' ? "my-4" : ""}`}>
                {game.status.type.description}
              </div>
            </div>
            <div className="text-xs">{new Date(game.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit"
            })}</div>
          </div>
        </td>
        <td>
          <div className="flex items-center gap-2">
            {isImageError ? (
              <Blobbie className="w-6 h-6 rounded-full" address={contest.creator} />
            ) : (
              <Image
                src={identity?.image ?? ''}
                alt={identity?.name ?? shortenAddress(contest.creator)}
                className="w-6 h-6 rounded-full"
                onError={() => {
                  setIsImageError(true);
                }}
                width={24}
                height={24}
              />
            )}
            <span>{identity?.name ?? shortenAddress(contest.creator)}</span>
          </div>
        </td>
        <td>
          <div className="flex items-center gap-1">
            <div>{toTokens(contest.boxCost.amount, contest.boxCost.decimals)}</div>
            <div>
              <Image src={contest.boxCost.image} alt={contest.boxCost.symbol} width={16} height={16} />
            </div>
            <div>{contest.boxCost.symbol}</div>
          </div>
        </td>
        <td>
          <div>{contest.boxesClaimed.toString()} / 100</div>
        </td>
      </tr>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Join a Contest</h1>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Game</th>
              <th>Creator</th>
              <th>Box Price</th>
              <th>Boxes Purchased</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((contestId) => (
              <TableRow key={contestId} contestId={contestId} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-8">
        <button className="btn btn-sm btn-outline" onClick={() => setLimit(limit + 10)}>Load More</button>
      </div>
    </div>
  )
}

export default ContestList;