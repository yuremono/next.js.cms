// パフォーマンス最適化ユーティリティ

// 画像最適化設定
export interface ImageOptimizationOptions {
  quality: number;
  format: "webp" | "jpeg" | "png";
  width?: number;
  height?: number;
}

// WebP対応チェック
export function supportsWebP(): boolean {
  if (typeof window === "undefined") return false;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
}

// Base64画像をWebPに変換
export async function convertToWebP(
  base64Image: string,
  options: ImageOptimizationOptions = { quality: 0.8, format: "webp" }
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve(base64Image);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      // リサイズ計算
      let { width, height } = options;
      if (!width && !height) {
        width = img.width;
        height = img.height;
      } else if (width && !height) {
        height = (img.height * width) / img.width;
      } else if (height && !width) {
        width = (img.width * height) / img.height;
      }

      canvas.width = width!;
      canvas.height = height!;

      // 画像を描画
      ctx.drawImage(img, 0, 0, width!, height!);

      // WebPまたは指定形式で出力
      const mimeType = `image/${options.format}`;
      const result = canvas.toDataURL(mimeType, options.quality);

      resolve(result);
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = base64Image;
  });
}

// 画像圧縮
export async function compressImage(
  base64Image: string,
  maxSize: number = 500 * 1024 // 500KB
): Promise<string> {
  let quality = 0.9;
  let compressed = base64Image;

  while (compressed.length > maxSize && quality > 0.1) {
    compressed = await convertToWebP(base64Image, {
      quality,
      format: supportsWebP() ? "webp" : "jpeg",
    });
    quality -= 0.1;
  }

  return compressed;
}
