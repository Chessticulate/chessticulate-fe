"use client";

import { useEffect, useState } from "react";

type InvitationProps = {
  to_id: number;
  from_id: number;
  white_username: string;
  black_username: string;
  status: string;
};

export default function InvitationRow({
  to_id,
  from_id,
  white_username,
  black_username,
  status,
}: InvitationProps) {
  return (
    <div className="flex pl-5 pr-5 pt-2 pb-2 border-2">
      <div className="p-1">white: {white_username}</div>
      <div className="p-1">black: {black_username}</div>
      <div className="p-1">status: {status}</div>
      <button className="p-2"> accept </button>
      <button className="p-2"> decline </button>
    </div>
  );
}
