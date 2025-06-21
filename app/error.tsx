"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [isChunkError, setIsChunkError] = useState(false);

  useEffect(() => {
    // ChunkLoadErrorかどうかを判定
    const isChunkLoadError =
      error.name === "ChunkLoadError" ||
      error.message.includes("ChunkLoadError") ||
      error.message.includes("Loading chunk") ||
      error.message.includes("webpack");

    setIsChunkError(isChunkLoadError);

    // エラーログをコンソールに出力（本番では適切なログサービスに送信）
    console.error("Application Error:", error);

    // 開発環境でのみエラー詳細を表示
    if (process.env.NODE_ENV === "development") {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        isChunkError: isChunkLoadError,
      });
    }

    // ChunkLoadErrorの場合は自動でページをリロード（5秒後）
    if (isChunkLoadError) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  // ChunkLoadErrorの場合の専用UI
  if (isChunkError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-orange-500">⚠️</h1>
            <h2 className="text-2xl font-semibold text-foreground">
              アプリケーションを更新中
            </h2>
            <p className="text-muted-foreground">
              新しいバージョンが利用可能です。
              <br />
              5秒後に自動的にページを更新します...
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto"
              aria-label="今すぐページを更新"
            >
              今すぐ更新
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="w-full sm:w-auto"
              aria-label="ホームページに戻る"
            >
              ホームに戻る
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-destructive">500</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            予期しないエラーが発生しました
          </h2>
          <p className="text-muted-foreground">
            申し訳ございません。システムエラーが発生しました。
            しばらく時間をおいてから再度お試しください。
          </p>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="bg-destructive/10 rounded-md p-4 text-left">
            <h3 className="mb-2 text-sm font-medium text-destructive">
              開発者向け情報:
            </h3>
            <p className="break-all font-mono text-xs text-muted-foreground">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-1 text-xs text-muted-foreground">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            className="w-full sm:w-auto"
            aria-label="ページを再読み込みして復旧を試みる"
          >
            再試行
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full sm:w-auto"
            aria-label="ホームページに戻る"
          >
            ホームに戻る
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            問題が続く場合は、
            <a
              href="mailto:support@example.com"
              className="rounded text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="サポートメールを送信"
            >
              サポートまでお問い合わせください
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
