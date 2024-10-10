import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface myJwt {
  exp: number;
  user_name: string;
  user_id: number;
}

export async function PUT(request: NextRequest) {
  const invRequest = await request.json();
  const invitation_id = invRequest["invitation_id"];
  const token = cookies().get("token")?.value as string;
  const decodedToken = jwtDecode<myJwt>(token);

  try {
    const response = await fetch(
      `${process.env.CHESSTICULATE_API_URL}/invitations/${invitation_id}/cancel`,
      {
        method: "PUT",
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
        message: "Successfully canceled game invitation",
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
