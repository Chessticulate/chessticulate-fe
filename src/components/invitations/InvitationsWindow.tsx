"use client";

import { useEffect, useState } from "react";
import InvitationRow from "@/components/invitations/InvitationRow";

interface InvitationData {
  id: number;
  to_id: number;
  from_id: number;
  white_username: string;
  black_username: string;
  status: string;
}

export default function InvitationsWindow() {
  const [sent, setSent] = useState<InvitationData[] | null>(null);
  const [received, setReceived] = useState<InvitationData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"sent" | "received">("received");

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
  if ((!sent || sent.length === 0) && (!received || received.length === 0))
    return <>No data</>;

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
            onClick={() => setActiveTab("received")}
            className={`inline-block p-4 ${
              activeTab === "received"
                ? "bg-gray-100 active dark:bg-gray-800"
                : "hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Received Invitations
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => setActiveTab("sent")}
            className={`inline-block p-4 ${
              activeTab === "sent"
                ? "bg-gray-100 active dark:bg-gray-800"
                : "hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Sent Invitations
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div>
        {activeTab === "received" ? (
          <div>
            {received && received.length > 0 ? (
              received?.map((invitation, index) => (
                <InvitationRow
                  key={index}
                  type={"received"}
                  invitation_id={invitation.id}
                  to_id={invitation.to_id}
                  from_id={invitation.from_id}
                  white_username={invitation.white_username}
                  black_username={invitation.black_username}
                  status={invitation.status}
                  onAnswer={handleAnswer}
                  onCancel={handleCancel}
                />
              ))
            ) : (
              <div>No received invitations</div>
            )}
          </div>
        ) : (
          <div>
            {sent && sent.length > 0 ? (
              sent?.map((invitation, index) => (
                <InvitationRow
                  key={index}
                  type={"sent"}
                  invitation_id={invitation.id}
                  to_id={invitation.to_id}
                  from_id={invitation.from_id}
                  white_username={invitation.white_username}
                  black_username={invitation.black_username}
                  status={invitation.status}
                  onAnswer={handleAnswer}
                  onCancel={handleCancel}
                />
              ))
            ) : (
              <div>No sent invitations</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
