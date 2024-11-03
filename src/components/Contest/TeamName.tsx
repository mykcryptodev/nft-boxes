import { type FC } from "react";

import { EMOJI_TEAM_MAP } from "~/constants";
import { type Game } from "~/types/game";

type TeamNameProps = {
  game: Game;
  homeAway: "home" | "away";
};
export const TeamName: FC<TeamNameProps> = ({ game, homeAway }: TeamNameProps) => {
  const teamName = game.competitions[0]?.competitors.find(
      (competitor) => competitor.homeAway === homeAway
    )?.team.name ?? "Team";
    const emoji: string = EMOJI_TEAM_MAP[teamName] ?? '🏈';
    return (
      <div className="flex items-center gap-2">
        <span>{emoji}</span>
        <span>{teamName}</span>
      </div>
    );
};

export default TeamName;