import { NextRequest, NextResponse } from "next/server";
import { getLocalImage } from "@/lib/imageUtils";

// ローカル画像を取得するAPI
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const imageId = params.id;
	const imageData = getLocalImage(imageId);

	if (!imageData) {
		return new NextResponse("画像が見つかりません", { status: 404 });
	}

	// データURLからContent-Typeとデータを抽出
	const matches = imageData.match(/^data:(.+);base64,(.*)$/);

	if (!matches || matches.length !== 3) {
		return new NextResponse("無効な画像データ", { status: 500 });
	}

	const contentType = matches[1];
	const base64Data = matches[2];
	const buffer = Buffer.from(base64Data, "base64");

	return new NextResponse(buffer, {
		headers: {
			"Content-Type": contentType,
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}
