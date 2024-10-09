"use client";

import { useEffect, useState } from "react";

type GameRowProps = {
  active: boolean;
  game_id: number;
  white: number;
  black: number;
  white_username: string;
  black_username: string;
  whomst: string;
  onForfeit: (gameId: number) => void;
};

export default function GameRow({
  active,
  game_id,
  white,
  black,
  white_username,
  black_username,
  whomst,
  onForfeit,
}: GameRowProps) {
  const forfeitGame = async () => {
    try {
      const response = await fetch("/api/games/forfeit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ game_id }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      // updates game window's games list to remove forfeited row
      onForfeit(game_id);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <div className="flex pl-5 pr-5 pt-2 pb-2 border-2">
      <div className="p-1">White: {white_username}</div>
      <div className="p-1">Black: {black_username}</div>
      <div className="p-1">{whomst}&apos;s turn</div>
      {active && (
        <button className="pl-2" onClick={forfeitGame}>
          resign
        </button>
      )}
    </div>
  );
}
