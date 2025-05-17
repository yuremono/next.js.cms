import { supabase, isSupabaseConfigured } from "./supabase";
import { v4 as uuidv4 } from "uuid";

// 内部的にDataURLを保存するためのMap（本番環境用）
const imageStore = new Map<string, string>();

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
		if (!isSupabaseConfigured) {
			// DataURLを生成
			const dataUrl = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result as string);
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});

			// 一意のIDを生成してイメージマップに保存
			const imageId = `local-image-${uuidv4()}`;
			imageStore.set(imageId, dataUrl);

			// 直接APIルートを指すURLを返す
			return `/api/images/_local/${imageId}`;
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
		const { error } = await supabase.storage
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

/**
 * ローカルに保存されている画像データを取得
 * @param imageId 画像ID
 * @returns データURL
 */
export function getLocalImage(imageId: string): string | null {
	return imageStore.get(imageId) || null;
}

/**
 * ローカル画像を削除
 * @param imageId 画像ID
 * @returns 成功したかどうか
 */
export function deleteLocalImage(imageId: string): boolean {
	return imageStore.delete(imageId);
}

/**
 * すべてのローカル画像を取得
 * @returns 画像情報の配列
 */
export function getAllLocalImages(): { name: string; url: string }[] {
	const images: { name: string; url: string }[] = [];
	imageStore.forEach((dataUrl, id) => {
		images.push({
			name: id,
			url: `/api/images/_local/${id}`,
		});
	});
	return images;
}
