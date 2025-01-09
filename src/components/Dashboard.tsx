"use client";

import GamesWindow from "@/components/games/GamesWindow";
import InvitationsWindow from "@/components/invitations/InvitationsWindow";
import { GameData, TabProps } from "@/types";
import { useState } from "react";

export default function Dashboard({ activeTab, setActiveTab }: TabProps) {
  const [currentGame, setCurrentGame] = useState<GameData | null>(null);

  return (
    <div className="flex h-full">
      <div className="flex-grow basis-3/4 pt-5">
        <GamesWindow
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentGame={currentGame}
          setCurrentGame={setCurrentGame}
        />
      </div>
      <div className="basis-1/4 pl-5 pr-5">
        <InvitationsWindow currentGame={currentGame} />
      </div>
    </div>
  );
}
