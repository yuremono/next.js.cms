import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
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

    // カスタムCSSを返す
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

export async function POST(request: NextRequest) {
  try {
    const { css } = await request.json();

    if (typeof css !== "string") {
      return NextResponse.json(
        { error: "CSS content is required and must be a string" },
        { status: 400 }
      );
    }

    // public/custom.cssに書き出し
    const filePath = join(process.cwd(), "public", "custom.css");
    await writeFile(filePath, css, "utf8");

    return NextResponse.json({
      success: true,
      message: "CSS file created successfully",
    });
  } catch (error) {
    console.error("CSS file creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create CSS file" },
      { status: 500 }
    );
  }
}
