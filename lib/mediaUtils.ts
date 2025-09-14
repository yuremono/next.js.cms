/**
 * メディアファイルのタイプを判別するユーティリティ関数
 */
export function getFileType(url: string): "image" | "video" | "unknown" {
  if (!url) return "unknown";
  
  // サーバーサイドでは判別を行わず、デフォルトで画像として扱う
  if (typeof window === "undefined") {
    return "image";
  }

  // Data URLの場合
  if (url.startsWith("data:")) {
    if (url.startsWith("data:image/")) return "image";
    if (url.startsWith("data:video/")) return "video";
  }

  // 一般的な拡張子から判別
  const lowerUrl = url.toLowerCase();
  if (
    lowerUrl.includes(".mp4") ||
    lowerUrl.includes(".webm") ||
    lowerUrl.includes(".mov") ||
    lowerUrl.includes(".avi") ||
    lowerUrl.includes(".wmv") ||
    lowerUrl.includes(".flv") ||
    lowerUrl.includes(".mkv") ||
    lowerUrl.includes(".m4v")
  ) {
    return "video";
  }

  if (
    lowerUrl.includes(".jpg") ||
    lowerUrl.includes(".jpeg") ||
    lowerUrl.includes(".png") ||
    lowerUrl.includes(".gif") ||
    lowerUrl.includes(".webp") ||
    lowerUrl.includes(".svg") ||
    lowerUrl.includes(".bmp") ||
    lowerUrl.includes(".tiff")
  ) {
    return "image";
  }

  return "image"; // デフォルトは画像として扱う
}

/**
 * メディアファイル（画像・動画）のアスペクト比を取得する関数
 * @param mediaUrl メディアファイルのURL
 * @returns Promise<string> アスペクト比 (例: "4/3", "16/9", "auto")
 */
export const getMediaAspectRatio = (mediaUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    // 空のURLの場合は即座にautoを返す
    if (!mediaUrl || mediaUrl.trim() === "") {
      resolve("auto");
      return;
    }

    // サーバーサイドでは常にautoを返す
    if (typeof window === "undefined") {
      resolve("auto");
      return;
    }

    const fileType = getFileType(mediaUrl);
    
    if (fileType === "video") {
      // 動画の場合
      const video = document.createElement("video");
      let isResolved = false;

      const timeoutId = setTimeout(() => {
        safeResolve("auto");
      }, 10000); // タイムアウトを10秒に延長

      const safeResolve = (result: string) => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeoutId);
          resolve(result);
        }
      };

      video.onloadedmetadata = () => {
        const width = video.videoWidth;
        const height = video.videoHeight;

        console.log(`動画メタデータ読み込み完了: ${width}x${height}`);

        if (width === 0 || height === 0) {
          console.warn("動画のサイズが取得できませんでした");
          safeResolve("auto");
          return;
        }

        // アスペクト比を計算
        const ratio = width / height;
        let aspectRatio = "auto";

        // よく使われる比率に近似化（より厳密に）
        if (Math.abs(ratio - 16/9) < 0.05) aspectRatio = "16/9";
        else if (Math.abs(ratio - 4/3) < 0.05) aspectRatio = "4/3";
        else if (Math.abs(ratio - 3/2) < 0.05) aspectRatio = "3/2";
        else if (Math.abs(ratio - 1) < 0.05) aspectRatio = "1/1";
        else if (Math.abs(ratio - 9/16) < 0.05) aspectRatio = "9/16";
        else if (Math.abs(ratio - 21/9) < 0.05) aspectRatio = "21/9"; // 超ワイド
        else {
          // 最大公約数を求めて簡約化
          const gcd = (a: number, b: number): number => {
            return b === 0 ? a : gcd(b, a % b);
          };
          const divisor = gcd(width, height);
          aspectRatio = `${width / divisor}/${height / divisor}`;
        }

        console.log(`動画アスペクト比: ${aspectRatio} (元: ${width}x${height}, 比率: ${ratio.toFixed(3)})`);
        safeResolve(aspectRatio);
      };

      video.onerror = (error) => {
        console.error("動画メタデータの読み込みに失敗:", error);
        safeResolve("auto");
      };

      video.onabort = () => {
        console.warn("動画の読み込みが中断されました");
        safeResolve("auto");
      };

      // CORS対応
      video.crossOrigin = "anonymous";
      video.preload = "metadata";
      video.muted = true; // 一部ブラウザでは音声なしでないとメタデータが読み込まれない場合がある
      
      // URLを設定
      video.src = mediaUrl;
      
      // フォールバック: load()を明示的に呼び出し
      try {
        video.load();
      } catch (loadError) {
        console.error("動画のload()に失敗:", loadError);
        safeResolve("auto");
      }
    } else {
      // 画像の場合（従来の処理）
      const img = new Image();
      let isResolved = false;

      const timeoutId = setTimeout(() => {
        safeResolve("auto");
      }, 8000);

      const safeResolve = (result: string) => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeoutId);
          resolve(result);
        }
      };

      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        if (width === 0 || height === 0) {
          safeResolve("auto");
          return;
        }

        // アスペクト比を計算（画像用）
        const ratio = width / height;
        let aspectRatio = "auto";

        // よく使われる比率に近似化
        if (Math.abs(ratio - 16/9) < 0.1) aspectRatio = "16/9";
        else if (Math.abs(ratio - 4/3) < 0.1) aspectRatio = "4/3";
        else if (Math.abs(ratio - 3/2) < 0.1) aspectRatio = "3/2";
        else if (Math.abs(ratio - 1) < 0.1) aspectRatio = "1/1";
        else if (Math.abs(ratio - 9/16) < 0.1) aspectRatio = "9/16";
        else {
          // 最大公約数を求めて簡約化
          const gcd = (a: number, b: number): number => {
            return b === 0 ? a : gcd(b, a % b);
          };
          const divisor = gcd(width, height);
          aspectRatio = `${width / divisor}/${height / divisor}`;
        }

        safeResolve(aspectRatio);
      };

      img.onerror = () => {
        safeResolve("auto");
      };

      img.src = mediaUrl;
    }
  });
};
