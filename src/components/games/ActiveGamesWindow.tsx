"use client";

import { useEffect, useState } from "react";
import GameRow from "@/components/games/GameRow";

type GameData = {
  white: number;
  black: number;
  white_username: string;
  black_username: string;
  whomst: number;
};

export default function ActiveGamesWindow() {
  const [games, setGames] = useState<GameData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/list-games", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setGames(result.games);

        console.log("games", result);
      } catch (error) {
        setError("Failed to fetch data");
        console.error("There was a problem with the fetch operation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <>Loading...</>;
  if (error) return <>Error: {error}</>;
  if (!games) return <>No data</>;

  return (
    <div>
      <h1 className=""> Active Games: </h1>
      {games.map((game, index) => (
        <GameRow
          key={index}
          white={game.white}
          black={game.black}
          white_username={game.white_username}
          black_username={game.black_username}
          whomst={
            game.whomst == game.white
              ? game.white_username
              : game.black_username
          }
        />
      ))}
    </div>
  );
}
