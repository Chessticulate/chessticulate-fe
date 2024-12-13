"use client";

import { useEffect, useState } from "react";
import GameRow from "@/components/games/GameRow";
import { GameData } from "@/types";
import Chessboard from "@/components/Chessboard";
import Footer from "@/components/Footer";

export default function GamesWindow() {
  const [activeGames, setActiveGames] = useState<GameData[] | null>(null);
  const [currentGame, setCurrentGame] = useState<GameData | null>(null);
  const [completedGames, setCompletedGames] = useState<GameData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "play">(
    "play",
  );

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

  const handlePlay = (gameId: number) => {
    setActiveTab("play");
    setCurrentGame(activeGames?.find((game) => game.id == gameId) || null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "active":
        return (
          <div className="flex flex-col overflow-hidden">
            {activeGames &&
              activeGames.map((game, index) => (
                <GameRow
                  key={index}
                  game={game}
                  active={true}
                  onPlay={handlePlay}
                  onForfeit={handleForfeit}
                />
              ))}
          </div>
        );
      case "completed":
        return (
          <>
            {completedGames &&
              completedGames.map((game, index) => (
                <GameRow
                  key={index}
                  game={game}
                  active={false}
                  onPlay={handlePlay}
                  onForfeit={handleForfeit}
                />
              ))}
          </>
        );
      case "play":
        return (
          <div className="flex justify-center pt-2">
            <Chessboard game={currentGame} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Tabs */}
      <ul className="flex flex-wrap text-sm text-center">
        <li className="me-2">
          <button
            onClick={() => {
              setActiveTab("play");
              setCurrentGame(null);
            }}
            className={`inline-block p-4 rounded-b-lg ${
              activeTab === "play" ? "bg-[#1f1f1f]" : "hover:bg-[#1f1f1f]"
            }`}
          >
            Play
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => setActiveTab("active")}
            className={`inline-block p-4 rounded-b-lg ${
              activeTab === "active" ? "bg-[#1f1f1f]" : "hover:bg-[#1f1f1f]"
            }`}
          >
            Active Games
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => setActiveTab("completed")}
            className={`inline-block p-4 rounded-b-lg ${
              activeTab === "completed" ? "bg-[#1f1f1f]" : "hover:bg-[#1f1f1f]"
            }`}
          >
            Completed Games
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      {renderContent()}
      {/* <Footer /> */}
    </div>
  );
}
