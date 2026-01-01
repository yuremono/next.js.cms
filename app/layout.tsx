import type { Metadata } from "next";
import React from "react";
import ReactDOM from "react-dom";
import "./globals.scss";
import { Toaster } from "sonner";
import { CustomCSSLoader } from "@/components/CustomCSSLoader";
import { CustomJSLoader } from "@/components/CustomJSLoader";
import { VariablesLoader } from "@/components/VariablesLoader";
import Script from "next/script";

// 開発環境でのみaxe-coreを初期化
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  import("@axe-core/react").then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
}

export const metadata: Metadata = {
  title: "Seiji Yano Works | オリジナルCMS × モダンフロントエンド",
  description:
    "WEB制作会社出身のフロントエンドエンジニア Seiji Yano のポートフォリオ。自作CMSで構築・管理しており、Next.js, TypeScript, Tailwind CSS, Supabaseを活用した制作実績や、RatioKitなどのUIライブラリ、AI活用の取り組みを公開しています。",
  authors: [{ name: "Seiji Yano" }],

  // Open Graph
  openGraph: {
    title: "Seiji Yano Works",
    description:
      "Next.jsと自作CMSで構築したポートフォリオサイト。モダンな技術スタック（Next.js, TypeScript, Tailwind CSS, Supabase）を駆使した制作実績や、クリエイティブなデモ集を公開中。",
    url: "https://cms0505.vercel.app/",
    siteName: "Seiji Yano Works",
    images: [
      {
        url: "https://cms0505.vercel.app/images/ao.svg",
        width: 1200,
        height: 630,
        alt: "Seiji Yano Works OGP Image",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Seiji Yano Works | フロントエンドエンジニア",
    description:
      "Next.js, TypeScript, Tailwind CSS, Supabaseを用いた自作CMSによるポートフォリオサイト。技術と創造性を融合させた制作物を紹介します。",
    images: ["https://cms0505.vercel.app/images/ao.svg"],
  },

  // Canonical
  alternates: {
    canonical: "https://cms0505.vercel.app/",
  },

  // アイコン設定 (ファビコン)
  icons: {
    icon: "/images/yuru.png",
    apple: "/images/yuru.png",
  },

  // その他設定
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* Material Symbols CDN - Tailwindで上書きしやすくするため、スタイルの前に読み込む */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body>
        <VariablesLoader />
        <CustomCSSLoader />
        <CustomJSLoader />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              marginTop: "72px",
            },
          }}
        />
        <Script
          src="https://unpkg.com/budoux/bundle/budoux-ja.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
