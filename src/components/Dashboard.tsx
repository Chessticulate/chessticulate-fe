"use client";

import { jwtDecode } from "jwt-decode";
import { GameData, NavTab, MoveData, Jwt, InvitationData } from "@/types";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { redirect } from "next/navigation";

import Chessboard from "@/components/Chessboard";
import ResetButton from "@/components/ResetButton";
import FenView from "@/components/FenView";
import FenInput from "@/components/FenInput";
import ChessboardStatus from "@/components/ChessboardStatus";
import MoveHistory from "@/components/MoveHistory";

// Chess obj has a type of any since shallowpink does not export any types
// long term it might be best to create a chess interface
//const Chess: any = require("shallowpink/lib/chess");
const Shallowpink = require("shallowpink");

type Props = {
  activeTab: NavTab;
  setActiveTab(t: NavTab): void;
};

export default function Dashboard({ activeTab, setActiveTab }: Props) {
  const token = getCookie("token") as string;

  const [currentGame, setCurrentGame] = useState<GameData | null>(null);
  const [currentGameMoveHist, setCurrentGameMoveHist] = useState<string[]>([]);
  /*const [currentGameFenString, setCurrentGameFenString] = useState<string>("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [currentGameStates, setCurrentGameStates] = useState<any>(null);
  const [sandboxMoveHist, setSandboxMoveHist] = useState<string[]>([])*/

  const [sandboxFenString, setSandboxFenString] = useState<string>(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  );
  const [sandboxStates, setSandboxStates] = useState<Map<number, number>>(
    new Map(),
  );
  const [sandboxMoveHist, setSandboxMoveHist] = useState<string[]>([]);
  const [sandboxGameStatus, setSandboxGameStatus] = useState<string>("");

  const [shallowpinkFenString, setShallowpinkFenString] = useState<string>(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  );
  const [shallowpinkStates, setShallowpinkStates] = useState<
    Map<number, number>
  >(new Map());
  const [shallowpinkMoveHist, setShallowpinkMoveHist] = useState<string[]>([]);
  const [shallowpinkColor, setShallowpinkColor] = useState<string>(
    Shallowpink.Color.BLACK,
  );
  const [shallowpinkGameStatus, setShallowpinkGameStatus] = useState<string>("");

  const [activeGames, setActiveGames] = useState<GameData[] | null>(null);
  const [completedGames, setCompletedGames] = useState<GameData[] | null>(null);

  const [recvdInvitations, setRecvdInvitations] = useState<InvitationData[]>(
    [],
  );
  const [sentInvitations, setSentInvitations] = useState<InvitationData[]>([]);

  useEffect(() => {
    if (!token || !currentGame) {
      return;
    }
    (async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/moves?game_id=${currentGame?.id}`,
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

        const result: MoveData[] = await response.json();

        setCurrentGameMoveHist(result.map((move) => move.movestr));
      } catch (error) {
        console.error(
          `there was a problem fetching move history for active game ${currentGame?.id}:`,
          error,
        );
      }
    })();
  }, [token, currentGame]);

  useEffect(() => {
    if (!token) {
      return;
    }
    (async () => {
      const decodedToken = jwtDecode<Jwt>(token);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/games?player_id=${decodedToken.user_id}&is_active=True`,
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
        setActiveGames(result);
      } catch (error) {
        console.error("there was a problem fetching active games:", error);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }
    (async () => {
      const decodedToken = jwtDecode<Jwt>(token);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/games?player_id=${decodedToken.user_id}&is_active=False`,
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
        setCompletedGames(result);
      } catch (error) {
        console.error("there was a problem fetching completed games:", error);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }
    (async () => {
      const decodedToken = jwtDecode<Jwt>(token);
      const uid = decodedToken.user_id;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/invitations?to_id=${uid}&status=PENDING`,
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
        setRecvdInvitations(result);
      } catch (error) {
        console.error(
          "there was a problem fetching received invitations:",
          error,
        );
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }
    (async () => {
      const decodedToken = jwtDecode<Jwt>(token);
      const uid = decodedToken.user_id;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/invitations?from_id=${uid}`,
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
        setSentInvitations(result);
      } catch (error) {
        console.error("there was a problem fetching sent invitations:", error);
      }
    })();
  }, [token]);

  const submitMove = async (move: string) => {
    if (!currentGame) {
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/games/${currentGame.id}/move`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ move }),
        },
      );

      if (!response.ok)
        throw new Error(
          `failed to submit move: ${response.status} ${response.statusText}`,
        );
      const data = await response.json();
      // update move history
      setCurrentGame(data);
      console.log("Move submitted:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const submitMoveSandbox = async (
    fen: string,
    states: Map<number, number>,
    move: string,
    gameStatus: string,
  ) => {
    setSandboxMoveHist([...sandboxMoveHist, move]);
    setSandboxFenString(fen);
    setSandboxStates(new Map(states));
    setSandboxGameStatus(gameStatus);
  };

  const submitMoveShallowpink = async (
    fen: string,
    states: Map<number, number>,
    move: string,
    gameStatus: string,
  ) => {
    setShallowpinkMoveHist([...shallowpinkMoveHist, move]);
    setShallowpinkFenString(fen);
    setShallowpinkStates(new Map(states));
    setShallowpinkGameStatus(gameStatus);
  };

  useEffect(() => {
    const whomst =
      shallowpinkFenString.split(" ")[1] === "w"
        ? Shallowpink.Color.WHITE
        : Shallowpink.Color.BLACK;
    if (whomst !== shallowpinkColor) {
      return;
    }

    const worker = new Worker(
      new URL("../../workers/shallowpink-worker.js", import.meta.url),
    );
    worker.postMessage({ fenStr: shallowpinkFenString });
    worker.onmessage = ({ data: { move, error } }) => {
      if (error) {
        throw new Error(`An error occurred while generating AI move: ${error}`);
      }
      const chessObj = new Shallowpink(shallowpinkFenString, shallowpinkStates);
      const result = chessObj.move(move);
      if (
        result == "invalid move" ||
        result == "player is still in check" ||
        result == "move puts player in check"
      ) {
        throw new Error(`shallowpink gave us a bad move: ${move} -> ${result}`);
      }
      setShallowpinkMoveHist([...shallowpinkMoveHist, move]);
      setShallowpinkFenString(chessObj.toFEN());
      setShallowpinkStates(new Map(shallowpinkStates));
      setShallowpinkGameStatus(result);
    };
  }, [
    shallowpinkFenString,
    shallowpinkMoveHist,
    shallowpinkStates,
    shallowpinkColor,
  ]);

  const renderContent = () => {
    switch (activeTab) {
      case "sandbox":
        return (
          <div className="block md:flex lg:flex lg:justify-center">
            <Chessboard
              fen={sandboxFenString}
              states={sandboxStates}
              submitMove={submitMoveSandbox}
            />
            <div className="block">
              <div className="flex md:block lg:block">
                <div className="ml-2 mt-2 md:m-0 lg:m-0 flex-1">
                  <ChessboardStatus fenStr={sandboxFenString} gameStatus={sandboxGameStatus} />
                </div>
                <div className="ml-2 mr-2 mt-4 md:m-0 lg:m-0 lg:mb-2 flex-1">
                  <ResetButton setFenString={setSandboxFenString} setMoveHistory={setSandboxMoveHist} setStates={setSandboxStates} />
                </div>
              </div>
              <FenView fenstr={sandboxFenString} />
              <FenInput setFenString={setSandboxFenString} />
              <MoveHistory moves={sandboxMoveHist} />
            </div>
          </div>
        );
      case "shallowpink":
        return (
          <div className="block md:flex lg:flex lg:justify-center">
            <Chessboard
              fen={shallowpinkFenString}
              states={shallowpinkStates}
              submitMove={submitMoveShallowpink}
            />
            <div className="block">
              <div className="flex md:block lg:block">
                <div className="ml-2 mt-2 md:m-0 lg:m-0 flex-1">
                  <ChessboardStatus fenStr={shallowpinkFenString} gameStatus={shallowpinkGameStatus} />
                </div>
                <div className="ml-2 mr-2 mt-4 md:m-0 lg:m-0 lg:mb-2 flex-1">
                  <ResetButton setFenString={setShallowpinkFenString} setMoveHistory={setShallowpinkMoveHist} setStates={setShallowpinkStates} />
                </div>
              </div>
              <FenView fenstr={shallowpinkFenString} />
              <FenInput setFenString={setShallowpinkFenString} />
              <MoveHistory moves={shallowpinkMoveHist} />
            </div>
          </div>
        );
      default:
        if (!token) {
          redirect("/signup");
        }
        return (
          <div className="flex justify-center pt-2">
            <h1>Not Implemented</h1>
          </div>
        );
      /*case "active":
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
        );*/
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
