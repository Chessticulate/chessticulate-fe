import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface myJwt {
  exp: number;
  user_name: string;
  user_id: number;
}

export async function GET(request: NextRequest) {
  const token = cookies().get("token")?.value as string;
  const decodedToken = jwtDecode<myJwt>(token);

  try {
    const activeGames = await fetch(
      `${process.env.CHESSTICULATE_API_URL}/games?player_id=${decodedToken.user_id}&is_active=True`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (activeGames.status !== 200) {
      return new NextResponse("Network response was not ok", { status: 500 });
    }

    const active = await activeGames.json();

    const completedGames = await fetch(
      `${process.env.CHESSTICULATE_API_URL}/games?player_id=${decodedToken.user_id}&is_active=False`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (completedGames.status !== 200) {
      return new NextResponse("Network response was not ok", { status: 500 });
    }

    const completed = await completedGames.json();

    const res = new NextResponse(
      JSON.stringify({
        message: "Successfully retrieved game info",
        active: active,
        completed: completed,
      }),
      { status: 200 },
    );

    return res;
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
