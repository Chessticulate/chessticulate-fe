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
    <div className="flex justify-around pl-5 pr-5 pt-2 pb-2 border-2 rounded-md border-[#fed6ae] mt-2 mb-4 hover:bg-[#fed6ae] hover:text-[#292929] hover:scale-105 transition">
      <div className="p-1">Challenge from opponent_username</div>
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
    </div>
  );
}
