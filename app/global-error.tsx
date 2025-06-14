"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 px-4 text-center">
          <div className="max-w-md space-y-6">
            <div className="space-y-2">
              <h1 className="text-6xl font-bold text-red-600">Error</h1>
              <h2 className="text-2xl font-semibold text-gray-900">
                システムエラーが発生しました
              </h2>
              <p className="text-gray-600">
                重大なエラーが発生しました。ページを再読み込みしてください。
              </p>
            </div>

            <button
              onClick={reset}
              className="inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-8 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              再読み込み
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
