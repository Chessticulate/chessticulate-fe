"use client";

import { useEffect, useState } from "react";
import { InvitationData, InvitationProps } from "@/types";

export default function InvitationRow({
  type,
  invitation,
  onAnswer,
  onCancel,
}: InvitationProps) {
  const { id, white_username, black_username } = invitation;

  const answerInvite = async (answer: string) => {
    try {
      const response = await fetch(`/api/invitations/${answer}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      answer === "cancel" ? onCancel(id) : onAnswer(id);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <div className="flex pl-5 pr-5 pt-2 pb-2 border-2 rounded-md border-[#fed6ae] m-2">
      <div className="p-1">white: {white_username}</div>
      <div className="p-1">black: {black_username}</div>
      {type === "received" ? (
        <>
          <button
            className="pl-2"
            onClick={() => {
              answerInvite("accept");
            }}
          >
            {" "}
            accept{" "}
          </button>
          <button
            className="pl-2"
            onClick={() => {
              answerInvite("decline");
            }}
          >
            {" "}
            decline{" "}
          </button>
        </>
      ) : (
        <>
          <button
            className="pl-2"
            onClick={() => {
              answerInvite("cancel");
            }}
          >
            {" "}
            cancel{" "}
          </button>
        </>
      )}
    </div>
  );
}
