"use client";

import { useEffect, useState } from "react";

interface GameInfo {
  white: number;
  black: number;
  whomst: number;
}

export default function GamesWindow() {
  const [games, setGames] = useState<Info | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/games", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();

        setGames({
          white: result.games.player_1,
          black: result.games.player_2,
          whomst: result.games.whomst,
        });

        console.log(result);

      } catch (error) {
        setError("Failed to fetch data");
        console.error("There was a problem with the fetch operation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!games) return <div>No data</div>;

  return (
    <main className="p-5">
      <h1>User Info:</h1>
      <ul>
        <li>White: {games.player_1}</li>
        <li>Black: {games.player_2}</li>
        <li>Whomst: {games.whomst}</li>
      </ul>
    </main>
  );
}
