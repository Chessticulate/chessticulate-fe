"use client";

import { jwtDecode } from "jwt-decode";
import {
  Color,
  Status,
  GameData,
  NavTab,
  GameTab,
  Jwt,
  InvitationData,
  ChallengeData,
  ShallowpinkData,
  INITIAL_SHALLOWPINK_STATE,
} from "@/types";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { redirect } from "next/navigation";

import Chessboard from "@/components/Chessboard";
import ChallengeBoard from "@/components/ChallengeBoard";
import ResetButton from "@/components/ResetButton";
import FenView from "@/components/FenView";
import FenInput from "@/components/FenInput";
import ChessboardStatus from "@/components/ChessboardStatus";
import MoveHistory from "@/components/MoveHistory";
import FlipPerspectiveButton from "@/components/FlipPerspectiveButton";
import ProfileInfo from "@/components/ProfileInfo";
import TeamSwitch from "@/components/TeamSwitch";
import ActiveGames from "@/components/games/ActiveGames";
import ActiveGamesToggle from "@/components/games/ActiveGamesToggle";

// Chess obj has a type of any since shallowpink does not export any types
// long term it might be best to create a chess interface
//const Chess: any = require("shallowpink/lib/chess");
const Shallowpink = require("shallowpink");

type Props = {
  activeTab: NavTab;
  setActiveTab(t: NavTab): void;
};

async function fetchBook(): Promise<Uint8Array> {
  const res = await fetch("/books/Performance.bin");
  return new Uint8Array(await res.arrayBuffer());
}

export default function Dashboard({ activeTab, setActiveTab }: Props) {
  const token = getCookie("token") as string;
  const [book, setBook] = useState<Uint8Array | null>(null);

  // CURRENT GAME STATES (PvP)
  const [currentGame, setCurrentGame] = useState<GameData | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [currentGameStates, setCurrentGameStates] = useState<any>(null);
  const [currentGameStatus, setCurrentGameStatus] = useState<Status | null>("move ok");
  const [currentGamePerspective, setCurrentGamePerspective] = useState<Color>("white");
  const [currentGameLastOrig, setCurrentGameLastOrig] = useState<number[]>([]);
  const [currentGameLastDest, setCurrentGameLastDest] = useState<number[]>([]);

  // SANDBOX STATES
  const [sandboxFenString, setSandboxFenString] = useState<string>(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  );
  const [sandboxStates, setSandboxStates] = useState<Map<number, number>>(
    new Map(),
  );
  const [sandboxMoveHist, setSandboxMoveHist] = useState<string[]>([]);
  const [sandboxGameStatus, setSandboxGameStatus] = useState<string>("");
  const [sandboxPerspective, setSandboxPerspective] = useState<Color>("white");

  // highlight squares
  const [sandboxLastOrig, setSandboxLastOrig] = useState<number[]>([]);
  const [sandboxLastDest, setSandboxLastDest] = useState<number[]>([]);


  // SHALLOWPINK STATES
  
  // lets first figure out what states can be consolidated
  // I think FEN and move history for sure


  const [shallowpink, setShallowpink] =
  useState<ShallowpinkData>(INITIAL_SHALLOWPINK_STATE);

  
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
  const [shallowpinkGameStatus, setShallowpinkGameStatus] =
    useState<string>("");
  const [shallowpinkPerspective, setShallowpinkPerspective] =
    useState<Color>("white");
  const [shallowpinkCurrentTeam, setShallowpinkCurrentTeam] =
    useState<Color>("white");

  // highlight squares
  const [shallowpinkLastOrig, setShallowpinkLastOrig] = useState<number[]>([]);
  const [shallowpinkLastDest, setShallowpinkLastDest] = useState<number[]>([]);

  const [activeGames, setActiveGames] = useState<GameData[] | null>(null);
  const [completedGames, setCompletedGames] = useState<GameData[] | null>(null);

  const [recvdInvitations, setRecvdInvitations] = useState<InvitationData[]>(
    [],
  );
  const [sentInvitations, setSentInvitations] = useState<InvitationData[]>([]);

  // challenges
  const [gameTab, setGameTab] = useState<GameTab>("active games");
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<ChallengeData | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchBook()
      .then((b) => {
        if (!cancelled) setBook(b);
      })
      .catch((e) => {
        console.error("Failed to load opening book:", e);
      });

    return () => {
      cancelled = true;
    };
  }, []);


  // ACTIVE GAMES 
  // currentGame.id is added to this useEffects dependancy array to trigger a fetch after accepting a challenge
  // otherwise the new game would not be present without a refresh.
  // long term it would be best to have a long get on Active Games, as well as Challenges and Invitations
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
  }, [token, currentGame]);

  // CHALLENGES
  // activeChallenge is included in dependency array so challenges is refreshed
  // anytime a challenge is created or canceled
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch(
        `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/challenges`, 
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();

        setChallenges(result);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchChallenges();
  }, [token, activeChallenge]);


  // LONG GET CURRENT GAME
  // currentGame is set when game row is selected
  // that means currentGame fen is set to whatever fen was when active games fetch occurs
  useEffect(() => {
    if (!token || !currentGame?.id) return;

    const controller = new AbortController();

    (async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/games/${currentGame.id}/update`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
          },
          signal: controller.signal,
        }
      );

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE frames end with a blank line
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";

        for (const frame of frames) {
          // ignore comments like ": ping"
          const dataLines = frame
            .split("\n")
            .filter((l) => l.startsWith("data:"))
            .map((l) => l.slice(5).trim());

          if (!dataLines.length) continue;

          const dataStr = dataLines.join("\n");

          const payload = (() => {
            try {
              return JSON.parse(dataStr);
            } catch {
              return dataStr;
            }
          })();

          // set current game states here
          console.log("UPDATE RESPONSE:", payload)
          setCurrentGame((prev: GameData | null) =>
            prev
              ? {
                  ...prev,
                  fen: payload.fen,
                  move_hist: [...prev.move_hist, payload.move],
                }
              : prev
          );
        }
      }
    })().catch((err) => {
      if ((err as any).name !== "AbortError") {
      console.error("stream error:", err);
    }
  });

    return () => controller.abort();
  }, [token, currentGame?.id]);
  

  // COMPLETED GAMES
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

  // RECIEVED INVITATIONS
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

  // SENT INVITATIONS
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

  const pvpMove = async (move: string) => {
    if (!currentGame) {
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/games/${currentGame.id}/move`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ move }),
        },
      );

      if (!response.ok)
        throw new Error(
          `failed to submit move: ${response.status} ${response.statusText}`,
        );

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
    // dont start AI until book is loaded
    if (!book) return;

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
      book,
      table: shallowpinkTable,
    });
    worker.onmessage = ({ data: { move, error, table } }) => {
      if (error) {
        throw new Error(`An error occurred while generating AI move: ${error}`);
      }

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
      /* setCurrentGame((prev: GameData | null) =>
        prev
          ? {
              ...prev,
              fen: payload.fen,
              move_hist: [...prev.move_hist, payload.move],
            }
          : prev
      ); */
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
    book,
    shallowpinkFenString,
    shallowpinkMoveHist,
    shallowpinkStates,
    shallowpinkTable,
    shallowpinkGameStatus,
    shallowpinkCurrentTeam,
  ]);

  const flipPerspective = (
    mode: string,
    ) => {
    if (mode === "sandbox") {
      setSandboxPerspective(prev => (prev === "white" ? "black" : "white"));
    } else if (mode === "shallowpink") {
       setShallowpinkPerspective(prev => (prev === "white" ? "black" : "white"));
    } else if (mode === "active") {
        setCurrentGamePerspective(prev => (prev === "white" ? "black" : "white"));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        if (!token) {
          redirect("/signup");
        }
        return (
          <div className="flex justify-center pt-2">
            <ProfileInfo />
          </div>
        );
      case "sandbox":
        return (
          <div className="md:flex lg:flex lg:justify-center">
            <Chessboard
              fen={sandboxFenString}
              states={sandboxStates}
              submitMove={submitMoveSandbox}
              pvpMove={null}
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
                  status={sandboxGameStatus}
                />
              </div>
              <div className="">
                <div className="flex mt-4 ml-2 mr-2 md:block md:m-0 md:block lg:m-0 lg:block">
                  <div className="flex-1 mr-1 md:mr-0 md:mb-2 lg:mr-0 lg:mb-2">
                    <FlipPerspectiveButton
                      flipPerspective={flipPerspective}
                      mode={activeTab}
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
              pvpMove={null}
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
                  status={shallowpinkGameStatus}
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
                      flipPerspective={flipPerspective}
                      mode={activeTab}
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
      case "challenges":
        if (!token) {
          redirect("/signup");
        }
        return (
          <div className="w-full max-w-6xl mx-auto px-4">
            <ChallengeBoard 
              challenges={challenges}
              activeChallenge={activeChallenge}
              setActiveChallenge={setActiveChallenge}
              setCurrentGame={setCurrentGame}
              setActiveTab={setActiveTab}
              setGameTab={setGameTab}
            />
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

      case "active":

        return (
          <div className="flex w-full max-w-6xl mx-auto px-4">
            {gameTab === "active games" ? (
              <div className="border-solid">
                <ActiveGames
                  games={activeGames}
                  setCurrentGame={setCurrentGame}
                  setGameTab={setGameTab}
                />
              </div>
            ) : !currentGame ? (
              // gameTab is NOT "active games", but we don't have a game yet
              <div className="p-4">Select a game to view it.</div>
            ) : (
              <div className="md:flex lg:flex lg:justify-center">
                <Chessboard
                  fen={currentGame.fen}
                  states={null}
                  submitMove={null}
                  pvpMove={pvpMove}
                  perspective={currentGamePerspective}
                  gameOver={gameOver}
                  setGameOver={setGameOver}
                  lastOrig={currentGameLastOrig}
                  lastDest={currentGameLastDest}
                  setLastOrig={setCurrentGameLastOrig}
                  setLastDest={setCurrentGameLastDest}
                />
                <div className="">
                  <div className="ml-2 mr-2 md:m-0 lg:m-0">
                    <ChessboardStatus
                      fenStr={currentGame.fen}
                      status={currentGame.status}
                    />
                  </div>
                  <div className="">
                    <div className="flex mt-4 ml-2 mr-2 md:block md:m-0 md:block lg:m-0 lg:block">
                      <div className="flex-1 mr-1 md:mr-0 md:mb-2 lg:mr-0 lg:mb-2">
                        <FlipPerspectiveButton
                          flipPerspective={flipPerspective}
                          mode={activeTab}
                        />
                      </div>
                    </div>
                    <FenView fenstr={currentGame.fen} />
                    <MoveHistory moves={currentGame.move_hist} isShallowpink={false} />
                    <ActiveGamesToggle 
                      setGameTabAction={setGameTab}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 pt-5">
          {renderContent()}
          {/* <Footer /> */}
      </div>
    </div>
  );
}
