"use client";

import { NavTab } from "@/types";
import ProfileInfo from "@/components/ProfileInfo";

type Props = {
  activeTab: NavTab;
  setActiveTab: (t: NavTab) => void;
};

type NavItem = {
  tab: NavTab;
  title: string;
};

const tabs: NavItem[] = [
  {
    tab: "profile",
    title: "Profile"
  },
  {
    tab: "sandbox",
    title: "Sandbox"
  },
  {
    tab: "shallowpink",
    title: "ShallowPink"
  },
  {
    tab: "arena",
    title: "Arena"
  },
  {
    tab: "active",
    title: "Active Games"
  },
  {
    tab: "completed",
    title: "Completed Games"
  },
  {
    tab: "invitations",
    title: "invitations"
  },
];

export function MobileNav({ activeTab, setActiveTab }: Props) {
  const renderNavItem = ({tab, title}: NavItem) => {
    return (
      <li>
        <button onClick={() => setActiveTab(tab)} className={`inline-block p-4 rounded-r-lg ${activeTab === tab ? "bg-[#1f1f1f]" : "hover:bg-[#1f1f1f]"}`}>
          {title}
        </button>
      </li>
    );
  };
  return (
    <div>
      <ul className="text-sm text-left">
        {tabs.map((navItem: NavItem) => renderNavItem(navItem))}
      </ul>
    </div>
  );
};

export function DesktopNav({ activeTab, setActiveTab }: Props) {
  const renderNavItem = ({tab, title}: NavItem) => {
    return (
      <li>
        <button onClick={() => setActiveTab(tab)} className={`w-full hover:bg-[#fed6ae] hover:text-[#292929] text-left inline-block p-6 ${activeTab === tab ? "bg-[#111111]" : ""}`}>
          {title}
        </button>
      </li>
    );
  };
  return (
    <ul className="text-2xl font-bold">
      {tabs.map((navItem: NavItem) => renderNavItem(navItem))}
    </ul>
  );
}
