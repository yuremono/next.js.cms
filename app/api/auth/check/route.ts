import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  console.log("🔐 認証チェックAPI呼び出し");
  
  try {
    // 開発時の認証スキップチェック
    if (process.env.SKIP_AUTH === "true") {
      console.log("🔓 サーバー側認証をスキップ (開発モード)");
      return NextResponse.json({ authenticated: true });
    }

    const cookieStore = cookies();
    const authCookie = (await cookieStore).get("cms-auth");
    
    console.log("🍪 認証クッキー:", authCookie ? "存在" : "なし");

    const authenticated = authCookie?.value === "authenticated";
    
    console.log("✅ 認証結果:", authenticated);

    return NextResponse.json({ authenticated });
  } catch (error) {
    console.error("❌ 認証チェックAPIエラー:", error);
    return NextResponse.json({ 
      authenticated: false,
      error: "認証チェック中にエラーが発生しました"
    }, { status: 500 });
  }
}
