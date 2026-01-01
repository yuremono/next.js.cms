import type {
        Metadata
}

from "next";
import React from "react";
import ReactDOM from "react-dom";
import "./globals.css";

import {
        Toaster
}

from "sonner";

import {
        CustomCSSLoader
}

from "@/components/CustomCSSLoader";

import {
        CustomJSLoader
}

from "@/components/CustomJSLoader";

import {
        VariablesLoader
}

from "@/components/VariablesLoader";
import Script from "next/script";

// <html>や<body>は既存のまま
// どこかでグローバルに読み込む
<Script src="https://unpkg.com/budoux/bundle/budoux-ja.min.js"
strategy="afterInteractive"

/>;
// 開発環境でのみaxe-coreを初期化
if (typeof window !=="undefined"&& process.env.NODE_ENV==="development") {
        import("@axe-core/react").then((axe)=> {
                        axe.default(React, ReactDOM, 1000);
                }

        );
}

export const metadata: Metadata= {
        title: "Seiji Yano Works",
                description: "Next.JsでCMS管理画面を構築し、編集したページをポートフォリオサイトとして公開しています",
                viewport: "width=device-width, initial-scale=1",
}

;

export default function RootLayout( {
                children,
        }

        : Readonly< {
                children: React.ReactNode;
        }

        >) {
        return (<html lang="ja"suppressHydrationWarning> <head> <link rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"

                /> </head> <body> {
                        /* CSS読み込み順序: variables.css → custom.css */
                }

                <VariablesLoader /> <CustomCSSLoader /> <CustomJSLoader /> {
                        children
                }

                <Toaster position="top-right"

                toastOptions= {
                                {
                                style: {
                                        marginTop: "72px"
                                }
                        }
                }

                /> </body> </html>);
}