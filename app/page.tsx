import { PageRenderer } from "@/components/PageRenderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Page, Section } from "@/types";
import { CustomCSSLoader } from "@/components/CustomCSSLoader";
import "./top.scss";

// デフォルトページデータ（APIから取得できない場合のフォールバック）
const DEFAULT_PAGE_DATA: Page = {
  header: {
    html: `
  <div class="container mx-auto px-4 py-4 flex justify-between items-center">
    <div class="logo">
      <a href="/" class="text-xl font-bold">サイト名</a>
    </div>
    <nav>
      <ul class="flex space-x-6">
        <li><a href="#" class="hover:text-primary">ホーム</a></li>
        <li><a href="#" class="hover:text-primary">会社概要</a></li>
        <li><a href="#" class="hover:text-primary">サービス</a></li>
        <li><a href="#" class="hover:text-primary">お問い合わせ</a></li>
      </ul>
    </nav>
  </div>`,
  },
  footer: {
    html: `
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 class="text-lg font-semibold mb-4">会社名</h3>
        <p>〒123-4567<br />東京都○○区△△ 1-2-3</p>
        <p>TEL: 03-1234-5678</p>
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-4">リンク</h3>
        <ul class="space-y-2">
          <li><a href="#" class="hover:underline">ホーム</a></li>
          <li><a href="#" class="hover:underline">会社概要</a></li>
          <li><a href="#" class="hover:underline">サービス</a></li>
          <li><a href="#" class="hover:underline">お問い合わせ</a></li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-4">SNS</h3>
        <div class="flex space-x-4">
          <a href="#" class="hover:text-primary">Twitter</a>
          <a href="#" class="hover:text-primary">Facebook</a>
          <a href="#" class="hover:text-primary">Instagram</a>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-700 mt-8 pt-4 text-center">
      <p>© 2024 会社名. All rights reserved.</p>
    </div>
  </div>`,
  },
  sections: [
    {
      id: "section-default-1",
      layout: "mainVisual",
      class: "MainVisual ",
      html: '<h1 class="text-4xl font-bold mb-4">簡易CMSシステム</h1><p class="text-xl">AIによるテキスト生成機能を備えた、テンプレートベースのWebサイト構築システムです。<br>ドラッグ＆ドロップでセクションを追加・入れ替えでき、簡単にWebサイトを編集できます。</p>',
      image: "",
      imageAspectRatio: "auto",
    },
    {
      id: "section-default-2",
      layout: "imgText",
      class: "ImgText",
      html: '<h2 class="text-2xl font-semibold mb-4">セクションタイトル</h2><p>ここにテキストを入力します。このページは管理画面から自由に編集することができます。画像やテキストの配置、セクションの追加・並べ替えなど、さまざまなカスタマイズが可能です。</p><p class="mt-4">AIテキスト生成機能を使えば、プロフェッショナルな文章を簡単に作成できます。</p>',
      image: "",
      imageAspectRatio: "auto",
    },
    {
      id: "section-default-3",
      layout: "cards",
      class: "Cards ",
      cards: [
        {
          html: '<h3 class="text-xl font-semibold mb-2">簡単操作</h3><p>直感的なインターフェースで、専門知識がなくても簡単にWebサイトを編集できます。</p>',
          image: "",
          imageAspectRatio: "auto",
        },
        {
          html: '<h3 class="text-xl font-semibold mb-2">AI機能</h3><p>OpenAI連携でプロフェッショナルなテキストを自動生成できます。</p>',
          image: "",
          imageAspectRatio: "auto",
        },
        {
          html: '<h3 class="text-xl font-semibold mb-2">レスポンシブ</h3><p>PC・タブレット・スマートフォンなど、あらゆる画面サイズに対応しています。</p>',
          image: "",
          imageAspectRatio: "auto",
        },
      ],
    },
    {
      id: "section-default-4",
      layout: "form",
      class: "Form",
      html: '<h2 class="text-2xl font-semibold text-center mb-6">お問い合わせ</h2><p class="text-center mb-8">製品に関するご質問やご要望がございましたら、下記フォームよりお気軽にお問い合わせください。</p>',
      endpoint: "/api/contact",
    },
  ],
  customCSS: `/* カスタムCSSの例 */`,
};

// サーバーコンポーネント
export const revalidate = 0; // 常に最新データを取得

export default async function Home() {
  // ページデータ取得
  let pageData: Page | null = null;

  console.log("環境変数状態:", {
    nodeEnv: process.env.NODE_ENV,
    buildTime: new Date().toISOString(), // デプロイ確認用
    version: "1.0.2", // バージョン追加
  });

  try {
    // エディタと同じAPIエンドポイントを使用してデータを取得
    const response = await fetch(
      `${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000"}/api/page`,
      {
        method: "GET",
        cache: "no-store", // 常に最新データを取得
      }
    );

    if (response.ok) {
      const data = await response.json();

      // セクションにIDがなければ追加（エディタと同じ処理）
      if (data.sections && Array.isArray(data.sections)) {
        data.sections = data.sections.map((section: Section) => {
          if (!section.id) {
            return {
              ...section,
              id: `section-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 9)}`,
            };
          }
          return section;
        });
      }

      pageData = data;
    } else {
      console.log("API取得失敗、デフォルトデータを使用");
      pageData = DEFAULT_PAGE_DATA;
    }
  } catch (error) {
    console.error("ページデータの取得に失敗しました", error);
    console.log("エラーのため、デフォルトデータを使用");
    pageData = DEFAULT_PAGE_DATA;
  }

  // データが取得できなかった場合のデフォルト表示
  if (!pageData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <h1 className="mb-4 text-2xl font-bold">
          データの読み込みに失敗しました
        </h1>
        <p className="mb-8">ページデータが取得できませんでした。</p>
        <Button asChild>
          <Link href="/editor">エディタを開く</Link>
        </Button>
      </div>
    );
  }

  // ヘッダーにエディタを開くボタンを追加
  const modifiedHeader = {
    html: pageData.header.html
      .replace(
        '<div class="container mx-auto px-4 py-4 flex justify-between items-center">',
        `<div class="container mx-auto px-4 py-4 flex justify-between items-center">
				<div class="flex items-center gap-4">`
      )
      .replace(
        "</nav>",
        `</nav>
			<div class="flex items-center">
				<a href="/editor" class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground shadow h-10 px-4 py-2 ml-4">エディタを開く</a>
			</div>`
      ),
  };

  const modifiedPageData = {
    ...pageData,
    header: modifiedHeader,
  };

  return (
    <>
      <CustomCSSLoader />
      <PageRenderer page={modifiedPageData} />
    </>
  );
}
 