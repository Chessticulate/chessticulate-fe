"use client";

import { ChangeEvent } from "react";
import { LoginSignupError } from "@/types";

type ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;

interface Props {
  inputHint: string;
  inputValue: string;
  handleValueChange: ChangeHandler;
  errors: LoginSignupError[];
}

export default function LoginSignupInput({
  inputHint,
  inputValue,
  handleValueChange,
  errors,
}: Props) {
  const listItems = errors.map((err) => (
    <li className="flex items-center" key={err.message}>
      <span
        className={`mr-2 flex items-center justify-center h-5 w-5 rounded-full bg-slate-600 ${err.show ? "text-red-500" : "text-green-500"}`}
      >
        {err.show ? "✗" : "✓"}
      </span>
      {err.message}
    </li>
  ));

  return (
    <div className="pb-5">
      <input
        type={inputHint === "password" ? "password" : "text"}
        placeholder={inputHint}
        value={inputValue}
        onChange={handleValueChange}
        className="w-full placeholder:text-slate-600 text-black rounded-md h-8 pl-2"
      />
      <div className={`${errors.some((e) => e.show) ? "block" : "hidden"}`}>
        <ul className="mt-2 text-sm text-slate-400 space-y-1">{listItems}</ul>
      </div>
    </div>
  );
}
