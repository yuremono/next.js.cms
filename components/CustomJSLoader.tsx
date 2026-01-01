"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function CustomJSLoader() {
  const pathname = usePathname();

  useEffect(() => {
    // /editor ページでは適用しない
    const shouldLoadJS = !pathname.startsWith("/editor");

    // /custom.js の存在確認と動的読み込み
    const loadCustomJS = async () => {
      try {
        if (shouldLoadJS) {
          const timestamp = new Date().getTime();
          const response = await fetch(`/custom.js?t=${timestamp}`, {
            method: "HEAD",
          });
          if (response.ok) {
            // 既存の script があれば削除
            const existingScript = document.querySelector(
              'script[src^="/custom.js"]'
            );
            if (existingScript) {
              existingScript.remove();
            }

            // 新しい script タグを作成
            const script = document.createElement("script");
            script.src = `/custom.js?t=${timestamp}`;
            script.defer = true;
            document.body.appendChild(script);
          }
        } else {
          // /editor ページでは既存の script を削除
          const existingScript = document.querySelector(
            'script[src^="/custom.js"]'
          );
          if (existingScript) existingScript.remove();
        }
      } catch {
        // custom.js が存在しない場合は何もしない
      }
    };

    loadCustomJS();
    // 既に読み込み済みならスキップ
    if (document.querySelector('script[src*="budoux-ja.min.js"]')) return;
    const s = document.createElement("script");
    s.src = "https://unpkg.com/budoux/bundle/budoux-ja.min.js";
    s.defer = true;
    document.head.appendChild(s);
    return () => {
      s.remove();
    };
  }, [pathname]);

  return null; // 何も表示しない
}
