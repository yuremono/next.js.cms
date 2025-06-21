"use client";

import { useState, useEffect } from "react";
import { Page } from "@/types";
import { PageRenderer } from "@/components/PageRenderer";
import "../top.scss";

export default function PreviewPage() {
  const [page, setPage] = useState<Page | null>(null);

  useEffect(() => {
    // PostMessage リスナーを設定
    const handleMessage = (event: MessageEvent) => {
      // セキュリティチェック: 同一オリジンからのメッセージのみ受け入れ
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "UPDATE_PAGE_DATA") {
        setPage(event.data.data);
      }
    };

    window.addEventListener("message", handleMessage);

    // 初期読み込み時にエディターにready信号を送信
    window.parent.postMessage(
      { type: "PREVIEW_READY" },
      window.location.origin
    );

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  if (!page) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
          <p className="mt-2 text-sm text-gray-600">プレビュー準備中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* カスタムCSS */}
      {/* {page.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: page.customCSS }} />
      )} */}

      {/* <main> */}
      <PageRenderer page={page} />
      {/* </main> */}
    </>
  );
}
