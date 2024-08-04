"use client";

import { useEffect, useState } from "react";

interface Info {
  name: string;
  wins: number;
  draws: number;
  losses: number;
}

export default function DataFetchingComponent() {
  const [info, setInfo] = useState<Info | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/users/self", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();

        setInfo({
          name: result.userData.name,
          wins: result.userData.wins,
          draws: result.userData.draws,
          losses: result.userData.losses,
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
  if (!info) return <div>No data</div>;

  return (
    <main className="p-5">
      <h1>User Info:</h1>
      <ul>
        <li>Username: {info.name}</li>
        <li>Games Played: {info.wins + info.draws + info.losses}</li>
        <li>Wins: {info.wins}</li>
        <li>Draws: {info.draws}</li>
        <li>Losses: {info.losses}</li>
      </ul>
    </main>
  );
}
