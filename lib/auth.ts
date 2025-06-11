import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const authConfig = require("@/config/auth.config.js");

export function checkAuth(request?: NextRequest): boolean {
  // 開発時の認証スキップ（設定ファイルまたは環境変数で制御）
  if (authConfig.skipAuthInDev || process.env.SKIP_AUTH === "true") {
    console.log("🚫 認証をスキップしています（開発モード）");
    return true;
  }

  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get("cms-auth");
    return authCookie?.value === "authenticated";
  } catch (error) {
    console.error("認証チェックエラー:", error);
    return false;
  }
}

export function requireAuth(request?: NextRequest): boolean {
  const isAuthenticated = checkAuth(request);
  if (!isAuthenticated) {
    console.log("認証が必要です");
  }
  return isAuthenticated;
}
