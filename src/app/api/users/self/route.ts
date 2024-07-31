import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(
      `${process.env.CHESSTICULATE_API_URL}/users/self`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status !== 201) {
      return new NextResponse("Network response was not ok", { status: 500 });
    }

    const res = new NextResponse(
      JSON.stringify({ message: "Successfully retrieved user info" }),
      { status: 200 },
    );

    return res;
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
