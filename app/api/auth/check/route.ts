import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const authCookie = (await cookieStore).get("cms-auth");

    const authenticated = authCookie?.value === "authenticated";

    return NextResponse.json({ authenticated });
  } catch (error) {
    console.error("認証チェックエラー:", error);
    return NextResponse.json({ authenticated: false });
  }
}
