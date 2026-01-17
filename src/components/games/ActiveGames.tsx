"use client";

import GameRow from "@/components/games/GameRow";
import { GameData, GameTab } from "@/types";

type Props = {
  games: GameData[] | null;
  setCurrentGame(g: GameData): void;
  setGameTab(t: GameTab): void;
}

export default function ActiveGames({ 
  games, 
  setCurrentGame,
  setGameTab 
  }: Props ) {

  return (
    <div className="h-full">
      {/* Tabs */}
      <ul className="flex text-lg text-center">
      </ul>

      {/* Tab Content */}
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
      {/* <Footer /> */}
    </div>
  );
}
