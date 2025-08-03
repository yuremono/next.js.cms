import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { UserRole } from "@/types";

export async function GET(request: NextRequest) {
  console.log("🔐 認証チェックAPI呼び出し");

  try {
    // 開発時の認証スキップチェック
    if (process.env.SKIP_AUTH === "true") {
      console.log("🔓 サーバー側認証をスキップ (開発モード)");
      return NextResponse.json({
        authenticated: true,
        role: "edit" as UserRole,
      });
    }

    const cookieStore = cookies();
    const authCookie = (await cookieStore).get("cms-auth");
    const roleCookie = (await cookieStore).get("cms-role");

    console.log("🍪 認証クッキー:", authCookie ? "存在" : "なし");
    console.log("🍪 権限クッキー:", roleCookie?.value || "なし");

    const authenticated = authCookie?.value === "authenticated";
    const role =
      roleCookie?.value === "view" || roleCookie?.value === "edit"
        ? (roleCookie.value as UserRole)
        : null;

    console.log("✅ 認証結果:", authenticated, "権限:", role);

    return NextResponse.json({
      authenticated,
      role: authenticated ? role : null,
    });
  } catch (error) {
    console.error("❌ 認証チェックAPIエラー:", error);
    return NextResponse.json(
      {
        authenticated: false,
        role: null,
        error: "認証チェック中にエラーが発生しました",
      },
      { status: 500 }
    );
  }
}
