import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const token = cookies().get("token")?.value;

  try {
    const response = await fetch(
      `${process.env.CHESSTICULATE_API_URL}/users/self`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status !== 200) {
      return new NextResponse("Network response was not ok", { status: 500 });
    }

    const data = await response.json();

    const res = new NextResponse(
      JSON.stringify({
        message: "Successfully retrieved user info",
        userData: data,
      }),
      { status: 200 },
    );

    return res;
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
