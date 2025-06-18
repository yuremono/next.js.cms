import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// カスタムCSS配信API
export async function GET() {
  try {
    // Supabaseが設定されていない場合はデフォルトCSSを返す
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      const defaultCSS = `
/* デフォルトカスタムCSS */
.MainVisual {
  background-color: #f0f8ff;
  padding: 4rem 0;
}

.ImgText {
  padding: 3rem 0;
  background-color: #ffffff;
}

.Cards {
  padding: 3rem 0;
  background-color: #f5f5f5;
}
      `.trim();

      return new NextResponse(defaultCSS, {
        headers: {
          "Content-Type": "text/css",
          "Cache-Control": "public, max-age=3600", // 1時間キャッシュ
        },
      });
    }

    // ページデータを取得
    const { data: page, error } = await supabase
      .from("pages")
      .select("custom_css")
      .eq("id", 1)
      .single();

    if (error || !page) {
      console.error("カスタムCSS取得エラー:", error);
      return new NextResponse("/* カスタムCSS取得エラー */", {
        headers: {
          "Content-Type": "text/css",
          "Cache-Control": "no-cache",
        },
      });
    }

    // カスタムCSSを返す（変数も含む）
    const customCSS =
      page.custom_css || "/* カスタムCSSが設定されていません */";

    return new NextResponse(customCSS, {
      headers: {
        "Content-Type": "text/css",
        "Cache-Control": "public, max-age=300", // 5分キャッシュ
      },
    });
  } catch (error) {
    console.error("カスタムCSS配信エラー:", error);
    return new NextResponse("/* カスタムCSS配信エラー */", {
      headers: {
        "Content-Type": "text/css",
        "Cache-Control": "no-cache",
      },
    });
  }
}
