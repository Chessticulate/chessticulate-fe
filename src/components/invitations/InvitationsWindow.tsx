"use client";

import { useEffect, useState } from "react";
import InvitationRow from "@/components/invitations/InvitationRow";
import { InvitationData } from "@/types";

export default function InvitationsWindow({
  currentGame,
}: InvitationsWindowProps) {
  const [sent, setSent] = useState<InvitationData[] | null>(null);
  const [received, setReceived] = useState<InvitationData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"history" | "invitations">(
    "invitations",
  );

  console.log("current game", currentGame);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/invitations/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();

        console.log("invitations", result);

        setSent(result.sent);
        setReceived(result.received);
      } catch (error) {
        setError("Failed to fetch data");
        console.error("There was a problem with the fetch operation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <>Loading...</>;
  if (error) return <>Error: {error}</>;

  const handleAnswer = (invitationId: number) => {
    setReceived(
      (prevInv) => prevInv?.filter((inv) => inv.id != invitationId) || [],
    );
  };

  const handleCancel = (invitationId: number) => {
    setSent(
      (prevInv) => prevInv?.filter((inv) => inv.id != invitationId) || [],
    );
  };

  return (
    <div>
      {/* Tabs */}
      <ul className="flex flex-wrap text-sm text-center">
        <li className="me-2">
          <button
            onClick={() => setActiveTab("invitations")}
            className={`inline-block p-4 rounded-b-lg ${
              activeTab === "invitations"
                ? "bg-[#1f1f1f]"
                : "hover:bg-[#1f1f1f]"
            }`}
          >
            Invitations
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => setActiveTab("history")}
            className={`inline-block p-4 rounded-b-lg ${
              activeTab === "history" ? "bg-[#1f1f1f]" : "hover:bg-[#1f1f1f]"
            }`}
          >
            Move History
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div>
        {activeTab === "invitations" ? (
          <>
            {received && received.length > 0 ? (
              received?.map((invitation, index) => (
                <InvitationRow
                  key={index}
                  type={"received"}
                  invitation={invitation}
                  onAnswer={handleAnswer}
                  onCancel={handleCancel}
                />
              ))
            ) : (
              <div>No received invitations</div>
            )}
          </>
        ) : (
          <div>
	    <MoveHistory moves={moves}/>
	  </div>
        )}
      </div>
      {/* <Footer /> */}
    </div>
  );
}
