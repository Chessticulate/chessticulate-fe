import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface myJwt {
  exp: number;
  user_name: string;
  user_id: number;
}

// this route handler makes two separate fetches to get invitations
// the purpose is to receive a complete list of invitations relating to the user

export async function GET(request: NextRequest) {
  const token = cookies().get("token")?.value as string;
  const decodedToken = jwtDecode<myJwt>(token);

  try {
    const toInvitations = await fetch(
      `${process.env.CHESSTICULATE_API_URL}/invitations?to_id=${decodedToken.user_id}&status=PENDING`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (toInvitations.status !== 200) {
      return new NextResponse("Network response was not ok", { status: 500 });
    }

    const received = await toInvitations.json();

    const fromInvitations = await fetch(
      `${process.env.CHESSTICULATE_API_URL}/invitations?from_id=${decodedToken.user_id}&status=PENDING`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (fromInvitations.status !== 200) {
      return new NextResponse("Network response was not ok", { status: 500 });
    }

    const sent = await fromInvitations.json();

    const res = new NextResponse(
      JSON.stringify({
        message: "Successfully retrieved invitations info",
        received: received,
        sent: sent,
      }),
      { status: 200 },
    );

    return res;
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
