import { type FC } from "react";

import { RefreshOnchainScores } from "~/components/Contest/RefreshOnchainScores";
import { EMOJI_TEAM_MAP } from "~/constants";
import { type ScoresOnChain } from "~/types/contest";
import { type Competitor, type Game } from "~/types/game";

type Props = {
  game: Game;
  scoresOnchain: ScoresOnChain | undefined;
}

export const Scoreboard: FC<Props> = ({ game, scoresOnchain }) => {
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
      <div className={`tooltip tooltip-${number < 3 ? 'top' : 'left'} sm:tooltip-top cursor-pointer`} data-tip={`${isOnchain ? `${name} scores are synced onchain` : `${name} scores are not yet onchain`}`}>
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
    <div className="bg-base-200 grid grid-flow-row gap-2 p-4 rounded-lg text-center">
      <div className="grid grid-cols-12 gap-2 border-b-2">
        <div className="col-span-4 grid">
          <RefreshOnchainScores gameId={game.id} />
        </div>
        <div className="col-span-2">
          <Quarter number={1} name={"Q1"} />
        </div>
        <div className="col-span-2">
          <Quarter number={2} name={"Q2"} />
        </div>
        <div className="col-span-2">
          <Quarter number={3} name={"Q3"} />
        </div>
        <div className="col-span-2">
          <Quarter number={4} name={"Final"} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2">
        {homeTeam ? (
          <div className="w-full col-span-4 text-center gap-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {EMOJI_TEAM_MAP[homeTeam.team.name] ?? '🏈'}&nbsp;
            {homeTeam.team.abbreviation}
          </div>
        ) : (
          <div className="col-span-4">Home</div>
        )}
        <div className="col-span-2">
          <Score quarter={1} team={homeTeam} />
        </div>
        <div className="col-span-2">
          <Score quarter={2} team={homeTeam} />
        </div>
        <div className="col-span-2">
          <Score quarter={3} team={homeTeam} />
        </div>
        <div className="col-span-2">
          <Score quarter={4} team={homeTeam} />
        </div>
      </div>
      <div className={`grid grid-cols-12 gap-2`}>
        {awayTeam ? (
          <div className="w-full text-center col-span-4 gap-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
            {EMOJI_TEAM_MAP[awayTeam.team.name] ?? '🏈'}&nbsp;
            {awayTeam.team.abbreviation}
          </div>
        ) : (
          <div className="col-span-4">Away</div>
        )}
        <div className="col-span-2">
          <Score quarter={1} team={awayTeam} />
        </div>
        <div className="col-span-2">
          <Score quarter={2} team={awayTeam} />
        </div>
        <div className="col-span-2">
          <Score quarter={3} team={awayTeam} />
        </div>
        <div className="col-span-2">
          <Score quarter={4} team={awayTeam} />
        </div>
      </div>
    </div>
  )
};

export default Scoreboard;