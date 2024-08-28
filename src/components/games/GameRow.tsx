"use client";

import { useEffect, useState } from "react";

type GameRowProps = {
  white: number;
  black: number;
  white_username: string;
  black_username: string;
  whomst: string;
};

export default function GameRow({
  white,
  black,
  white_username,
  black_username,
  whomst,
}: GameRowProps) {
  return (
    <div className="flex pl-5 pr-5 pt-2 pb-2 border-2">
      <div className="p-1">White: {white_username}</div>
      <div className="p-1">Black: {black_username}</div>
      <div className="p-1">{whomst}&apos;s turn</div>
    </div>
  );
}
