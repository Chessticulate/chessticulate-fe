"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import { Tab } from "@/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("play");

  return (
    <div className="flex h-full w-screen">
      <div className="basis-2/12">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="basis-10/12">
        <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
