"use client";

import GameRow from "@/components/games/GameRow";
import { GameData, GameTab } from "@/types";

type Props = {
  games: GameData[] | null;
  setCurrentGame: React.Dispatch<React.SetStateAction<GameData | null>>;
  setGameTab(t: GameTab): void;
};

export default function ActiveGames({
  games,
  setCurrentGame,
  setGameTab,
}: Props) {
  return (
    <div className="fixed left-1/2 top-1/4 -translate-x-1/2 flex flex-col items-center gap-4">
      {games && games.length > 0 ? (
        games?.map((game, index) => (
          <GameRow
            key={index}
            game={game}
            setGame={setCurrentGame}
            setGameTab={setGameTab}
          />
        ))
      ) : (
        <div>No active games</div>
      )}
    </div>
  );
}
