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
          const timestamp = new Date().getTime();
          const response = await fetch(`/custom.css?t=${timestamp}`, {
            method: "HEAD",
          });
          if (response.ok) {
            // 既存のcustom.cssリンクがあれば削除
            const existingLink = document.querySelector(
              'link[href^="/custom.css"]'
            );
            if (existingLink) {
              existingLink.remove();
            }

            // 新しいlinkタグを作成
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = `/custom.css?t=${timestamp}`;
            link.type = "text/css";

            // variables.cssの後に挿入するための処理
            const variablesCSSLink = document.querySelector(
              'link[href^="/variables.css"]'
            );
            if (variablesCSSLink && variablesCSSLink.nextSibling) {
              // variables.cssが存在する場合は、その直後に挿入
              document.head.insertBefore(link, variablesCSSLink.nextSibling);
            } else {
              // variables.cssがない場合は、headの最後に追加
              document.head.appendChild(link);
            }
          }
        } else {
          // /editorページでは既存のcustom.cssリンクを削除
          const existingLink = document.querySelector(
            'link[href^="/custom.css"]'
          );
          if (existingLink) {
            existingLink.remove();
          }
        }
      } catch {
        // custom.cssが存在しない場合は何もしない
      }
    };

    // 即座に実行（位置制御のみで順序を保証）
    loadCustomCSS();
  }, [pathname]);

  return null; // 何も表示しない
}
