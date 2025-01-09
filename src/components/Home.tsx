"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import { Tab } from "@/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("play");

  return (
    <main className="flex h-full">
      <div className="basis-1/7 pr-5">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="basis-6/7 pl-5 r-5">
        <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </main>
  );
}
