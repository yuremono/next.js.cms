import type { Metadata } from "next";
import React from "react";
import ReactDOM from "react-dom";
import "./globals.css";
import { Toaster } from "sonner";
import { CustomCSSLoader } from "@/components/CustomCSSLoader";
import { CustomJSLoader } from "@/components/CustomJSLoader";

// 開発環境でのみaxe-coreを初期化
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  import("@axe-core/react").then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
}

export const metadata: Metadata = {
  title: "簡易CMS - テンプレートベースのWebサイト構築",
  description:
    "AIによるテキスト生成機能を備えた簡易CMSで、簡単にWebサイトを編集できます。",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head />
      <body>
        <CustomCSSLoader />
        <CustomJSLoader />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{ style: { marginTop: "72px" } }}
        />
      </body>
    </html>
  );
}
 