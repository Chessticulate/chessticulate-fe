import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface myJwt {
  exp: number;
  user_name: string;
  user_id: number;
}

export async function POST(request: NextRequest) {
  const gameRequest = await request.json();
  const game_id = gameRequest["id"];
  const move = gameRequest["move"];
  const token = cookies().get("token")?.value as string;
  const decodedToken = jwtDecode<myJwt>(token);

  try {
    const response = await fetch(
      `${process.env.CHESSTICULATE_API_URL}/games/${game_id}/move`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          move: move,
        }),
      },
    );

    if (response.status !== 200) {
      return new NextResponse("Network response was not ok", { status: 500 });
    }

    const data = await response.json();

    const res = new NextResponse(
      JSON.stringify({
        message: "Successful move",
        data: data,
      }),
      { status: 200 },
    );

    return res;
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
