"use client";

import { GameData, GameTab, Jwt } from "@/types";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

type Props = {
  game: GameData;
  setGame: React.Dispatch<React.SetStateAction<GameData | null>>;
  setGameTab(t: GameTab): void;
};

export default function GameRow({
  game,
  setGame,
  setGameTab,
}: Props) {
  
  const token = getCookie("token") as string;
  const decodedToken = jwtDecode<Jwt>(token);
  const { id, white, black, white_username, black_username, winner } =
    game;

  const perspective = decodedToken.user_name === white_username ? "white" : "black"; 

  let winnerName;
  if (winner) {
    winnerName = winner === white ? white_username : black_username;
  }
 
  const handleSelect = () => {
    setGame(prev => {
      // const perspective = prev?.perspective ?? "white";
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
      <button
        className="flex justify-between pl-5 pr-5 pt-2 pb-2 border-2 rounded-md border-outline m-2 hover:bg-outline hover:text-background hover:scale-105 transition"
        onClick={() => handleSelect()}
      >
        {decodedToken.user_name === white_username ? (  
          <>
            <div className="p-1">🔲 {white_username}</div>
            <p className="p-1"> VS </p>
            <div className="p-1">◼️ {black_username}</div>
          </>
        ) : (
          <> 
            <div className="p-1">◼️ {black_username}</div>
            <p className="p-1"> VS </p>
            <div className="p-1">🔲 {white_username}</div>
          </>
        )}
        {winnerName && <div className="p-1"> Winner: {winnerName} </div>}
      </button>
  );
}
