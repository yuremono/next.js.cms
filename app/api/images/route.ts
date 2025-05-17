import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { getAllLocalImages, deleteLocalImage } from "@/lib/imageUtils";

// キャッシュ制御のためのヘッダー
const HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
	"Cache-Control": "no-store, max-age=0"
};

// CORS対応のためのOPTIONSメソッド
export async function OPTIONS() {
	return new NextResponse(null, { 
		headers: HEADERS
	});
}

// 画像管理API - 画像一覧を取得
export async function GET() {
	try {
		// 環境変数が設定されていなければローカル画像ストアを返す
		if (!isSupabaseConfigured) {
			const localImages = getAllLocalImages();
			return NextResponse.json(
				{
					images: localImages.map((img) => ({
						...img,
						size: 0,
						created: new Date().toISOString(),
					})),
				},
				{ headers: HEADERS }
			);
		}

		// Supabaseストレージから画像一覧を取得
		const { data, error } = await supabase.storage
			.from("cms-images")
			.list("images");

		if (error) {
			console.error("画像一覧取得エラー:", error);
			return NextResponse.json(
				{ error: "画像一覧の取得に失敗しました" },
				{ status: 500, headers: HEADERS }
			);
		}

		// 画像のURLを生成
		const images = data.map((file) => {
			const { data: urlData } = supabase.storage
				.from("cms-images")
				.getPublicUrl(`images/${file.name}`);

			return {
				name: file.name,
				size: file.metadata?.size || 0,
				url: urlData.publicUrl,
				created: file.created_at,
			};
		});

		return NextResponse.json({ images }, { headers: HEADERS });
	} catch (error) {
		console.error("画像一覧取得エラー:", error);
		return NextResponse.json(
			{ error: "画像一覧の取得に失敗しました" },
			{ status: 500, headers: HEADERS }
		);
	}
}

// 画像管理API - 画像を削除
export async function DELETE(req: NextRequest) {
	try {
		const { filename } = await req.json();

		if (!filename) {
			return NextResponse.json(
				{ error: "ファイル名が指定されていません" },
				{ status: 400, headers: HEADERS }
			);
		}

		// ローカルの画像を削除する場合
		if (filename.startsWith("local-image-")) {
			const success = deleteLocalImage(filename);
			if (success) {
				return NextResponse.json(
					{ success: true },
					{ headers: HEADERS }
				);
			} else {
				return NextResponse.json(
					{ error: "ローカル画像の削除に失敗しました" },
					{ status: 500, headers: HEADERS }
				);
			}
		}

		// 環境変数が設定されていなければエラーを返す
		if (!isSupabaseConfigured) {
			return NextResponse.json(
				{ error: "ストレージが設定されていません" },
				{ status: 500, headers: HEADERS }
			);
		}

		// Supabaseストレージから画像を削除
		const { error } = await supabase.storage
			.from("cms-images")
			.remove([`images/${filename}`]);

		if (error) {
			console.error("画像削除エラー:", error);
			return NextResponse.json(
				{ error: "画像の削除に失敗しました" },
				{ status: 500, headers: HEADERS }
			);
		}

		return NextResponse.json({ success: true }, { headers: HEADERS });
	} catch (error) {
		console.error("画像削除エラー:", error);
		return NextResponse.json(
			{ error: "画像の削除に失敗しました" },
			{ status: 500, headers: HEADERS }
		);
	}
}
 