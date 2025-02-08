import React, { useMemo } from "react";
import { type FC } from "react";
import { isAddress, isAddressEqual } from "viem";
import { useAccount } from "wagmi";

import { Owner } from "~/components/Identity/Owner";
import { DEFAULT_CHAIN } from "~/constants";
import { CONTEST_CONTRACT } from "~/constants/addresses";
import { useBoxIsWinner } from "~/hooks/useBoxIsWinner";
import { useBoxOwner } from "~/hooks/useBoxOwner";
import { type Contest,type ScoresOnChain } from "~/types/contest";
import { type Game } from "~/types/game";

type Props = {
  boxesAddress: string;
  boxId: number;
  onBoxSelected: (boxId: number) => void;
  onBoxUnselected: (boxId: number) => void;
  onlyMyBoxes: boolean;
  selectedBoxIds: number[];
  contest: Contest;
  game: Game;
  row: number;
  col: number;
  scoresOnchain: ScoresOnChain;
}

export const Box: FC<Props> = ({ boxesAddress, boxId, onBoxSelected, onBoxUnselected, onlyMyBoxes, selectedBoxIds, contest, game, row, col, scoresOnchain }) => {
  const { address } = useAccount();
  const { owner, isLoading: isOwnerLoading } = useBoxOwner(boxesAddress, boxId, contest.id.toString());
  const { hasWon } = useBoxIsWinner({
    col,
    row,
    contest,
    game,
    scoresOnchain,
    owner,
  });

  const boxIsUnclaimed = useMemo(() => {
    return owner && isAddress(owner) && isAddressEqual(owner, CONTEST_CONTRACT[DEFAULT_CHAIN.id]!);
  }, [owner]);

  const isMyBox = useMemo(() => {
    return owner && address && isAddress(owner) && isAddressEqual(owner, address);
  }, [owner, address]);

  if (isOwnerLoading) {
    return (
      <div className="skeleton h-full w-full rounded-lg bg-base-300"></div>
    )
  }

  if (boxIsUnclaimed && contest.boxesCanBeClaimed) {
    return (
      <div className="h-full w-full bg-base-300 rounded-lg flex items-center justify-center">
        <input
          type="checkbox"
          className="checkbox"
          onChange={() => {
            if (selectedBoxIds.includes(boxId)) {
              onBoxUnselected(boxId);
            } else {
              onBoxSelected(boxId);
            }
          }}
          checked={selectedBoxIds.includes(boxId)}
        />
      </div>
    )
  }

  return (
    <div className={`h-full w-full rounded-lg flex items-center justify-center relative p-px ${hasWon ? 'bg-gradient-to-b from-primary to-secondary' : 'bg-base-300'} ${onlyMyBoxes && !isMyBox ? 'opacity-10' : ''}`}>
      <div className="bg-base-300 h-full w-full flex items-center justify-center rounded-[calc(0.5rem-1px)]">
        <div className="flex items-center justify-center">
          {owner && owner !== CONTEST_CONTRACT[DEFAULT_CHAIN.id] ? (
            <Owner
              owner={owner}
              boxId={boxId.toString()}
              boxesAddress={boxesAddress}
              contest={contest}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Box;