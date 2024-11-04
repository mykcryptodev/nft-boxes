import { type FC,useState } from "react";

import Box from "~/components/Contest/Box";
import { BuyBoxes } from "~/components/Contest/BuyBoxes";
import Scoreboard from "~/components/Contest/Scoreboard";
import TeamName from "~/components/Contest/TeamName";
import useContest from "~/hooks/useContest";
import { api } from "~/utils/api";

type GameProps = {
  contestId: string;
};
const Contest: FC<GameProps> = ({ contestId }) => {
  const { data: contest, refetch } = useContest(contestId);
  const [contestKey, setContestKey] = useState<number>(0);
  const { data: game } = api.game.get.useQuery({
    id: Number(contest?.gameId),
  }, {
    enabled: contest?.gameId !== undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: 1000 * 60 * 10, // Refresh every 10 minutes
  });
  const [selectedBoxIds, setSelectedBoxIds] = useState<number[]>([]);

  if (!game || !contest) {
    return null;
  }

  return (
    <div key={contestKey}>
      <Scoreboard contestId={contestId} game={game} />
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
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
            {[...Array(121)].map((_, i) => {
              const rowNumber = Math.floor(i / 11);
              const colNumber = i % 11;
              // the box id is based on the position of the box. 
              // the boxes in the first column and the boxes in the first row do not get IDs
              // the box in the upper left corner (0, 0) gets an ID of 0
              const boxId = i % 11 === 0 || i < 11 ? 0 : (rowNumber - 1) * 10 + colNumber - 1;

              if (i % 11 === 0 || i < 11) {
                if (contest.randomValuesSet) {
                  return (
                    <div key={i} className={`border-2 rounded-lg w-full h-full aspect-square grid place-content-center bg-base-200`}>
                      {(i === 0) ? '' : (rowNumber === 0) ? contest.cols[colNumber - 1] : (colNumber === 0) ? contest.rows[rowNumber - 1] : ''}
                    </div>
                  )
                }
                return (
                  <div key={i} className={`border-2 rounded-lg w-full h-full aspect-square grid place-content-center bg-base-200`} />
                )
              }
              return (
                <Box
                  key={i} 
                  boxId={boxId + (Number(contestId) * 100)}
                  boxesAddress={contest.boxesAddress}
                  selectedBoxIds={selectedBoxIds}
                  onBoxSelected={(boxId) => {
                    setSelectedBoxIds((prev) => [...prev, boxId]);
                  }}
                  onBoxUnselected={(boxId) => {
                    setSelectedBoxIds((prev) => prev.filter((id) => id !== boxId));
                  }}
                />
              )
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
          setContestKey((prev) => prev + 1);
          void refetch();
        }}
      />
    </div>
  );
};

export default Contest;
