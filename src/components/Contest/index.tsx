import { type FC,useState } from "react";

import GenerateRandomValues from "~/components/Contest/GenerateRandomValues";
import Scoreboard from "~/components/Contest/Scoreboard";
import useContest from "~/hooks/useContest";
import useScoresOnchain from "~/hooks/useScoresOnchain";
import { api } from "~/utils/api";

import { Grid } from "./Grid";
import { Header } from "./Header";
import { Winners } from "./Winners";

type GameProps = {
  contestId: string;
};
const Contest: FC<GameProps> = ({ contestId }) => {
  const { data: contest, refetch } = useContest(contestId);
  const { data: scoresOnchain } = useScoresOnchain(contest);
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

  const tabs = [ "Grid", "Winners", "My Boxes" ] as const;
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  console.log({ contest, game });
  if (!game || !contest || !scoresOnchain) {
    return null;
  }

  return (
    <div key={contestKey}>
      <Header game={game} contest={contest} />
      <Scoreboard game={game} scoresOnchain={scoresOnchain} />
      <div role="tablist" className="tabs tabs-boxed my-4 mx-auto max-w-xs">
        {tabs.map((tab) => (
          <a 
            key={tab} 
            role="tab" 
            className={`tab ${activeTab === tab ? "tab-active" : ""}`} 
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </a>
        ))}
      </div>
      <div className={`${activeTab === "Grid" ? "block" : "hidden"}`}>
        <Grid 
          game={game} 
          contest={contest} 
          scoresOnchain={scoresOnchain} 
          selectedBoxIds={selectedBoxIds} 
          setSelectedBoxIds={setSelectedBoxIds} 
          contestKey={contestKey}
          setContestKey={setContestKey}
          refetch={refetch} 
        />
      </div>
      <div className={`${activeTab === "Winners" ? "block" : "hidden"}`}>
        <Winners 
          game={game} 
          contest={contest} 
          scoresOnchain={scoresOnchain} 
        />
      </div>
    </div>
  );
};

export default Contest;
