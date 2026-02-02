"use client";

import { GameTab, GameData } from "@/types";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  gameId: number;
  token: string;
  setCurrentGame: (g: GameData | null) => void;
  setGameTabAction: Dispatch<SetStateAction<GameTab>>;
};

export default function Forfeit({
  gameId,
  token,
  setCurrentGame,
  setGameTabAction,
}: Props) {
  const forfeit = async () => {
    let result;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/games/${gameId}/forfeit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      result = await response.json();

      setGameTabAction((prev) => (prev === "play" ? "active games" : "play"));
      setCurrentGame(null);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <button
      onClick={forfeit}
      className="hover:bg-background hover:text-background flex border-2 border-outline bg-foreground p-2 md:mt-0 lg:mt-0 md:ml-4 lg:ml-4 w-full md:w-[200px] lg:w-[300px]"
    >
      <p className="text-center w-full whitespace-nowrap">Forfeit</p>
    </button>
  );
}
