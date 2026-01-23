"use client";

import { NavTab } from "@/types";

type NavItem = {
  tab: NavTab;
  title: string;
};

const tabs: NavItem[] = [
  {
    tab: "profile",
    title: "Profile",
  },
  {
    tab: "sandbox",
    title: "Sandbox",
  },
  {
    tab: "shallowpink",
    title: "ShallowPink AI",
  },
  {
    tab: "challenges",
    title: "Challenges",
  },
  {
    tab: "active",
    title: "Active Games",
  },
  {
    tab: "completed",
    title: "Completed Games",
  },
  {
    tab: "invitations",
    title: "Invitations",
  },
];

export function getNavTabTitle(tabname: string): string {
  for (const tab of tabs) {
    if (tab.tab == tabname) {
      return tab.title;
    }
  }
  return "UNKNOWN";
}

type MobileNavProps = {
  activeTab: NavTab;
  setActiveTab(t: NavTab): void;
  setVisible(b: boolean): void;
};

export function MobileNav({
  activeTab,
  setActiveTab,
  setVisible,
}: MobileNavProps) {
  const renderNavItem = ({ tab, title }: NavItem) => {
    return (
      <li key={title}>
        <button
          onClick={() => {
            setActiveTab(tab);
            setVisible(false);
          }}
          className={`w-full text-left inline-block p-4 hover:bg-outline hover:text-background ${activeTab === tab ? "bg-foreground" : ""}`}
        >
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
}

type DesktopNavProps = {
  activeTab: NavTab;
  setActiveTab(t: NavTab): void;
};

export function DesktopNav({ activeTab, setActiveTab }: DesktopNavProps) {
  const renderNavItem = ({ tab, title }: NavItem) => {
    return (
      <li key={title}>
        <button
          onClick={() => setActiveTab(tab)}
          className={`w-full hover:bg-outline hover:text-background text-left inline-block p-6 ${activeTab === tab ? "bg-foreground" : ""}`}
        >
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
