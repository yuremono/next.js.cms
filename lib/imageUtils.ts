import { supabase, isSupabaseConfigured } from "./supabase";
import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";

// 内部的にDataURLを保存するためのMap（本番環境用）
const imageStore = new Map<string, string>();

// サーバー側での永続化のためのシンプルなファイルベースのストレージ（開発用）
let localImageCache: Record<string, string> = {};

// キャッシュをサーバーに保存する試み（本番環境では効果がない可能性あり）
try {
	// Next.jsのAPI Routeではファイル操作が許可されないため、メモリに保持
	if (typeof global !== "undefined") {
		if (!global.localImageCache) {
			global.localImageCache = {};
		}
		localImageCache = global.localImageCache;
	}
} catch (error) {
	console.warn("Failed to initialize persistent image cache", error);
}

/**
 * メディアファイル（画像・動画）をSupabaseストレージにアップロードする
 * または環境変数が設定されていない場合はDataURIを返す
 * @param file メディアファイル（画像・動画）
 * @param folder 保存先フォルダ名
 * @returns アップロードされたメディアのURL
 */
export async function uploadAndOptimizeImage(
  file: File,
  folder = "media"
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

      // 一意のIDを生成してメディアマップに保存
      const mediaId = `local-media-${uuidv4()}`;
      imageStore.set(mediaId, dataUrl);

      // グローバルキャッシュにも保存
      if (localImageCache) {
        localImageCache[mediaId] = dataUrl;
      }

      // Local media stored with ID: ${mediaId}

      // 直接APIルートを指すURLを返す - 絶対パスを使用
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
      return `${baseUrl}/api/images/_local/${mediaId}`;
    }

    // 以下、Supabaseストレージを使用する場合の処理
    let fileToUpload: File | Blob = file;
    const isImage = file.type.startsWith("image/");
    const fileExt = isImage ? "webp" : file.name.split(".").pop();
    
    // 画像の場合はWebPに変換
    if (isImage) {
      try {
        const options = {
          maxSizeMB: 2, // 最大2MB（高品質維持）
          maxWidthOrHeight: undefined, // 元の解像度を維持
          useWebWorker: true,
          fileType: "image/webp",
          initialQuality: 0.85, // 高画質設定
        };
        fileToUpload = await imageCompression(file, options);
      } catch (err) {
        console.warn("画像圧縮に失敗しました。元のファイルをアップロードします:", err);
      }
    }

    // ファイル名を一意のものに変更
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Supabaseストレージにアップロード
    const { error } = await supabase.storage
      .from("cms-images") // バケット名（画像・動画共用）
      .upload(filePath, fileToUpload, {
        contentType: isImage ? "image/webp" : file.type,
        upsert: true
      });

    if (error) {
      console.error("メディアアップロードエラー:", error);
      return null;
    }

    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from("cms-images")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error("メディア処理エラー:", error);
    return null;
  }
}

/**
 * ローカルに保存されているメディアデータを取得
 * @param imageId メディアID
 * @returns データURL
 */
export function getLocalImage(imageId: string): string | null {
	// まずメモリ内ストアから取得を試みる
	const memoryImage = imageStore.get(imageId);
	if (memoryImage) return memoryImage;

	// 次にグローバルキャッシュから取得を試みる
	if (localImageCache && localImageCache[imageId]) {
		return localImageCache[imageId];
	}

	return null;
}

/**
 * ローカルメディアを削除
 * @param imageId メディアID
 * @returns 成功したかどうか
 */
export function deleteLocalImage(imageId: string): boolean {
	// メモリ内ストアから削除
	const memoryResult = imageStore.delete(imageId);

	// グローバルキャッシュからも削除
	if (localImageCache && imageId in localImageCache) {
		delete localImageCache[imageId];
	}

	return memoryResult;
}

/**
 * すべてのローカルメディアを取得
 * @returns メディア情報の配列
 */
export function getAllLocalImages(): { name: string; url: string }[] {
	const images: { name: string; url: string }[] = [];
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";

	// メモリ内ストアの画像を追加
	imageStore.forEach((dataUrl, id) => {
		images.push({
			name: id,
			url: `${baseUrl}/api/images/_local/${id}`,
		});
	});

	// グローバルキャッシュの画像も追加
	if (localImageCache) {
		Object.keys(localImageCache).forEach((id) => {
			// 重複を避けるため、すでに追加されていないか確認
			if (!imageStore.has(id)) {
				images.push({
					name: id,
					url: `${baseUrl}/api/images/_local/${id}`,
				});
			}
		});
	}

	return images;
}
