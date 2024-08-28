"use client";

import { useEffect, useState } from "react";
import InvitationRow from "@/components/invitations/InvitationRow";

interface InvitationData {
  to_id: number;
  from_id: number;
  white_username: string;
  black_username: string;
  status: string;
}

export default function InvitationsWindow() {
  const [invitations, setInvitations] = useState<InvitationData[] | null>(null); // Correctly typed
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        setInvitations(result.invitations);
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
  if (!invitations || invitations.length === 0) return <>No data</>;

  return (
    <div>
      <h1 className=""> Invitations: </h1>
      {invitations.map((invitation, index) => (
        <InvitationRow
          key={index}
          to_id={invitation.to_id}
          from_id={invitation.from_id}
          white_username={invitation.white_username}
          black_username={invitation.black_username}
          status={invitation.status}
        />
      ))}
    </div>
  );
}
