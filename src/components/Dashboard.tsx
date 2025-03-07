"use client";

import { jwtDecode } from "jwt-decode";
import { GameData, Tab, MoveData, Jwt, InvitationData } from "@/types";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

import GameRow from "@/components/games/GameRow";
import InvitationRow from "@/components/invitations/InvitationRow";
import Chessboard from "@/components/Chessboard";

type Props = {
  activeTab: Tab;
};

export default function Dashboard({ activeTab }: Props) {
  const token = getCookie("token") as string;

  const [currentGame, setCurrentGame] = useState<GameData | null>(null);
  const [currentGameMoveHist, setCurrentGameMoveHist] = useState<string[]>([]);

  const [sandboxGame, setSandboxGame] = useState<string>('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  const [sandboxMoveHist, setSandboxMoveHist] = useState<string[]>([])

  const [activeGames, setActiveGames] = useState<GameData[] | null>(null);
  const [completedGames, setCompletedGames] = useState<GameData[] | null>(null);

  const [recvdInvitations, setRecvdInvitations] = useState<InvitationData[]>([]);
  const [sentInvitations, setSentInvitations] = useState<InvitationData[]>([]);

  useEffect(() => {
    const fetchCurrentGameMoves = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/moves?game_id=${currentGame?.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`failed to fetch moves for game ${currentGame?.id}: ${response.statusText}`);
        }

        const result: MoveData[] = await response.json();

        setCurrentGameMoveHist(result.map(move => move.movestr));
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }
    if (currentGame) {
      fetchCurrentGameMoves();
    }
  }, [currentGame, token]);

  useEffect(() => {
    const fetchActiveGames = async () => {
      const decodedToken = jwtDecode<Jwt>(token);
      try {
        const response = await fetch(
        `${process.env.CHESSTICULATE_API_URL}/games?player_id=${decodedToken.user_id}&is_active=True`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setActiveGames(result);

        console.log("games", result);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchActiveGames();
  }, [token]);

  useEffect(() => {
    const fetchCompletedGames = async () => {
      const decodedToken = jwtDecode<Jwt>(token);
      try {
        const response = await fetch(
        `${process.env.CHESSTICULATE_API_URL}/games?player_id=${decodedToken.user_id}&is_active=False`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setCompletedGames(result);

        console.log("games", result);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchCompletedGames();
  }, [token]);

  const renderContent = () => {
    switch (activeTab) {
      case "sandbox":
        {
          <div className="flex justify-center pt-2">
            <Chessboard
              game={currentGame}
              moveHist={Hist}
              setMoveHist={setMoveHist}
            />
          </div>
        };
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
      case "":
        return (
          <div className="flex justify-center pt-2">
            <Chessboard
              game={currentGame}
              moveHist={moveHist}
              setMoveHist={setMoveHist}
            />
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="flex h-full">
      <div className="flex-grow basis-3/4 pt-5">
        <div>
          {renderContent()}
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
}
