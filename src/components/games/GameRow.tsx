"use client";

import { GameData, GameTab } from "@/types";

type Props = {
  game: GameData;
  setGame:(value: GameData | ((prev: GameData) => GameData)) => void;
  setGameTab(t: GameTab): void;
};

export default function GameRow({
  game,
  setGame,
  setGameTab,
}: Props) {
  const { id, white, black, white_username, black_username, winner } =
    game;

  let winnerName;
  if (winner) {
    winnerName = winner === white ? white_username : black_username;
  }
 
  const handleSelect = () => {
    setGame(prev => {
      const perspective = prev?.perspective ?? "white";
      const mode = "pvp";
      return {
        ...game,
        mode,
        perspective,
      };
    });
    setGameTab("play");
  };

  return (
    <div className="flex flex-col pl-40 pr-40">
      <button
        className="flex justify-around pl-5 pr-5 pt-2 pb-2 border-2 rounded-md border-outline m-2 hover:bg-outline hover:text-background hover:scale-105 transition"
        onClick={() => handleSelect()}
      >
        <div className="p-1">White: {white_username}</div>
        <p className="p-1"> VS </p>
        <div className="p-1">Black: {black_username}</div>
        {winnerName && <div className="p-1"> Winner: {winnerName} </div>}
      </button>
    </div>
  );
}
