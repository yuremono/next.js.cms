import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

const VARIABLES_FILE_PATH = join(process.cwd(), "public", "variables.css");

// variables.cssファイルを更新
export async function POST(req: NextRequest) {
  try {
    const { css } = await req.json();

    if (typeof css !== "string") {
      return NextResponse.json(
        { error: "無効なCSSデータです" },
        { status: 400 }
      );
    }

    // variables.cssファイルに保存
    writeFileSync(VARIABLES_FILE_PATH, css, "utf8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("variables.css保存エラー:", error);
    return NextResponse.json(
      { error: "ファイルの保存に失敗しました" },
      { status: 500 }
    );
  }
}

// variables.cssファイルを取得
export async function GET() {
  try {
    const css = readFileSync(VARIABLES_FILE_PATH, "utf8");
    return NextResponse.json({ css });
  } catch (error) {
    // ファイルが存在しない場合はデフォルト値を返す
    const defaultCSS = `:root {
  /* レイアウト関連の変数 */
  --base: 1200px;
  --head: 80px;
  --sectionMT: 8%;
  --titleAfter: 24px;
  --sectionPY: 8%;
  --spaceX: 5%;
  --gap: 24px;

  /* カラー関連の変数 */
  --mc: #3b82f6;
  --sc: #64748b;
  --ac: #f59e0b;
  --bc: #ffffff;
  --tc: #1f2937;
}`;
    return NextResponse.json({ css: defaultCSS });
  }
}
