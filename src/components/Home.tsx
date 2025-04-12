"use client";

import { DesktopNav} from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import { NavTab } from "@/types";

type Props = {
  activeTab: NavTab;
  setActiveTab(t: NavTab): void;
};

export default function Home({ activeTab, setActiveTab }: Props) {
  return (
    <div className="flex h-full w-screen">
      <div className="basis-2/12 hidden lg:block">
        <DesktopNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="basis-10/12">
        <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
