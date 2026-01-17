"use client";

import { GameTab } from "@/types";
import type { Dispatch, SetStateAction } from "react";


type Props = {
  setGameTabAction: Dispatch<SetStateAction<GameTab>>
}

export default function ActiveGamesToggle({ setGameTabAction }: Props) {
  return (
    <button
      onClick={() => setGameTabAction(prev => (prev === "play" ? "active games" : "play"))}
      className="hover:bg-[#fed6ae] hover:text-[#292929] flex border-2 border-[#fed6ae] bg-[#1f1f1f] m-2 p-2 md:mt-0 lg:mt-0 md:ml-4 lg:ml-4 w-full md:w-[200px] lg:w-[300px]"
    >
      <p className="text-center w-full whitespace-nowrap">Close</p>
    </button>
  );
}
