"use client";

import { useEffect, useState } from "react";
import { UserData } from "@/types";
import { getCookie } from "cookies-next";

export default function ProfileInfo() {
  const [info, setInfo] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = getCookie("token") as string;
    if (token) {
      setToken(token);
      setIsLoading(true);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }
    (async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/users/self`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            `response was not ok: ${response.status} ${response.statusText}`,
          );
        }

        const result = await response.json();

        setInfo({
          name: result.name,
          wins: result.wins,
          draws: result.draws,
          losses: result.losses,
        });

        console.log("user info", result);
      } catch (error) {
        setError("failed to load profile information");
        console.error("There was a problem fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [token]);

  if (error) {
    return (
      <div className="p-5">
        <em>Error: {error}</em>
      </div>
    );
  } else if (isLoading) {
    return (
      <div className="p-5">
        <em>Loading profile...</em>
      </div>
    );
  } else if (info) {
    return (
      <div className="p-5">
        <h2>{info.name}</h2>
        <ul>
          <li>Games Played: {info.wins + info.draws + info.losses}</li>
          <li>Wins: {info.wins}</li>
          <li>Draws: {info.draws}</li>
          <li>Losses: {info.losses}</li>
        </ul>
      </div>
    );
  } else {
    return (
      <h2 className="p-5">Login or create an account to play other users!</h2>
    );
  }
}
