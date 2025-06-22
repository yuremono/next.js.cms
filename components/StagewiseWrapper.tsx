"use client";

import { useEffect, useState } from "react";

export function StagewiseWrapper() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && process.env.NODE_ENV === "development") {
      // iframe内で実行されている場合は無効化
      const isInIframe = window !== window.parent;

      // プレビューページの場合は無効化
      const isPreviewPage = window.location.pathname.includes("/preview");

      // これらの条件に該当しない場合のみStagewiseを有効化
      if (!isInIframe && !isPreviewPage) {
        import("@stagewise/toolbar-next")
          .then(({ StagewiseToolbar }) => {
            import("@stagewise-plugins/react").then(({ ReactPlugin }) => {
              // StagewiseToolbarを動的に初期化
              const toolbarElement = document.createElement("div");
              toolbarElement.id = "stagewise-toolbar-root";
              document.body.appendChild(toolbarElement);

              // Reactでレンダリング
              import("react-dom/client").then(({ createRoot }) => {
                import("react").then((React) => {
                  const root = createRoot(toolbarElement);
                  root.render(
                    React.createElement(StagewiseToolbar, {
                      config: {
                        plugins: [ReactPlugin],
                      },
                    })
                  );
                });
              });
            });
          })
          .catch((error) => {
            console.warn("Stagewise初期化に失敗しました:", error);
          });
      }
    }
  }, [isClient]);

  return null;
}
