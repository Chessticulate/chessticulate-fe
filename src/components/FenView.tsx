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
    <div className="block w-screen md:size-auto lg:size-auto">
      <div className="max-w-full flex border-2 border-outline bg-foreground p-2 mt-4 ml-2 mr-2 md:mt-0 md:ml-4 md:mb-2 lg:mt-0 lg:ml-4 lg:mb-2 md:w-[200px] lg:w-[300px]">
        <div className="mr-2">
          <button
            onClick={copyFEN}
            className="hover:bg-outline hover:text-background"
          >
            FEN:
          </button>
        </div>
        <p className="overflow-x-auto whitespace-nowrap">
          <em>{fenstr}</em>
        </p>
      </div>
      <p className={`text-center text-xs pb-2 ${showMessage ? "" : "hidden"}`}>
        copied FEN to clipboard
      </p>
    </div>
  );
}
