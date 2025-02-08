import { type FC, useState } from "react";

import Scoreboard from "~/components/Contest/Scoreboard";
import { RequestIdentity } from "~/components/Identity/RequestIdentity";
import useContest from "~/hooks/useContest";
import useScoresOnchain from "~/hooks/useScoresOnchain";
import { api } from "~/utils/api";

import { Grid } from "./Grid";
import { Header } from "./Header";
import { Players } from "./Players";
import { Skeleton } from "./Skeleton";
import { Winners } from "./Winners";

type GameProps = {
  contestId: string;
};

const Contest: FC<GameProps> = ({ contestId }) => {
  const { data: contest, refetch, isLoading: isContestLoading } = useContest(contestId);
  const { data: scoresOnchain, isLoading: isScoresOnchainLoading } = useScoresOnchain(contest);
  const { data: game, isLoading: isGameLoading } = api.game.get.useQuery({
    id: Number(contest?.gameId),
  }, {
    enabled: contest?.gameId !== undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: 1000 * 60 * 10, // Refresh every 10 minutes
  });
  const [selectedBoxIds, setSelectedBoxIds] = useState<number[]>([]);

  const tabs = [ "Grid", "My Boxes", "Winners", "Players"] as const;
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const [swapIsOpen, setSwapIsOpen] = useState<boolean>(false);

  const isLoading = isContestLoading || isScoresOnchainLoading || isGameLoading;
  if (isLoading) {
    return (
      <Skeleton />
    );
  }

  if (!game || !contest || !scoresOnchain) {
    return null;
  }

  return (
    <div className="w-full">
      <Header 
        game={game} 
        contest={contest} 
        onSwapToggle={(isOpen: boolean) => setSwapIsOpen(isOpen)}
      />

      {!swapIsOpen && (
        <>
          <Scoreboard game={game} scoresOnchain={scoresOnchain} />
          <div role="tablist" className={`tabs tabs-boxed my-4 mx-auto max-w-lg ${activeTab === "Swap" ? "hidden" : ""}`}>
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
        </>
      )}
      <div className={`${(activeTab === "Grid" || activeTab === "My Boxes") && !swapIsOpen ? "block" : "hidden"} mb-10`}>
        <Grid 
          game={game} 
          onlyMyBoxes={activeTab === "My Boxes"}
          contest={contest} 
          scoresOnchain={scoresOnchain} 
          selectedBoxIds={selectedBoxIds} 
          setSelectedBoxIds={setSelectedBoxIds} 
          refetch={refetch} 
        />
      </div>
      <div className={`${activeTab === "Winners" && !swapIsOpen ? "block" : "hidden"}`}>
        <Winners 
          contest={contest} 
          scoresOnchain={scoresOnchain} 
        />
      </div>
      <div className={`${activeTab === "Players" && !swapIsOpen ? "block" : "hidden"}`}>
        <Players contest={contest} />
      </div>
      <RequestIdentity contest={contest} />
    </div>
  );
};

export default Contest;
