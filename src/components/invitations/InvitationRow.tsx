"use client";

import { useEffect, useState } from "react";

type InvitationProps = {
  invitation_id: number;
  to_id: number;
  from_id: number;
  white_username: string;
  black_username: string;
  status: string;
};

export default function InvitationRow({
  invitation_id,
  to_id,
  from_id,
  white_username,
  black_username,
  status,
}: InvitationProps) {
  const answerInvite = async (answer: string) => {
    try {
      const response = await fetch(`/api/invitations/${answer}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invitation_id }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      console.log(result);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <div className="flex pl-5 pr-5 pt-2 pb-2 border-2">
      <div className="p-1">white: {white_username}</div>
      <div className="p-1">black: {black_username}</div>
      <div className="p-1">status: {status}</div>
      <button
        className="p-2"
        onClick={() => {
          answerInvite("accept");
        }}
      >
        {" "}
        accept{" "}
      </button>
      <button
        className="p-2"
        onClick={() => {
          answerInvite("decline");
        }}
      >
        {" "}
        decline{" "}
      </button>
    </div>
  );
}