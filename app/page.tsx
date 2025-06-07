import { PageRenderer } from "@/components/PageRenderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Page } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// デフォルトページデータ（APIから取得できない場合のフォールバック）
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
			id: "section-default-1",
			layout: "mainVisual",
			class: "hero-section bg-gray-50",
			html: '<h1 class="text-4xl font-bold mb-4">簡易CMSシステム</h1><p class="text-xl">AIによるテキスト生成機能を備えた、テンプレートベースのWebサイト構築システムです。<br>ドラッグ＆ドロップでセクションを追加・入れ替えでき、簡単にWebサイトを編集できます。</p>',
			image: "",
		},
		{
			id: "section-default-2",
			layout: "imgText",
			class: "img-text-section",
			html: '<h2 class="text-2xl font-semibold mb-4">セクションタイトル</h2><p>ここにテキストを入力します。このページは管理画面から自由に編集することができます。画像やテキストの配置、セクションの追加・並べ替えなど、さまざまなカスタマイズが可能です。</p><p class="mt-4">AIテキスト生成機能を使えば、プロフェッショナルな文章を簡単に作成できます。</p>',
			image: "",
		},
		{
			id: "section-default-3",
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
			id: "section-default-4",
			layout: "form",
			class: "form-section",
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
		supabaseConfigured: isSupabaseConfigured,
		nodeEnv: process.env.NODE_ENV,
		buildTime: new Date().toISOString(), // デプロイ確認用
		version: "1.0.1", // バージョン追加
	});

	try {
		// APIではなく直接データを取得
		if (isSupabaseConfigured) {
			// 1. ページ本体
			const { data: page, error: pageError } = await supabase
				.from("pages")
				.select("*")
				.eq("id", 1)
				.single();

			if (pageError || !page) {
				pageData = DEFAULT_PAGE_DATA;
			} else {
				// 2. セクション一覧
				const { data: sections, error: secError } = await supabase
					.from("sections")
					.select("*")
					.eq("page_id", page.id)
					.order("position", { ascending: true });

				if (secError) {
					pageData = DEFAULT_PAGE_DATA;
				} else {
					// 3. 各セクションの詳細を取得
					const sectionResults = [];
					for (const section of sections) {
						if (section.type === "mainVisual") {
							const { data: mv } = await supabase
								.from("main_visual_sections")
								.select("*")
								.eq("section_id", section.id)
								.single();
							sectionResults.push({
								id: `section-${section.id}`,
								layout: "mainVisual",
								class: mv?.class ?? "",
								bgImage: mv?.bg_image ?? "",
								name: mv?.name ?? "",
								image: mv?.image ?? "",
								imageClass: mv?.image_class ?? "",
								textClass: mv?.text_class ?? "",
								html: mv?.html ?? "",
							});
						} else if (section.type === "imgText") {
							const { data: it } = await supabase
								.from("img_text_sections")
								.select("*")
								.eq("section_id", section.id)
								.single();
							sectionResults.push({
								id: `section-${section.id}`,
								layout: "imgText",
								class: it?.class ?? "",
								bgImage: it?.bg_image ?? "",
								name: it?.name ?? "",
								image: it?.image ?? "",
								imageClass: it?.image_class ?? "",
								textClass: it?.text_class ?? "",
								html: it?.html ?? "",
							});
						} else if (section.type === "cards") {
							const { data: cs } = await supabase
								.from("cards_sections")
								.select("*")
								.eq("section_id", section.id)
								.single();
							const { data: cards } = await supabase
								.from("cards")
								.select("*")
								.eq("cards_section_id", section.id)
								.order("position", { ascending: true });
							sectionResults.push({
								id: `section-${section.id}`,
								layout: "cards",
								class: cs?.class ?? "",
								bgImage: cs?.bg_image ?? "",
								name: cs?.name ?? "",
								cards: (cards ?? []).map((c) => ({
									image: c.image ?? "",
									imageClass: c.image_class ?? "",
									textClass: c.text_class ?? "",
									html: c.html ?? "",
								})),
							});
						} else if (section.type === "form") {
							const { data: fs } = await supabase
								.from("form_sections")
								.select("*")
								.eq("section_id", section.id)
								.single();
							sectionResults.push({
								id: `section-${section.id}`,
								layout: "form",
								class: fs?.class ?? "",
								bgImage: fs?.bg_image ?? "",
								name: fs?.name ?? "",
								html: fs?.html ?? "",
								endpoint: fs?.endpoint ?? "",
							});
						}
					}

					// 4. 組み立て
					pageData = {
						header: { html: page.header_html },
						footer: { html: page.footer_html },
						customCSS: page.custom_css,
						sections: sectionResults,
					};
				}
			}
		} else {
			// Supabase未設定ならデフォルトデータ
			console.log("Supabase設定なし、デフォルトデータを使用");
			pageData = DEFAULT_PAGE_DATA;
		}
	} catch (error) {
		console.error("ページデータの取得に失敗しました", error);
		pageData = null;
	}

	// データが取得できなかった場合のデフォルト表示
	if (!pageData) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen p-8">
				<h1 className="text-2xl font-bold mb-4">
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

	return <PageRenderer page={modifiedPageData} />;
}
 