import { type FC,useMemo } from "react";
import { base } from "viem/chains";

import { type Contest } from "~/types/contest";
import { type Game } from "~/types/game";

type Props = {  
  game: Game;
  contest: Contest;
}

export const Header: FC<Props> = ({ game, contest }) => {
  console.log({ game });
  const badgeColor = useMemo(() => {
    switch (game.status.type.state) {
      case "pre": return "badge-info";
      case "in": return "badge-accent animate-pulse";
      case "post": return "badge-success";
      default: return "badge-outline";
    }
  }, [game.status.type.state]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-center tracking-tight">{game.name}</h1>
      <div className="text-sm">
        {new Date(game.date).toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit"
        })}
      </div>
      <div className="flex flex-row items-center justify-center gap-2">
        {game.status.type.state === 'in' && (
          <div className="text-sm font-mono">
            {game.status.displayClock} {game.status.period ? `Q${game.status.period}` : ""}
          </div>
        )}
        <div className={`badge badge-outline badge-sm ${badgeColor} ${game.status.type.state !== 'live' ? "my-4" : ""}`}>
          {game.status.type.description}
        </div>
      </div> 
    </div>
  );
};
