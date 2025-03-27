"use client";

import { NavTab } from "@/types"
import ProfileInfo from "@/components/ProfileInfo";
import { useState } from "react";

type Props = {
  activeTab: NavTab;
  setActiveTab: (b: NavTab) => void;
};

export default function MobileSidebar({ activeTab, setActiveTab }: Props) {
  const [clicked, setClicked] = useState<boolean>(false);

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
              setActiveTab("sandbox");
            }}
            className={`inline-block p-4 rounded-r-lg ${
              activeTab === "sandbox" ? "bg-[#1f1f1f]" : "hover:bg-[#1f1f1f]"
            }`}
          >
            Sandbox
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => {
              setActiveTab("shallowpink");
            }}
            className={`inline-block p-4 rounded-r-lg ${
              activeTab === "shallowpink"
                ? "bg-[#1f1f1f]"
                : "hover:bg-[#1f1f1f]"
            }`}
          >
            Shallow-Pink
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => {
              setActiveTab("arena");
            }}
            className={`inline-block p-4 rounded-r-lg ${
              activeTab === "arena" ? "bg-[#1f1f1f]" : "hover:bg-[#1f1f1f]"
            }`}
          >
            Arena
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => {
              setActiveTab("active");
            }}
            className={`inline-block p-4 rounded-r-lg ${
              activeTab === "active" ? "bg-[#1f1f1f]" : "hover:bg-[#1f1f1f]"
            }`}
          >
            Active Games
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => setActiveTab("completed")}
            className={`inline-block p-4 rounded-r-lg ${
              activeTab === "completed" ? "bg-[#1f1f1f]" : "hover:bg-[#1f1f1f]"
            }`}
          >
            Completed Games
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => setActiveTab("invitations")}
            className={`inline-block p-4 rounded-r-lg ${
              activeTab === "invitations"
                ? "bg-[#1f1f1f]"
                : "hover:bg-[#1f1f1f]"
            }`}
          >
            Invitations
          </button>
        </li>
      </ul>
    </div>
  );
}
