import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

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
