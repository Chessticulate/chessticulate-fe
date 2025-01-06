"use client"

import { useState } from "react";
import ProfileInfo from "@/components/ProfileInfo";

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "play">(
    "play",
  );

  return (
    <div>
      {/* Tabs */}
      <ul className="flex flex-col text-sm text-left">
	<li className="me-2">
	  <ProfileInfo /> 
	</li>
        <li className="me-2">
          <button
            onClick={() => {
              setActiveTab("play");
            }}
            className={`inline-block p-4 rounded-b-lg ${
              activeTab === "play" ? "bg-[#1f1f1f]" : "hover:bg-[#1f1f1f]"
            }`}
          >
            Play
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => setActiveTab("active")}
            className={`inline-block p-4 rounded-b-lg ${
              activeTab === "active" ? "bg-[#1f1f1f]" : "hover:bg-[#1f1f1f]"
            }`}
          >
            Active Games
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => setActiveTab("completed")}
            className={`inline-block p-4 rounded-b-lg ${
              activeTab === "completed" ? "bg-[#1f1f1f]" : "hover:bg-[#1f1f1f]"
            }`}
          >
            Completed Games
          </button>
        </li>
      </ul>

    </div>
  );
}
