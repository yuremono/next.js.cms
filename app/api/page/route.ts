import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sanitizeHtml } from "@/lib/sanitize";
import { Page } from "@/types";

const DEFAULT_PAGE_DATA: Page = {
	header: {
		html: `<header class="bg-white shadow-sm">
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
  </div>
</header>`,
	},
	footer: {
		html: `<footer class="bg-gray-800 text-white">
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
  </div>
</footer>`,
	},
	sections: [
		{
			layout: "mainVisual",
			class: "hero-section bg-gray-50",
			html: '<h1 class="text-4xl font-bold mb-4">簡易CMSシステム</h1><p class="text-xl">AIによるテキスト生成機能を備えた、テンプレートベースのWebサイト構築システムです。<br>ドラッグ＆ドロップでセクションを追加・入れ替えでき、簡単にWebサイトを編集できます。</p>',
			image: "",
		},
		{
			layout: "imgText",
			class: "img-text-section",
			html: '<h2 class="text-2xl font-semibold mb-4">セクションタイトル</h2><p>ここにテキストを入力します。このページは管理画面から自由に編集することができます。画像やテキストの配置、セクションの追加・並べ替えなど、さまざまなカスタマイズが可能です。</p><p class="mt-4">AIテキスト生成機能を使えば、プロフェッショナルな文章を簡単に作成できます。</p>',
			image: "",
		},
		{
			layout: "cards",
			class: "cards-section bg-gray-50",
			cards: [
				{
					html: '<h3 class="text-xl font-semibold mb-2">簡単操作</h3><p>直感的なインターフェースで、専門知識がなくても簡単にWebサイトを編集できます。</p>',
					image: "",
				},
				{
					html: '<h3 class="text-xl font-semibold mb-2">AI機能</h3><p>OpenAI連携でプロフェッショナルなテキストを自動生成できます。</p>',
					image: "",
				},
				{
					html: '<h3 class="text-xl font-semibold mb-2">レスポンシブ</h3><p>PC・タブレット・スマートフォンなど、あらゆる画面サイズに対応しています。</p>',
					image: "",
				},
			],
		},
		{
			layout: "form",
			class: "form-section",
			html: '<h2 class="text-2xl font-semibold text-center mb-6">お問い合わせ</h2><p class="text-center mb-8">製品に関するご質問やご要望がございましたら、下記フォームよりお気軽にお問い合わせください。</p>',
			endpoint: "/api/contact",
		},
	],
	customCSS: `/* カスタムCSSの例 */
/* ヘッダーのスタイルをカスタマイズ */
/*
header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

header a {
  color: #343a40;
}

header a:hover {
  color: #007bff;
  text-decoration: none;
}
*/`,
};

// ページデータ取得
export async function GET() {
	try {
		// Supabaseからデータを取得（未設定の場合はデフォルトデータを返す）
		if (
			!process.env.NEXT_PUBLIC_SUPABASE_URL ||
			!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
		) {
			return NextResponse.json(DEFAULT_PAGE_DATA);
		}

		const { data, error } = await supabase
			.from("pages")
			.select("*")
			.eq("id", "main") // 単一ページなのでidは固定
			.single();

		if (error || !data) {
			console.log(
				"ページデータが見つからないためデフォルトを返します:",
				error
			);
			return NextResponse.json(DEFAULT_PAGE_DATA);
		}

		return NextResponse.json(data.content as Page);
	} catch (error) {
		console.error("ページ取得エラー:", error);
		return NextResponse.json(
			{ error: "ページデータの取得に失敗しました" },
			{ status: 500 }
		);
	}
}

// ページデータ保存
export async function POST(req: NextRequest) {
	try {
		const pageData = await req.json();

		// ページデータの検証
		if (
			!pageData ||
			!pageData.header ||
			!pageData.footer ||
			!Array.isArray(pageData.sections)
		) {
			return NextResponse.json(
				{ error: "無効なページデータです" },
				{ status: 400 }
			);
		}

		// HTML内容をサニタイズ（クライアント側でも行うが、サーバー側でも念のため）
		// サーバーサイドではDOMPurifyが動作しないので、実際のプロジェクトでは
		// サーバーサイド用のサニタイザー（例：jsdom + DOMPurify）を使用する必要がある

		// Supabaseがセットアップされていない場合はデータを保存せずに成功を返す
		if (
			!process.env.NEXT_PUBLIC_SUPABASE_URL ||
			!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
		) {
			return NextResponse.json({
				success: true,
				message: "Supabase未設定のため、データは保存されていません",
			});
		}

		// Supabaseにデータを保存
		const { data, error } = await supabase.from("pages").upsert(
			{
				id: "main", // 単一ページなのでidは固定
				content: pageData,
				updated_at: new Date().toISOString(),
			},
			{ onConflict: "id" }
		);

		if (error) {
			console.error("ページ保存エラー:", error);
			return NextResponse.json(
				{ error: "ページデータの保存に失敗しました" },
				{ status: 500 }
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("ページ保存エラー:", error);
		return NextResponse.json(
			{ error: "ページデータの保存に失敗しました" },
			{ status: 500 }
		);
	}
}
 