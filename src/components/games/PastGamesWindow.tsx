"use client";

import { useEffect, useState } from "react";

interface GameData {
  white: number;
  black: number;
  white_player_name: string;
  black_player_name: string;
  whomst: number;
}

export default function GamesWindow() {
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
    <div className="p-5">
      <h1>Games :</h1>
    </div>
  );
}
