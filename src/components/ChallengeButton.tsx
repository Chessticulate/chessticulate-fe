"use client";

import { getCookie } from "cookies-next";
import { ChallengeData } from "@/types";

type Props = {
  activeChallenge: ChallengeData | null;
  setActiveChallenge(c: ChallengeData | null): void;
}

export default function ChallengeButton({ activeChallenge, setActiveChallenge  }: Props) {
  const token = getCookie("token") as string;

  const createChallenge = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/challenges`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const res = await response.json();
      console.log("Create challenge response", res);

      setActiveChallenge(res);

    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const cancelChallenge = async () => {
    if (!activeChallenge) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CHESSTICULATE_API_URL}/challenges/${activeChallenge.id}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Challenge cancelled");
      setActiveChallenge(null);
      // later: refetch challenges / clear activeChallenge in parent
    } catch (error) {
      console.error("There was a problem cancelling the challenge:", error);
    }
  };

  return (
    <button
      onClick={activeChallenge ? cancelChallenge : createChallenge}
      className="hover:bg-outline hover:text-background flex border-2 border-outline bg-foreground p-2 md:mt-0 lg:mt-0 md:ml-4 lg:ml-4 w-full md:w-[200px] lg:w-[300px]"
    >
    <p className="text-center w-full whitespace-nowrap">
      {activeChallenge ? "Cancel Challenge" : "Create Challenge"}
    </p>
  </button>
  );
}
