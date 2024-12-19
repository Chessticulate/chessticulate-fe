"use client";

import GamesWindow from "@/components/games/GamesWindow";
import InvitationsWindow from "@/components/invitations/InvitationsWindow";
import { GameData } from "@/types";
import { useState } from "react";

export default function Dashboard() {
  const [currentGame, setCurrentGame] = useState<GameData | null>(null);
  return (
    <main className="flex h-full">
      <div className="basis-3/6 pl-5 pr-5">
        <GamesWindow
          currentGame={currentGame}
          setCurrentGame={setCurrentGame}
        />
      </div>
      <div className="basis-2/6 pl-5 pr-5">
        <InvitationsWindow currentGame={currentGame} />
      </div>
    </main>
  );
}
