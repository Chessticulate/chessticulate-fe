import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  try {
    const response = await fetch(`${process.env.CHESSTICULATE_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username,
        password: password,
      }),
    });

    if (response.status !== 200) {
      return new NextResponse("Network response was not ok", { status: 500 });
    }

    const data = await response.json();
    const res = new NextResponse(
      JSON.stringify({ message: "Login successful" }),
      { status: 200 },
    );

    cookies().set({
      name: "token",
      value: data.jwt,
      maxAge: 7 * 24 * 60 * 60, // 1 week
      path: "/",
      httpOnly: true,
    });

    return res;
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
