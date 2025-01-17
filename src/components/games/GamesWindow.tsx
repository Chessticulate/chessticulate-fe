"use client";

import { useEffect, useState } from "react";
import GameRow from "@/components/games/GameRow";
import { GameData, GamesWindowProps } from "@/types";
import Chessboard from "@/components/Chessboard";
import Footer from "@/components/Footer";

export default function GamesWindow({
  activeTab,
  setActiveTab,
  currentGame,
  setCurrentGame,
}: GamesWindowProps) {
  const [activeGames, setActiveGames] = useState<GameData[] | null>(null);
  const [completedGames, setCompletedGames] = useState<GameData[] | null>(null);
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
          <>
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
          </>
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
      {renderContent()}
      {/* <Footer /> */}
    </div>
  );
}
