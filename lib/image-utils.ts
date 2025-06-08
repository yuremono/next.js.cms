/**
 * 画像のアスペクト比を取得する関数
 * @param imageUrl 画像のURL
 * @returns Promise<string> アスペクト比 (例: "4/3", "16/9")
 */
export const getImageAspectRatio = (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    // 空の画像URLの場合は即座にautoを返す
    if (!imageUrl || imageUrl.trim() === "") {
      resolve("auto");
      return;
    }

    const img = new Image();
    let isResolved = false;

    const timeoutId: NodeJS.Timeout = setTimeout(() => {
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

      // サイズが0の場合はautoを返す
      if (width === 0 || height === 0) {
        safeResolve("auto");
        return;
      }

      // 最大公約数を求める関数
      const gcd = (a: number, b: number): number => {
        return b === 0 ? a : gcd(b, a % b);
      };

      // 比率を簡約化
      const divisor = gcd(width, height);
      const aspectWidth = width / divisor;
      const aspectHeight = height / divisor;

      // よく使われる比率に近似化
      const ratio = width / height;

      let aspectRatio: string;

      if (Math.abs(ratio - 16 / 9) < 0.05) {
        aspectRatio = "16/9";
      } else if (Math.abs(ratio - 4 / 3) < 0.05) {
        aspectRatio = "4/3";
      } else if (Math.abs(ratio - 3 / 2) < 0.05) {
        aspectRatio = "3/2";
      } else if (Math.abs(ratio - 1) < 0.05) {
        aspectRatio = "1/1";
      } else if (Math.abs(ratio - 2 / 3) < 0.05) {
        aspectRatio = "2/3";
      } else {
        // 一般的な比率として計算値を使用
        aspectRatio = `${aspectWidth}/${aspectHeight}`;
      }

      safeResolve(aspectRatio);
    };

    img.onerror = () => {
      // CORS エラーの場合の代替アプローチを試す
      if (
        imageUrl.startsWith("http") &&
        !imageUrl.startsWith(window.location.origin)
      ) {
        tryFallbackApproach(imageUrl).then(safeResolve);
      } else {
        safeResolve("auto");
      }
    };

    // CORS設定の改善
    try {
      // 現在のサイトと同じオリジンかチェック
      let isSameOrigin = false;
      try {
        const urlObj = new URL(imageUrl);
        const currentOrigin = window.location.origin;
        isSameOrigin = urlObj.origin === currentOrigin;
      } catch {
        // 相対URLの場合は同一オリジンとみなす
        isSameOrigin = !imageUrl.startsWith("http");
      }

      if (!isSameOrigin) {
        // 外部画像の場合は crossOrigin を設定
        img.crossOrigin = "anonymous";
      }

      img.src = imageUrl;
    } catch {
      safeResolve("auto");
    }
  });
};

/**
 * CORS問題が発生した場合の代替アプローチ
 */
async function tryFallbackApproach(imageUrl: string): Promise<string> {
  try {
    // fetch APIを使用してHEADリクエストで画像情報を取得を試行
    await fetch(imageUrl, {
      method: "HEAD",
      mode: "no-cors", // CORS制約を回避
    });

    return "auto";
  } catch {
    return "auto";
  }
}
