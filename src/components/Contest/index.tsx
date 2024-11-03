import type { FC } from "react";

import Scoreboard from "~/components/Contest/Scoreboard";
import TeamName from "~/components/Contest/TeamName";
import useContest from "~/hooks/useContest";
import useGameIdForContest from "~/hooks/useGameIdForContest";
import { api } from "~/utils/api";
type GameProps = {
  contestId: string;
};
const Contest: FC<GameProps> = ({ contestId }) => {
  const { data: contest } = useContest(contestId);
  console.log({contest});
  const { data: gameId } = useGameIdForContest(contestId);
  const { data: game } = api.game.get.useQuery({
    id: Number(gameId),
  }, {
    enabled: gameId !== undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  if (!game || !contest) {
    return null;
  }

  return (
    <div>
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
                    <div key={i} className={`border-2 rounded-lg box-border w-full h-full aspect-square grid place-content-center bg-base-200`}>
                      {(i === 0) ? '' : (rowNumber === 0) ? contest.cols[colNumber - 1] : (colNumber === 0) ? contest.rows[rowNumber - 1] : ''}
                    </div>
                  )
                }
                return (
                  <div key={i} className={`border-2 rounded-lg box-border w-full h-full aspect-square grid place-content-center bg-base-200`} />
                )
              }
              <div className="w-4 h-4 bg-base-200" />
              return (
                <div key={i} className="h-full w-full bg-base-300 animate-pulse rounded-lg"></div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contest;
