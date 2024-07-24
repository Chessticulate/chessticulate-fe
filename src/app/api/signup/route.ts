import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { username, email, password } = await request.json();
  console.log(username, email, password);
  try {
    const response = await fetch(
      `${process.env.CHESSTICULATE_API_URL}/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          email: email,
          password: password,
        }),
      },
    );

    console.log(response);

    if (response.status !== 201) {
      return new NextResponse("Network response was not ok", { status: 500 });
    }

    const res = new NextResponse(
      JSON.stringify({ message: "Sign up successful" }),
      { status: 200 },
    );

    return res;
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
