"use client";

import { useState } from "react";

type Props = {
  fenstr: string;
};

export default function FenView({ fenstr }: Props) {
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const copyFEN = () => {
    navigator.clipboard.writeText(fenstr);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  return (
    <div className="block">
        <div className="flex">
            <div className="overflow-x-auto max-w-full flex border-2 border-[#fed6ae] bg-[#1f1f1f] p-2 mt-2 md:mt-0 lg:mt-0 md:ml-4 lg:ml-4 md:mb-2 lg:mb-2 md:w-[200px] md:w-[200px] lg:w-[300px]">
                <div className="whitespace-nowrap mr-2">
                  <button onClick={copyFEN} className="hover:bg-[#fed6ae] hover:text-[#292929]">FEN:</button>
                </div>
                <p className="whitespace-nowrap">
                  <em>{fenstr}</em>
                </p>
            </div>
        </div>
        <p className={`text-center text-xs pb-2 ${showMessage ? "" : "hidden"}`}>copied FEN to clipboard</p>
    </div>
  );
}