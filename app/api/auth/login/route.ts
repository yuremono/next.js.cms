import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@/types";
import authConfig from "@/config/auth.config.js";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // 権限レベル別のパスワード認証
    let userRole: UserRole | null = null;

    // 編集権限のパスワードチェック
    const editPassword = process.env.CMS_PASSWORD_EDIT;
    if (editPassword && password === editPassword) {
      userRole = "edit";
    }
    // 閲覧権限のパスワードチェック
    else if (
      process.env.CMS_PASSWORD_VIEW &&
      password === process.env.CMS_PASSWORD_VIEW
    ) {
      userRole = "view";
    }
    // 注意: セキュリティ向上のため従来パスワード認証は廃止しました
    // 権限レベル別の環境変数（CMS_PASSWORD_EDIT, CMS_PASSWORD_VIEW）を使用してください

    if (userRole) {
      // セッションCookieを設定
      const response = NextResponse.json({
        success: true,
        role: userRole,
        message:
          userRole === "edit"
            ? "編集権限でログインしました"
            : "閲覧権限でログインしました",
      });

      // 認証状態のクッキー
      response.cookies.set("cms-auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: authConfig.sessionDuration,
        path: "/",
      });

      // 権限レベルのクッキー
      response.cookies.set("cms-role", userRole, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: authConfig.sessionDuration,
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
