import { type FC, useEffect,useMemo,useState } from "react";
import { isAddressEqual } from "viem";
import { useAccount } from "wagmi";

import { type Contest,type ScoresOnChain } from "~/types/contest";
import { type Game } from "~/types/game";

import Box from "./Box";
import { BuyBoxes } from "./BuyBoxes";
import GenerateRandomValues from "./GenerateRandomValues";
import { TeamName } from "./TeamName";

type Props = {
  game: Game;
  contest: Contest;
  onlyMyBoxes: boolean;
  scoresOnchain: ScoresOnChain;
  selectedBoxIds: number[];
  setSelectedBoxIds: (ids: number[]) => void;
  contestKey: number;
  setContestKey: (key: number) => void;
  refetch: () => void;
}

export const Grid: FC<Props> = ({ 
  game, 
  contest, 
  onlyMyBoxes,
  scoresOnchain, 
  selectedBoxIds, 
  setSelectedBoxIds, 
  contestKey, 
  setContestKey,
  refetch 
}) => {
  const { address } = useAccount();
  const [visibleBoxes, setVisibleBoxes] = useState(20);

  const userIsContestOwner = useMemo(() =>{
    if (!address) return false;
    return isAddressEqual(address, contest.creator);
  }, [address, contest.creator]);
  
  useEffect(() => {
    const loadMoreBoxes = () => {
      if (visibleBoxes < 121) {
        setVisibleBoxes(prev => Math.min(prev + 20, 121));
      }
    };

    const interval = setInterval(loadMoreBoxes, 1500);
    
    return () => clearInterval(interval);
  }, [visibleBoxes]);

  const renderBox = (i: number, isLoading = false) => {
    const rowNumber = Math.floor(i / 11);
    const colNumber = i % 11;
    const boxId = i % 11 === 0 || i < 11 ? 0 : (rowNumber - 1) * 10 + colNumber - 1;

    if (i % 11 === 0 || i < 11) {
      if (contest.randomValuesSet) {
        return (
          <div key={i} className="border-2 rounded-lg w-full h-full aspect-square grid place-content-center bg-base-200">
            {(i === 0) ? '' : (rowNumber === 0) ? contest.cols[colNumber - 1] : (colNumber === 0) ? contest.rows[rowNumber - 1] : ''}
          </div>
        )
      }
      return (
        <div key={i} className="border-2 rounded-lg w-full h-full aspect-square grid place-content-center bg-base-300" />
      )
    }

    if (isLoading) {
      return (
        <div 
          key={i} 
          className="border-2 rounded-lg w-full h-full aspect-square grid place-content-center animate-pulse bg-base-300"
        />
      );
    }

    return (
      <Box
        key={i} 
        boxId={boxId + (Number(contest.id) * 100)}
        boxesAddress={contest.boxesAddress}
        onlyMyBoxes={onlyMyBoxes}
        selectedBoxIds={selectedBoxIds}
        onBoxSelected={(boxId) => {
          setSelectedBoxIds([...selectedBoxIds, boxId]);
        }}
        onBoxUnselected={(boxId) => {
          setSelectedBoxIds(selectedBoxIds.filter((id) => id !== boxId));
        }}
        contest={contest}
        game={game}
        row={rowNumber}
        col={colNumber} 
        scoresOnchain={scoresOnchain}
      />
    );
  };

  return (
    <>
      {(userIsContestOwner || contest.boxesClaimed === 100n) && (
        <GenerateRandomValues 
          contest={contest}
          onValuesGenerated={() => {
            setSelectedBoxIds([]);
            setContestKey(contestKey + 1);
            void refetch();
          }} 
        />
      )}
      <div className="grid grid-cols-12 mt-2">
        <div className="grid col-span-1" />
        <div className="grid col-span-10 place-content-center text-2xl">
          <TeamName game={game} homeAway="home" />
        </div>
      </div>
      <div className="grid grid-cols-12">
        <div className="grid col-span-1 place-content-center">
          <div className="transform -rotate-90 text-2xl h-fit">
            <TeamName game={game} homeAway="away" />
          </div>
        </div>
        <div className="grid col-span-10">
          <div className="grid grid-cols-11 grid-rows-11 gap-1 w-full h-full">
            {Array.from({ length: 121 }).map((_, i) => {
              if (i < visibleBoxes) {
                return renderBox(i);
              }
              return renderBox(i, true);
            })}
          </div>
        </div>
      </div>
      <BuyBoxes 
        key={contestKey}
        contest={contest}
        selectedBoxes={selectedBoxIds} 
        setSelectedBoxes={setSelectedBoxIds} 
        onBoxBuySuccess={() => {
          setSelectedBoxIds([]);
          setContestKey(contestKey + 1);
          void refetch();
        }}
      />
    </>
  );
};
