"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function CustomCSSLoader() {
  const pathname = usePathname();

  useEffect(() => {
    // /editorページでは適用しない
    const shouldLoadCSS = !pathname.startsWith("/editor");

    // custom.cssの存在確認と動的読み込み
    const loadCustomCSS = async () => {
      try {
        if (shouldLoadCSS) {
          const response = await fetch("/custom.css", { method: "HEAD" });
          if (response.ok) {
            // 既存のcustom.cssリンクがあれば削除
            const existingLink = document.querySelector(
              'link[href="/custom.css"]'
            );
            if (existingLink) {
              existingLink.remove();
            }

            // 新しいlinkタグを作成
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "/custom.css";
            link.type = "text/css";
            document.head.appendChild(link);
          }
        } else {
          // /editorページでは既存のcustom.cssリンクを削除
          const existingLink = document.querySelector(
            'link[href="/custom.css"]'
          );
          if (existingLink) {
            existingLink.remove();
          }
        }
      } catch {
        // custom.cssが存在しない場合は何もしない
      }
    };

    loadCustomCSS();
  }, [pathname]);

  return null; // 何も表示しない
}
