"use client";
import Home from "@/components/Home";
import { useState } from "react";
import { BannerWithMenu } from "@/components/Banner";
import { NavTab } from "@/types";

export default function Page() {
  const [activeTab, setActiveTab] = useState<NavTab>("sandbox");

  return (
    <>
      <BannerWithMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex justify-center overflow-hidden">
        <Home activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </>
  );
}
