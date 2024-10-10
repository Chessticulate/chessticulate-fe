"use client";

import { useEffect, useState } from "react";
import GameRow from "@/components/games/GameRow";

type GameData = {
  id: number;
  white: number;
  black: number;
  white_username: string;
  black_username: string;
  whomst: number;
  winner: number;
};

export default function GamesWindow() {
  const [activeGames, setActiveGames] = useState<GameData[] | null>(null);
  const [completedGames, setCompletedGames] = useState<GameData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

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
        setActiveGames(result.active);
        setCompletedGames(result.completed);

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
  if (!activeGames && !completedGames) return <>No data</>;

  const handleForfeit = (gameId: number) => {
    setActiveGames(
      (prevGames) => prevGames?.filter((game) => game.id != gameId) || [],
    );
  };

  return (
    <div>
      {/* Tabs */}
      <ul className="flex flex-wrap text-sm text-center">
        <li className="me-2">
          <button
            onClick={() => setActiveTab("active")}
            className={`inline-block p-4 ${
              activeTab === "active"
                ? "bg-gray-100 active dark:bg-gray-800"
                : "hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Active Games
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => setActiveTab("completed")}
            className={`inline-block p-4 ${
              activeTab === "completed"
                ? "bg-gray-100 active dark:bg-gray-800"
                : "hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Completed Games
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      {activeTab === "active" ? (
        <div>
          {activeGames &&
            activeGames.map((game, index) => (
              <GameRow
                key={index}
                active={true}
                game_id={game.id}
                white={game.white}
                black={game.black}
                white_username={game.white_username}
                black_username={game.black_username}
                winner={game.winner}
                whomst={
                  game.whomst == game.white
                    ? game.white_username
                    : game.black_username
                }
                onForfeit={handleForfeit}
              />
            ))}
        </div>
      ) : (
        <div>
          {/*type error is thrown here if onForfeit inst included in props, so its included even though it isnt usable for completed games*/}
          {/*just a temporary fix*/}
          {completedGames &&
            completedGames.map((game, index) => (
              <GameRow
                key={index}
                active={false}
                game_id={game.id}
                white={game.white}
                black={game.black}
                white_username={game.white_username}
                black_username={game.black_username}
                winner={game.winner}
                whomst={
                  game.whomst == game.white
                    ? game.white_username
                    : game.black_username
                }
                onForfeit={handleForfeit}
              />
            ))}
        </div>
      )}
    </div>
  );
}
