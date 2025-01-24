"use client";

import GamesWindow from "@/components/games/GamesWindow";
import InvitationsWindow from "@/components/invitations/InvitationsWindow";
import { GameData, TabProps, Move } from "@/types";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

export default function Dashboard({ activeTab, setActiveTab }: TabProps) {
  const [currentGame, setCurrentGame] = useState<GameData | null>(null);
  const [moveHist, setMoveHist] = useState<string[]>([]);
  const token = getCookie("token");

  // move history should only be a list of strings
  // get moves returns move objects that contain extra data
  // the move str should be extracted from this list of data and stored in moveHist

  const extractMoves = (moveList: Move[]) => {
    return moveList.map((move) => move.movestr);
  };

  useEffect(() => {
    const fetchMoves = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/moves?game_id=${currentGame?.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();

        setMoveHist(extractMoves(result));
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    if (currentGame) {
      fetchMoves();
    }
  }, [currentGame, token]);

  return (
    <div className="flex h-full">
      <div className="flex-grow basis-3/4 pt-5">
        <GamesWindow
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentGame={currentGame}
          setCurrentGame={setCurrentGame}
          moveHist={moveHist}
          setMoveHist={setMoveHist}
        />
      </div>
      <div className="basis-1/4 pr-5">
        <InvitationsWindow currentGame={currentGame} moveHist={moveHist} />
      </div>
    </div>
  );
}
