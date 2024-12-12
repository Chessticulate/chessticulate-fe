"use client";

import { useEffect, useState } from "react";
import { GameData, GameRowProps } from "@/types";

export default function GameRow({
  game,
  active,
  onForfeit,
  onPlay,
}: GameRowProps) {
  const { id, white, black, white_username, black_username, whomst, winner } =
    game;

  let winnerName;
  const currentPlayer = whomst === white ? white_username : black_username;
  if (winner) {
    winnerName = winner === white ? white_username : black_username;
  }

  const forfeitGame = async () => {
    try {
      const response = await fetch("/api/games/forfeit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      console.log("forfeit", result);
      // updates game window's games list to remove forfeited row
      onForfeit(id);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const playGame = () => {
    onPlay(id);
  };

  return (
    <div className="flex pl-5 pr-5 pt-2 pb-2 border-2 rounded-md border-[#fed6ae] m-2">
      <div className="p-1">White: {white_username}</div>
      <div className="p-1">Black: {black_username}</div>
      {active ? (
        <>
          <div className="p-1">{currentPlayer}&apos;s turn</div>
          <button className="pl-2" onClick={forfeitGame}>
            resign
          </button>
          <button className="pl-2" onClick={playGame}>
            play
          </button>
        </>
      ) : (
        <div>
          {winnerName ? (
            <div className="p-1"> Winner: {winnerName} </div>
          ) : (
            <div className="p-1"> Draw </div>
          )}
        </div>
      )}
    </div>
  );
}
