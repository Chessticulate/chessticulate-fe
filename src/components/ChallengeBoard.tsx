"use client";

import Challenge from "@/components/ChallengeRow";
import ChallengeButton from "@/components/ChallengeButton";
import { ChallengeData, GameData, GameTab, NavTab, Jwt } from "@/types";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type Props = {
  challenges: ChallengeData[] | null;
  activeChallenge: ChallengeData | null;
  challengeSkip: number;
  setActiveChallenge(c: ChallengeData | null): void;
  setCurrentGame: React.Dispatch<React.SetStateAction<GameData | null>>;
  setGameTab(t: GameTab): void;
  setActiveTab(t: NavTab): void;
  setChallengeSkip: React.Dispatch<React.SetStateAction<number>>;
};

const PAGE_SIZE = 5;

export default function ChallengeBoard({
  challenges,
  activeChallenge,
  challengeSkip,
  setActiveChallenge,
  setCurrentGame,
  setGameTab,
  setActiveTab,
  setChallengeSkip,
}: Props) {
  const token = getCookie("token") as string;

  const challengeList: ChallengeData[] = (() => {
    const base = challenges ?? [];
    if (!activeChallenge) return base.slice(0, PAGE_SIZE);

    // remove duplicate if active challenge exists in challenges
    const withoutActive = base.filter((c) => c.id !== activeChallenge.id);

    return [activeChallenge, ...withoutActive].slice(0, PAGE_SIZE);
  })();

  const prevPage = () => setChallengeSkip((p) => Math.max(0, p - 5));
  const nextPage = () => setChallengeSkip((p) => p + 5);

  const canNext = (challenges?.length ?? 0) === PAGE_SIZE;

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

  const renderContent = () => {
    return (
      <>
        <div
          className="
          fixed
          left-1/2
          top-[15%]
          -translate-x-1/2
          flex flex-col items-center gap-3 sm:gap-2
          whitespace-nowrap
        "
        >
          {challenges && challenges.length > 0 ? (
            challengeList.map((challenge) => (
              <Challenge
                key={challenge.id}
                challenge={challenge}
                setGame={setCurrentGame}
                setActiveTab={setActiveTab}
                setGameTab={setGameTab}
              />
            ))
          ) : (
            <div>No Active Challenges</div>
          )}
        </div>
        <div
          className="
          fixed
          left-1/2
          top-[80%] md:top-[65%]
          -translate-x-1/2
        "
        >
          <div className="flex mt-2 items-center justify-center gap-3 pb-5">
            <button
              onClick={prevPage}
              disabled={challengeSkip === 0}
              className="px-3 py-1 font-bold text-2xl disabled:opacity-50"
            >
              &lt;
            </button>
            <button
              onClick={nextPage}
              disabled={!canNext}
              className="px-3 py-1 font-bold text-2xl disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
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
