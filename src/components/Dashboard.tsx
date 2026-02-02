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
  InitShallowpinkState,
  SubmitMove,
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
import Forfeit from "@/components/Forfeit";

// Chess obj has a type of any since shallowpink does not export any types
const SHALLOWPINK = require("shallowpink");

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
  const [gameOver, setGameOver] = useState<boolean>(false);

  // game mode states
  const [currentGame, setCurrentGame] = useState<GameData | null>(null);
  const [sandbox, setSandbox] = useState<ShallowpinkData>(
    InitShallowpinkState(),
  );
  const [shallowpink, setShallowpink] = useState<ShallowpinkData>(
    InitShallowpinkState(),
  );

  // highlight squares
  // h squares could not be consolidated into the game mode objects without expanding on the api
  // they are left separate for now, but could be integrated later
  const [shallowpinkLastOrig, setShallowpinkLastOrig] = useState<number[]>([]);
  const [shallowpinkLastDest, setShallowpinkLastDest] = useState<number[]>([]);
  const [currentGameLastOrig, setCurrentGameLastOrig] = useState<number[]>([]);
  const [currentGameLastDest, setCurrentGameLastDest] = useState<number[]>([]);
  const [sandboxLastOrig, setSandboxLastOrig] = useState<number[]>([]);
  const [sandboxLastDest, setSandboxLastDest] = useState<number[]>([]);

  // Tabs
  const [activeGames, setActiveGames] = useState<GameData[] | null>(null);
  const [completedGames, setCompletedGames] = useState<GameData[] | null>(null);
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [recvdInvitations, setRecvdInvitations] = useState<InvitationData[]>(
    [],
  );
  const [sentInvitations, setSentInvitations] = useState<InvitationData[]>([]);
  const [gameTab, setGameTab] = useState<GameTab>("active games");
  const [activeChallenge, setActiveChallenge] = useState<ChallengeData | null>(
    null,
  );

  // pagination
  const [challengeSkip, setChallengeSkip] = useState(0);
  const [gameSkip, setGameSkip] = useState(0);

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
          `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/games?player_id=${decodedToken.user_id}&is_active=True&limit=5&skip=${gameSkip}`,
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
  }, [token, currentGame, gameSkip]);

  // CHALLENGES
  // activeChallenge is included in dependency array so challenges is refreshed
  // anytime a challenge is created or canceled
  useEffect(() => {
    if (!token) {
      return;
    }
    const fetchChallenges = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/challenges?skip=${challengeSkip}&limit=5`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

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
  }, [token, activeChallenge, challengeSkip]);

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
        },
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

          console.log("UPDATE RESPONSE:", payload);

          let suffix = "";
          if (payload.status === "check") {
            suffix = "+";
          } else if (payload.status === "checkmate") {
            suffix = "#";
          }

          setCurrentGame((prev: GameData | null) =>
            prev
              ? {
                  ...prev,
                  fen: payload.fen,
                  move_hist: [...prev.move_hist, `${payload.move}${suffix}`],
                }
              : prev,
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

  const pvpMove: SubmitMove = async ({ move }) => {
    if (!currentGame) {
      return;
    }
    // remove suffix
    move = move.replace(/[+#]/g, "");
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

  const submitMoveSandbox: SubmitMove = async ({
    move,
    fen,
    states,
    status,
  }) => {
    setSandbox((prev) =>
      prev
        ? {
            ...prev,
            fen: fen,
            states: states,
            status: status,
            move_hist: [...prev.move_hist, move],
          }
        : prev,
    );
  };

  const submitMoveShallowpink: SubmitMove = async ({
    move,
    fen,
    states,
    status,
  }) => {
    setShallowpink((prev) =>
      prev
        ? {
            ...prev,
            fen: fen,
            states: states,
            status: status,
            move_hist: [...prev.move_hist, move],
          }
        : prev,
    );
  };

  useEffect(() => {
    // dont start AI until book is loaded
    if (!book) return;

    const whomst =
      shallowpink.fen.split(" ")[1] === "w"
        ? SHALLOWPINK.Color.WHITE
        : SHALLOWPINK.Color.BLACK;
    if (whomst === shallowpink.currentTeam) {
      return;
    }

    const worker = new Worker(
      new URL("../../workers/shallowpink-worker.js", import.meta.url),
    );

    worker.postMessage({
      fenStr: shallowpink.fen,
      states: shallowpink.states,
      book,
      table: shallowpink.table,
    });
    worker.onmessage = ({ data: { move, error, table } }) => {
      if (error) {
        throw new Error(`An error occurred while generating AI move: ${error}`);
      }

      const chessObj = new SHALLOWPINK(
        shallowpink.fen,
        shallowpink.states,
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
      setShallowpink((prev) =>
        prev
          ? {
              ...prev,
              fen: chessObj.toFEN(),
              table: new Map(chessObj.table),
              status: result,
              states: new Map(prev.states),
              move_hist: [...prev.move_hist, move],
              lastOrig: chessObj.lastOrig,
              lastDest: chessObj.lastDest,
            }
          : prev,
      );

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
  }, [book, shallowpink]);

  // THIS NEEDS FIXING
  const flipPerspective = (mode: string) => {
    if (mode === "sandbox") {
      setSandbox((prev) =>
        prev
          ? {
              ...prev,
              perspective: prev.perspective === "white" ? "black" : "white",
            }
          : prev,
      );
    } else if (mode === "shallowpink") {
      setShallowpink((prev) =>
        prev
          ? {
              ...prev,
              perspective: prev.perspective === "white" ? "black" : "white",
            }
          : prev,
      );
    } else if (mode === "active") {
      setCurrentGame((prev) =>
        prev
          ? {
              ...prev,
              perspective: prev.perspective === "white" ? "black" : "white",
            }
          : prev,
      );
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
              game={sandbox}
              submitMove={submitMoveSandbox}
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
                  fenStr={sandbox.fen}
                  status={sandbox.status}
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
                      setGame={setSandbox}
                      setGameOver={setGameOver}
                      setLastOrig={setSandboxLastOrig}
                      setLastDest={setSandboxLastDest}
                    />
                  </div>
                </div>
                <FenView fenstr={sandbox.fen} />
                <FenInput setFen={setSandbox} />
                <MoveHistory moves={sandbox.move_hist} isShallowpink={false} />
              </div>
            </div>
          </div>
        );
      case "shallowpink":
        return (
          <div className="md:flex lg:justify-center">
            <Chessboard
              game={shallowpink}
              submitMove={submitMoveShallowpink}
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
                  fenStr={shallowpink.fen}
                  status={shallowpink.status}
                />
              </div>
              <TeamSwitch
                currentTeam={shallowpink.currentTeam}
                setShallowpink={setShallowpink}
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
                      setGame={setShallowpink}
                      setGameOver={setGameOver}
                      setLastOrig={setShallowpinkLastOrig}
                      setLastDest={setShallowpinkLastDest}
                    />
                  </div>
                </div>
                <FenView fenstr={shallowpink.fen} />
                <FenInput setFen={setShallowpink} />
                <MoveHistory
                  moves={shallowpink.move_hist}
                  isShallowpink={true}
                />
              </div>
            </div>
          </div>
        );
      case "challenges":
        if (!token) {
          redirect("/signup");
        }
        return (
          <div className="flex-1 items-center justify-center">
            <ChallengeBoard
              challenges={challenges}
              activeChallenge={activeChallenge}
              challengeSkip={challengeSkip}
              setActiveChallenge={setActiveChallenge}
              setCurrentGame={setCurrentGame}
              setActiveTab={setActiveTab}
              setGameTab={setGameTab}
              setChallengeSkip={setChallengeSkip}
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
          <div className="flex-1 items-center justify-center">
            {gameTab === "active games" ? (
              <ActiveGames
                games={activeGames}
                gameSkip={gameSkip}
                setCurrentGame={setCurrentGame}
                setGameTab={setGameTab}
                setGameSkip={setGameSkip}
              />
            ) : !currentGame ? (
              <div className="p-4">Select a game to view it.</div>
            ) : (
              <div className="md:flex lg:justify-center">
                <Chessboard
                  game={currentGame}
                  submitMove={pvpMove}
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
                      <div className="flex-1 ml-1 md:m-0 md:mb-2 lg:m-0 lg:mb-2">
                        <ActiveGamesToggle
                          setGameTabAction={setGameTab}
                          setCurrentGame={setCurrentGame}
                        />
                      </div>
                    </div>
                    <FenView fenstr={currentGame.fen} />
                    <MoveHistory
                      moves={currentGame.move_hist}
                      isShallowpink={false}
                    />
                    <div className="ml-2 mr-2 md:m-0 lg:m-0">
                      <Forfeit
                        token={token}
                        gameId={currentGame.id}
                        setCurrentGame={setCurrentGame}
                        setGameTabAction={setGameTab}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };
  return <div className="flex-1">{renderContent()}</div>;
}
