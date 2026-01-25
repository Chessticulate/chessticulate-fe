"use client";

import Challenge from "@/components/ChallengeRow";
import ChallengeButton from "@/components/ChallengeButton";
import { ChallengeData, GameData, GameTab, NavTab, Jwt } from "@/types";
import { getCookie } from "cookies-next";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type Props = {
  challenges: ChallengeData[] | null;
  activeChallenge: ChallengeData | null;
  setActiveChallenge(c: ChallengeData | null): void;
  setCurrentGame: React.Dispatch<React.SetStateAction<GameData | null>>;
  setGameTab(t: GameTab): void;
  setActiveTab(t: NavTab): void;
};

export default function ChallengeBoard({
  challenges,
  activeChallenge,
  setActiveChallenge,
  setCurrentGame,
  setGameTab,
  setActiveTab,
}: Props) {
  const token = getCookie("token") as string;

  useEffect(() => {
    if (!token) {
      return;
    }
    (async () => {
      const decodedToken = jwtDecode<Jwt>(token);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/challenges?requester_id=${decodedToken.user_id}`,
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

        const challenge = result[0] ?? null;
        setActiveChallenge(challenge);
      } catch (error) {
        console.error("there was a problem fetching active games:", error);
      }
    })();
  }, [token, setActiveChallenge]);

  // modify challenges to include MY challenge if it exists
  // this is to ensure that MY challenge is always visible
  // NOTE: this could also be accomplished in the api, subject to change in the future
  const challengeList: ChallengeData[] = (() => {
    const base = challenges ?? [];
    if (!activeChallenge) return base;

    // remove duplicate if active challenge exists in challenges
    const withoutActive = base.filter((c) => c.id !== activeChallenge.id);

    return [activeChallenge, ...withoutActive];
  })();

  const renderContent = () => {
    return (
      <>
        <div
          className="
          fixed
          left-1/2 top-[20%]
          -translate-x-1/2
          flex flex-col items-center gap-3
        "
        >
          {challengeList?.map((challenge, index) => (
            <Challenge
              key={index}
              challenge={challenge}
              setGame={setCurrentGame}
              setActiveTab={setActiveTab}
              setGameTab={setGameTab}
            />
          ))}
        </div>
        <div
          className="
          fixed
          left-1/2
          top-[70%]
          -translate-x-1/2
        "
        >
          <ChallengeButton
            activeChallenge={activeChallenge}
            setActiveChallenge={setActiveChallenge}
          />
        </div>
      </>
    );
  };

  return <div>{renderContent()}</div>;
}
