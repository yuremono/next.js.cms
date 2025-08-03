import { NextRequest } from "next/server";
import { cookies } from "next/headers";

import authConfig from "@/config/auth.config.js";

export async function checkAuth(request?: NextRequest): Promise<boolean> {
  // 開発時の認証スキップ（設定ファイルまたは環境変数で制御）
  if (authConfig.skipAuthInDev || process.env.SKIP_AUTH === "true") {
    return true;
  }

  try {
    const cookieStore = cookies();
    const authCookie = (await cookieStore).get("cms-auth");
    return authCookie?.value === "authenticated";
  } catch (error) {
    console.error("認証チェックエラー:", error);
    return false;
  }
}

export async function requireAuth(request?: NextRequest): Promise<boolean> {
  const isAuthenticated = await checkAuth(request);
  return isAuthenticated;
}
