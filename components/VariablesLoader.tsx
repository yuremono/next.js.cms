"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function VariablesLoader() {
  const pathname = usePathname();

  useEffect(() => {
    // トップページ（/）とプレビューページでのみ適用する
    const shouldLoadVariables = pathname === "/" || pathname.startsWith("/preview");

    // variables.cssの存在確認と動的読み込み
    const loadVariables = async () => {
      try {
        if (shouldLoadVariables) {
          const timestamp = new Date().getTime();
          const response = await fetch(`/variables.css?t=${timestamp}`, {
            method: "HEAD",
          });
          if (response.ok) {
            // 既存のvariables.cssリンクがあれば削除
            const existingLink = document.querySelector(
              'link[href^="/variables.css"]'
            );
            if (existingLink) {
              existingLink.remove();
            }

            // 新しいlinkタグを作成
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = `/variables.css?t=${timestamp}`;
            link.type = "text/css";
            
            // CustomCSSより確実に前に挿入するための処理
            const customCSSLink = document.querySelector(
              'link[href^="/custom.css"]'
            );
            if (customCSSLink) {
              // custom.cssが既にある場合は、その前に挿入
              document.head.insertBefore(link, customCSSLink);
            } else {
              // custom.cssがない場合は、headの最後に追加
              document.head.appendChild(link);
            }
          }
        } else {
          // 他のページでは既存のvariables.cssリンクを削除
          const existingLink = document.querySelector(
            'link[href^="/variables.css"]'
          );
          if (existingLink) {
            existingLink.remove();
          }
        }
      } catch {
        // variables.cssが存在しない場合は何もしない
      }
    };

    // 即座に実行（位置制御のみで順序を保証）
    loadVariables();
  }, [pathname]);

  return null; // 何も表示しない
}
