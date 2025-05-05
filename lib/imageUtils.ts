import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";

/**
 * 画像ファイルを最適化してSupabaseストレージにアップロードする
 * または環境変数が設定されていない場合はDataURIを返す
 * @param file 画像ファイル
 * @param folder 保存先フォルダ名
 * @returns アップロードされた画像のURL
 */
export async function uploadAndOptimizeImage(
	file: File,
	folder = "images"
): Promise<string | null> {
	try {
		// 環境変数が設定されていない場合はDataURIを使用
		if (
			!process.env.NEXT_PUBLIC_SUPABASE_URL ||
			!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
		) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result as string);
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});
		}

		// 以下、Supabaseストレージを使用する場合の処理
		// ファイル名を一意のものに変更
		const fileExt = file.name.split(".").pop();
		const fileName = `${uuidv4()}.${fileExt}`;
		const filePath = `${folder}/${fileName}`;

		// 画像の最適化処理
		// ここで画像を最適化する処理を実装する（例：サイズ変更、WebP変換など）
		// 実際のプロジェクトでは画像処理ライブラリを使用する

		// Supabaseストレージにアップロード
		const { data, error } = await supabase.storage
			.from("cms-images") // バケット名
			.upload(filePath, file);

		if (error) {
			console.error("画像アップロードエラー:", error);
			return null;
		}

		// 公開URLを取得
		const { data: urlData } = supabase.storage
			.from("cms-images")
			.getPublicUrl(filePath);

		return urlData.publicUrl;
	} catch (error) {
		console.error("画像処理エラー:", error);
		return null;
	}
}
