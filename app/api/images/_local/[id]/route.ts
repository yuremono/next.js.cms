import { NextRequest, NextResponse } from "next/server";
import { getLocalImage } from "@/lib/imageUtils";

// ヘッダー設定
const HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
	"Cache-Control": "public, max-age=31536000, immutable"
};

// CORS対応のためのOPTIONSメソッド
export async function OPTIONS() {
	return new NextResponse(null, { 
		headers: HEADERS
	});
}

// ローカル画像を取得するAPI（代替アプローチ）
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const imageId = params.id;
	console.log("Getting local image via API route:", imageId);

	const imageData = getLocalImage(imageId);

	if (!imageData) {
		console.error("Image not found:", imageId);
		return new NextResponse("画像が見つかりません", {
			status: 404,
			headers: {
				...HEADERS,
				"Cache-Control": "no-cache, no-store",
			},
		});
	}

	// データURLからContent-Typeとデータを抽出
	const matches = imageData.match(/^data:(.+);base64,(.*)$/);

	if (!matches || matches.length !== 3) {
		console.error("Invalid image data format");
		return new NextResponse("無効な画像データ", {
			status: 500,
			headers: {
				...HEADERS,
				"Cache-Control": "no-cache, no-store",
			},
		});
	}

	const contentType = matches[1];
	const base64Data = matches[2];
	const buffer = Buffer.from(base64Data, "base64");

	return new NextResponse(buffer, {
		headers: {
			...HEADERS,
			"Content-Type": contentType,
		},
	});
}
