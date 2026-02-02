"use client";

import GameRow from "@/components/games/GameRow";
import { GameData, GameTab } from "@/types";
import { useState, useEffect } from "react";

type Props = {
  games: GameData[] | null;
  gameSkip: number;
  setCurrentGame: React.Dispatch<React.SetStateAction<GameData | null>>;
  setGameTab(t: GameTab): void;
  setGameSkip: React.Dispatch<React.SetStateAction<number>>;
};

export default function ActiveGames({
  games,
  gameSkip,
  setCurrentGame,
  setGameTab,
  setGameSkip,
}: Props) {
  const gameList = games ?? [];

  const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(gameList.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = gameList.slice(start, start + PAGE_SIZE);

  const prevPage = () => setGameSkip((p) => Math.max(0, p - 5));
  const nextPage = () => setGameSkip((p) => p + 5);
  const canNext = (games?.length ?? 0) === PAGE_SIZE;

  return (
    <>
      <div
        className="
        fixed
        left-1/2
        top-[15%]
        -translate-x-1/2
        flex flex-col items-center gap-3 sm:gap-2
        whitespace-nowrap
      "
      >
        {games && games.length > 0 ? (
          pageItems.map((game) => (
            <GameRow
              key={game.id}
              game={game}
              setGame={setCurrentGame}
              setGameTab={setGameTab}
            />
          ))
        ) : (
          <div>No More Games</div>
        )}
      </div>
      <div
        className="
        fixed
        left-1/2
        top-[80%] md:top-[70%]
        -translate-x-1/2
      "
      >
        <div className="flex mt-2 items-center justify-center gap-3 pb-5">
          <button
            onClick={prevPage}
            disabled={gameSkip === 0}
            className="px-3 py-1 font-bold text-2xl disabled:opacity-50"
          >
            &lt;
          </button>
          <button
            onClick={nextPage}
            disabled={!canNext}
            className="px-3 py-1 font-bold text-2xl disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    </>
  );
}
