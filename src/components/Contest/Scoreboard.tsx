import { type FC,useEffect } from "react";

import { RefreshOnchainScores } from "~/components/Contest/RefreshOnchainScores";
import { EMOJI_TEAM_MAP } from "~/constants";
import useScoresOnchain from "~/hooks/useScoresOnchain";
import { type Competitor, type Game } from "~/types/game";

type Props = {
  game: Game;
  contestId: string;
}

export const Scoreboard: FC<Props> = ({ contestId, game }) => {
  const { data: scoresOnchain, refetch } = useScoresOnchain(contestId);
  // refetch every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 1000 * 60 * 10);
    return () => clearInterval(interval);
  }, [refetch]);

  const homeTeam = game.competitions[0]?.competitors.find(
    (competitor) => competitor.homeAway === 'home'
  );
  const awayTeam = game.competitions[0]?.competitors.find(
    (competitor) => competitor.homeAway === 'away'
  );

  const currentQuarter = game.competitions?.[0]?.status?.period ?? 0;

  const score = (quarter: number, team: Competitor | undefined) => {
    if (!team || !game) return 0;
    if (currentQuarter < quarter) return '-';
    switch (quarter) {
      case 1:
        return team.linescores?.[0]?.value;
      case 2:
        return (team.linescores?.[0]?.value ?? 0) + (team.linescores?.[1]?.value ?? 0);
      case 3:
        return (team.linescores?.[0]?.value ?? 0) + (team.linescores?.[1]?.value ?? 0) + (team.linescores?.[2]?.value ?? 0);
      default:
        // return a summation of all the linescores for this team
        const lineScores = team.linescores?.map((score) => score.value ?? 0) ?? [];
        return lineScores.reduce((a, b) => a + b, 0);
    }
  }

  const Quarter: FC<{ number: number, name: string  }> = ({ number, name }) => {
    const isOnchain = (scoresOnchain?.qComplete ?? 0) >= number;
    return (
      <div className="tooltip cursor-pointer" data-tip={`${isOnchain ? `${name} scores are saved onchain` : `${name} scores are not yet onchain`}`}>
        <div className="flex w-full justify-center items-center gap-1">
          <div>{name}</div>
          <div className={`w-2 h-2 rounded-full ${isOnchain ? 'bg-primary' : 'bg-warning'}`} />
        </div>
      </div>
    )
  };

  const Score: FC<{ quarter: number, team: Competitor | undefined  }> = ({ quarter, team }) => {
    const gameIsOver = game.competitions?.[0]?.status?.type?.completed ?? false;
    const isInProgress = currentQuarter <= quarter && !gameIsOver;
    return (
      <div className={`${isInProgress ? 'opacity-70' : ''}`}>
        {score(quarter, team)}
      </div>
    )
  };

  return (
    <div className="bg-base-200 flex flex-col gap-2 p-4 rounded-lg text-center">
      <div className="grid grid-cols-5 gap-2 border-b-2">
        <div>
          <RefreshOnchainScores gameId={game.id} />
        </div>
        <Quarter number={1} name={"Q1"} />
        <Quarter number={2} name={"Q2"} />
        <Quarter number={3} name={"Q3"} />
        <Quarter number={4} name={"Final"} />
      </div>
      <div className="grid grid-cols-5 gap-2">
        {homeTeam ? (
          <div className="w-full text-center gap-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {EMOJI_TEAM_MAP[homeTeam.team.name] ?? '🏈'}&nbsp;
            {homeTeam.team.abbreviation}
          </div>
        ) : (
          <div>Home</div>
        )}
        <Score quarter={1} team={homeTeam} />
        <Score quarter={2} team={homeTeam} />
        <Score quarter={3} team={homeTeam} />
        <Score quarter={4} team={homeTeam} />
      </div>
      <div className={`grid grid-cols-5 gap-2`}>
        {awayTeam ? (
          <div className="w-full text-center gap-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {EMOJI_TEAM_MAP[awayTeam.team.name] ?? '🏈'}&nbsp;
            {awayTeam.team.abbreviation}
          </div>
        ) : (
          <div>Away</div>
        )}
        <Score quarter={1} team={awayTeam} />
        <Score quarter={2} team={awayTeam} />
        <Score quarter={3} team={awayTeam} />
        <Score quarter={4} team={awayTeam} />
      </div>
    </div>
  )
};

export default Scoreboard;