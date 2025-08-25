"use client";

import { jwtDecode } from "jwt-decode";
import {
  Color,
  GameData,
  NavTab,
  MoveData,
  Jwt,
  InvitationData,
} from "@/types";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { redirect } from "next/navigation";

import Chessboard from "@/components/Chessboard";
import ResetButton from "@/components/ResetButton";
import FenView from "@/components/FenView";
import FenInput from "@/components/FenInput";
import ChessboardStatus from "@/components/ChessboardStatus";
import MoveHistory from "@/components/MoveHistory";
import FlipPerspectiveButton from "@/components/FlipPerspectiveButton";
import TeamSwitch from "@/components/TeamSwitch";

// Chess obj has a type of any since shallowpink does not export any types
// long term it might be best to create a chess interface
//const Chess: any = require("shallowpink/lib/chess");
const Shallowpink = require("shallowpink");

type Props = {
  activeTab: NavTab;
};

async function fetchBook(): Promise<Uint8Array> {
  const res = await fetch("/books/Performance.bin");
  return new Uint8Array(await res.arrayBuffer());
}

let book: Uint8Array | null = null;
fetchBook()
  .then((b) => {
    book = b;
  })
  .catch((e) => {
    console.error("Failed to load opening book:", e);
  });

export default function Dashboard({ activeTab }: Props) {
  const token = getCookie("token") as string;

  const [currentGame, setCurrentGame] = useState<GameData | null>(null);
  const [currentGameMoveHist, setCurrentGameMoveHist] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  /*const [currentGameFenString, setCurrentGameFenString] = useState<string>("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [currentGameStates, setCurrentGameStates] = useState<any>(null); */

  const [sandboxFenString, setSandboxFenString] = useState<string>(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  );
  const [sandboxStates, setSandboxStates] = useState<Map<number, number>>(
    new Map(),
  );
  const [sandboxMoveHist, setSandboxMoveHist] = useState<string[]>([]);
  const [sandboxGameStatus, setSandboxGameStatus] = useState<string>("");
  const [sandboxPerspective, setSandboxPerspective] = useState<Color>("white");

  const [shallowpinkFenString, setShallowpinkFenString] = useState<string>(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  );
  const [shallowpinkStates, setShallowpinkStates] = useState<
    Map<number, number>
  >(new Map());
  // shallowpink transposition table
  const [shallowpinkTable, setShallowpinkTable] = useState<
    Map<bigint, Map<string, number>>
  >(new Map());
  const [shallowpinkMoveHist, setShallowpinkMoveHist] = useState<string[]>([]);
  const [shallowpinkColor, setShallowpinkColor] = useState<string>(
    Shallowpink.Color.BLACK,
  );
  const [shallowpinkGameStatus, setShallowpinkGameStatus] =
    useState<string>("");
  const [shallowpinkPerspective, setShallowpinkPerspective] =
    useState<Color>("white");
  const [shallowpinkCurrentTeam, setShallowpinkCurrentTeam] =
    useState<Color>("white");

  const [activeGames, setActiveGames] = useState<GameData[] | null>(null);
  const [completedGames, setCompletedGames] = useState<GameData[] | null>(null);

  const [recvdInvitations, setRecvdInvitations] = useState<InvitationData[]>(
    [],
  );
  const [sentInvitations, setSentInvitations] = useState<InvitationData[]>([]);

  // highlight squares
  const [shallowpinkLastOrig, setShallowpinkLastOrig] = useState<number[]>([]);
  const [shallowpinkLastDest, setShallowpinkLastDest] = useState<number[]>([]);
  const [sandboxLastOrig, setSandboxLastOrig] = useState<number[]>([]);
  const [sandboxLastDest, setSandboxLastDest] = useState<number[]>([]);

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
    if (whomst === shallowpinkCurrentTeam) {
      return;
    }

    const worker = new Worker(
      new URL("../../workers/shallowpink-worker.js", import.meta.url),
    );

    worker.postMessage({
      fenStr: shallowpinkFenString,
      states: shallowpinkStates,
      book: book,
      table: shallowpinkTable,
    });
    worker.onmessage = ({ data: { move, error, table } }) => {
      if (error) {
        throw new Error(`An error occurred while generating AI move: ${error}`);
      }
      console.log(table);

      const chessObj = new Shallowpink(
        shallowpinkFenString,
        shallowpinkStates,
        null, // only ai uses the opening book
        table,
      );
      const result = chessObj.move(move);
      if (
        result == "invalid move" ||
        result == "player is still in check" ||
        result == "move puts player in check" ||
        result == "game over"
      ) {
        throw new Error(`shallowpink gave us a bad move: ${move} -> ${result}`);
      }
      setShallowpinkMoveHist([...shallowpinkMoveHist, move]);
      setShallowpinkFenString(chessObj.toFEN());
      setShallowpinkStates(new Map(shallowpinkStates));
      setShallowpinkTable(chessObj.table);
      setShallowpinkGameStatus(result);
      setShallowpinkLastOrig(chessObj.lastOrig);
      setShallowpinkLastDest(chessObj.lastDest);
      if (
        [
          "checkmate",
          "stalemate",
          "draw",
          "insufficient material",
          "three-fold repetition",
          "fifty-move rule",
        ].includes(result)
      ) {
        setGameOver(true);
      }
    };
  }, [
    shallowpinkFenString,
    shallowpinkMoveHist,
    shallowpinkStates,
    shallowpinkTable,
    shallowpinkColor,
    shallowpinkGameStatus,
    shallowpinkCurrentTeam,
  ]);

  const flipSandboxPerspective = () => {
    if (sandboxPerspective === "white") {
      setSandboxPerspective("black");
    } else {
      setSandboxPerspective("white");
    }
  };

  const flipShallowpinkPerspective = () => {
    if (shallowpinkPerspective === "white") {
      setShallowpinkPerspective("black");
    } else {
      setShallowpinkPerspective("white");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "sandbox":
        return (
          <div className="md:flex lg:flex lg:justify-center">
            <Chessboard
              fen={sandboxFenString}
              states={sandboxStates}
              submitMove={submitMoveSandbox}
              perspective={sandboxPerspective}
              gameOver={gameOver}
              setGameOver={setGameOver}
              lastOrig={sandboxLastOrig}
              lastDest={sandboxLastDest}
              setLastOrig={setSandboxLastOrig}
              setLastDest={setSandboxLastDest}
            />
            <div className="">
              <div className="ml-2 mr-2 md:m-0 lg:m-0">
                <ChessboardStatus
                  fenStr={sandboxFenString}
                  gameStatus={sandboxGameStatus}
                />
              </div>
              <div className="">
                <div className="flex mt-4 ml-2 mr-2 md:block md:m-0 md:block lg:m-0 lg:block">
                  <div className="flex-1 mr-1 md:mr-0 md:mb-2 lg:mr-0 lg:mb-2">
                    <FlipPerspectiveButton
                      flipPerspective={flipSandboxPerspective}
                    />
                  </div>
                  <div className="flex-1 ml-1 md:m-0 md:mb-2 lg:m-0 lg:mb-2">
                    <ResetButton
                      setFenString={setSandboxFenString}
                      setMoveHistory={setSandboxMoveHist}
                      setStates={setSandboxStates}
                      setGameOver={setGameOver}
                      setStatus={setSandboxGameStatus}
                      setLastOrig={setSandboxLastOrig}
                      setLastDest={setSandboxLastDest}
                    />
                  </div>
                </div>
                <FenView fenstr={sandboxFenString} />
                <FenInput setFenString={setSandboxFenString} />
                <MoveHistory moves={sandboxMoveHist} isShallowpink={false} />
              </div>
            </div>
          </div>
        );
      case "shallowpink":
        return (
          <div className="md:flex lg:flex lg:justify-center">
            <Chessboard
              fen={shallowpinkFenString}
              states={shallowpinkStates}
              submitMove={submitMoveShallowpink}
              perspective={shallowpinkPerspective}
              gameOver={gameOver}
              setGameOver={setGameOver}
              lastOrig={shallowpinkLastOrig}
              lastDest={shallowpinkLastDest}
              setLastOrig={setShallowpinkLastOrig}
              setLastDest={setShallowpinkLastDest}
            />
            <div className="">
              <div className="ml-2 mr-2 md:m-0 lg:m-0">
                <ChessboardStatus
                  fenStr={shallowpinkFenString}
                  gameStatus={shallowpinkGameStatus}
                />
              </div>
              <TeamSwitch
                currentTeam={shallowpinkCurrentTeam}
                setTeam={setShallowpinkCurrentTeam}
              />
              <div className="">
                <div className="flex mt-4 ml-2 mr-2 md:block md:m-0 md:block lg:m-0 lg:block">
                  <div className="flex-1 mr-1 md:mr-0 md:mb-2 lg:mr-0 lg:mb-2">
                    <FlipPerspectiveButton
                      flipPerspective={flipShallowpinkPerspective}
                    />
                  </div>
                  <div className="flex-1 ml-1 md:m-0 md:mb-2 lg:m-0 lg:mb-2">
                    <ResetButton
                      setFenString={setShallowpinkFenString}
                      setMoveHistory={setShallowpinkMoveHist}
                      setStates={setShallowpinkStates}
                      setGameOver={setGameOver}
                      setStatus={setShallowpinkGameStatus}
                      setLastOrig={setShallowpinkLastOrig}
                      setLastDest={setShallowpinkLastDest}
                    />
                  </div>
                </div>
                <FenView fenstr={shallowpinkFenString} />
                <FenInput setFenString={setShallowpinkFenString} />
                <MoveHistory moves={shallowpinkMoveHist} isShallowpink={true} />
              </div>
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
