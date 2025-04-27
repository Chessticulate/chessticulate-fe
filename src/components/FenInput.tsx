"use client";

import { useState, useRef } from "react";

const Shallowpink = require("shallowpink");

type Props = {
    setFenString: (s: string) => void;
};

export default function FenInput({ setFenString }: Props) {
  const [showError, setShowError] = useState<boolean>(false);
  const userSandboxInputRef = useRef<HTMLInputElement>(null);

  const userSetSandboxFen = () => {
    try {
      const customFen = userSandboxInputRef.current!.value;
      if (customFen === "") return;
      new Shallowpink(customFen);
      setFenString(customFen);
    } catch (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  return (
    <div className="block">
        <div className="flex">
            <div className="overflow-x-auto flex border-2 border-[#fed6ae] bg-[#1f1f1f] p-2 mt-2 md:mt-0 lg:mt-0 md:ml-4 lg:ml-4 md:mb-2 lg:mb-2 w-full md:w-[200px] lg:w-[300px]">
                <div className="whitespace-nowrap mr-2">
                    <button onClick={() => userSetSandboxFen()} className="hover:bg-[#fed6ae] hover:text-[#292929]">Set FEN:</button>
                </div>
                <input ref={userSandboxInputRef} type="text" placeholder="custom FEN string..." className="overflow-x-auto whitespace-nowrap bg-[#1f1f1f] md:w-[100px] lg:w-[180px]"/>
            </div>
        </div>
        <p className={`text-center text-xs pb-2 ${showError ? "" : "hidden"}`}>invalid FEN string</p>
    </div>
  );
};