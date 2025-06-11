import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true });

    // 認証Cookieを削除
    response.cookies.delete("cms-auth");

    return response;
  } catch (error) {
    console.error("ログアウトエラー:", error);
    return NextResponse.json(
      { message: "ログアウト処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
