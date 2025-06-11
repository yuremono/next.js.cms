import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const authConfig = require("@/config/auth.config.js");

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // 環境変数からパスワードを取得（設定ファイルのデフォルト値使用）
    const correctPassword =
      process.env.CMS_PASSWORD || authConfig.defaultPassword;

    if (password === correctPassword) {
      // セッションCookieを設定（設定ファイルの時間を使用）
      const response = NextResponse.json({ success: true });

      // HTTPOnlyクッキーでセキュアに認証状態を保存
      response.cookies.set("cms-auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: authConfig.sessionDuration, // 設定ファイルから取得
        path: "/",
      });

      return response;
    } else {
      return NextResponse.json(
        { message: "パスワードが正しくありません" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("認証エラー:", error);
    return NextResponse.json(
      { message: "認証処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
