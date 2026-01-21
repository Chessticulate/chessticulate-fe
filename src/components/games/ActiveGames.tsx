"use client";

import GameRow from "@/components/games/GameRow";
import { GameData, GameTab } from "@/types";

type Props = {
  games: GameData[] | null;
  setCurrentGame: React.Dispatch<React.SetStateAction<GameData | null>>;
  setGameTab(t: GameTab): void;
}

export default function ActiveGames({ 
  games, 
  setCurrentGame,
  setGameTab 
  }: Props ) {

  return (
    <div className="h-full">
      <ul className="flex text-lg text-center">
      </ul>

      <div>
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
    </div>
  );
}
