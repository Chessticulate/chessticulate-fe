"use client";

import { GameData, GameTab, ChallengeData, NavTab } from "@/types";
import { getCookie } from "cookies-next";

type Props = {
  challenge: ChallengeData;
  setGame: React.Dispatch<React.SetStateAction<GameData | null>>;
  setGameTab(t: GameTab): void;
  setActiveTab(t: NavTab): void;
};

export default function Challenge({
  challenge,
  setGame,
  setActiveTab,
  setGameTab,
}: Props) {
  const token = getCookie("token") as string;

  const username = challenge.requester_username;

  // challenges can only be accepted by oppenent or canceled by creator
  const acceptChallenge = async () => {
    let result;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/challenges/${challenge.id}/accept`,
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

      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/games?game_id=${result["game_id"]}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const res = await resp.json();
      const game = res[0];

      setGame(() => {
        const perspective =
          username === game.white_username ? "white" : "black";
        const mode = "pvp";
        return {
          ...game,
          mode,
          perspective,
        };
      });
      setActiveTab("active");
      setGameTab("play");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <div className="flex justify-around pl-5 pr-5 pt-2 pb-2 border-2 rounded-md border-outline mt-2 mb-4 hover:bg-outline hover:text-foreground hover:scale-105 transition">
      <div className="p-1">Challenge from {username}</div>
      <>
        <button
          className="pl-2"
          onClick={() => {
            acceptChallenge();
          }}
        >
          {" "}
          accept{" "}
        </button>
      </>
    </div>
  );
}
