import { type FC,useEffect,useMemo, useState } from "react";

import { type Contest } from "~/types/contest";
import { type Game } from "~/types/game";

import { Price } from "./Price";

type Props = {  
  game: Game;
  contest: Contest;
  onSwapToggle: (isOpen: boolean) => void;
}

export const Header: FC<Props> = ({ game, contest, onSwapToggle }) => {
  const [isSwapOpen, setIsSwapOpen] = useState<boolean>(false);
  useEffect(() => {
    onSwapToggle(isSwapOpen);
  }, [isSwapOpen, onSwapToggle]);
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
      <Price contest={contest} onSwapToggle={setIsSwapOpen} />
      <h1 className={`sm:text-7xl text-6xl font-bold text-center tracking-tighter ${isSwapOpen ? "hidden" : ""}`}>{game.name}</h1>
      <div className="mt-2">
        {new Date(game.date).toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit"
        })}
      </div>
      {!isSwapOpen && (
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
      )}
    </div>
  );
};
