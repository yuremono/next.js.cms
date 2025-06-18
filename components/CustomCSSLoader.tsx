"use client";

import { useEffect } from "react";

export function CustomCSSLoader() {
  useEffect(() => {
    // custom.cssの存在確認と動的読み込み
    const loadCustomCSS = async () => {
      try {
        const response = await fetch("/custom.css");
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
      } catch (error) {
        // custom.cssが存在しない場合は何もしない
      }
    };

    loadCustomCSS();
  }, []);

  return null; // 何も表示しない
}
