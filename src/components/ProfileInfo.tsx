"use client";

import { useEffect, useState } from "react";
import { UserData } from "@/types";

export default function ProfileInfo() {
  const [info, setInfo] = useState<UserData | null>(null);
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

        console.log("user info", result);
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
  if (!info) return <>No data</>;

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
