import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
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
	// レスポンスヘッダーを設定
	const headers = {
		"Cache-Control": "no-store, max-age=0",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
	};

	// 環境変数の状態をログ出力（デバッグ用）
	console.log("環境変数設定状態:", {
		supabaseConfigured: isSupabaseConfigured,
		nodeEnv: process.env.NODE_ENV,
		appUrl: process.env.NEXT_PUBLIC_APP_URL || "未設定",
	});

	try {
		// Supabaseが設定されていない場合はデフォルトデータを返す
		if (!isSupabaseConfigured) {
			console.log("Supabase設定がないため、デフォルトデータを返します");
			return NextResponse.json(DEFAULT_PAGE_DATA, { headers });
		}

		// 1. ページ本体
		const { data: page, error: pageError } = await supabase
			.from("pages")
			.select("*")
			.eq("id", 1)
			.single();

		if (pageError || !page) {
			return NextResponse.json(DEFAULT_PAGE_DATA, { headers });
		}

		// 2. セクション一覧
		const { data: sections, error: secError } = await supabase
			.from("sections")
			.select("*")
			.eq("page_id", page.id)
			.order("position", { ascending: true });

		if (secError) {
			return NextResponse.json(DEFAULT_PAGE_DATA, { headers });
		}

		// 3. 各セクションの詳細をtypeごとに取得・組み立て
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

		// 4. 組み立てて返す
		return NextResponse.json(
			{
				header: { html: page.header_html },
				footer: { html: page.footer_html },
				customCSS: page.custom_css,
				sections: sectionResults,
			},
			{ headers }
		);
	} catch (error) {
		console.error("ページ取得エラー:", error);
		return NextResponse.json(
			{ error: "ページデータの取得に失敗しました" },
			{ status: 500, headers }
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

		// トランザクション開始
		const { data: page, error: pageError } = await supabase
			.from("pages")
			.upsert({
				id: 1,
				header_html: pageData.header.html,
				footer_html: pageData.footer.html,
				custom_css: pageData.customCSS,
			})
			.select()
			.single();

		if (pageError) {
			return NextResponse.json(
				{ error: "ページ保存失敗" },
				{ status: 500 }
			);
		}

		// 既存のセクションを取得
		const { data: existingSections } = await supabase
			.from("sections")
			.select("id, type")
			.eq("page_id", page.id);

		// 既存のセクションを削除
		if (existingSections && existingSections.length > 0) {
			// 各セクションタイプごとに削除
			for (const section of existingSections) {
				if (section.type === "mainVisual") {
					await supabase
						.from("main_visual_sections")
						.delete()
						.eq("section_id", section.id);
				} else if (section.type === "imgText") {
					await supabase
						.from("img_text_sections")
						.delete()
						.eq("section_id", section.id);
				} else if (section.type === "cards") {
					// カードを先に削除
					await supabase
						.from("cards")
						.delete()
						.eq("cards_section_id", section.id);
					await supabase
						.from("cards_sections")
						.delete()
						.eq("section_id", section.id);
				} else if (section.type === "form") {
					await supabase
						.from("form_sections")
						.delete()
						.eq("section_id", section.id);
				}
			}

			// セクション本体を削除
			await supabase.from("sections").delete().eq("page_id", page.id);
		}

		// 新しいセクションを保存
		for (const [i, section] of pageData.sections.entries()) {
			// sections共通
			const { data: sec, error: secError } = await supabase
				.from("sections")
				.insert({
					page_id: page.id,
					type: section.layout,
					position: i,
				})
				.select()
				.single();

			if (secError) {
				return NextResponse.json(
					{ error: "セクション保存失敗" },
					{ status: 500 }
				);
			}

			// typeごとに固有テーブルも保存
			if (section.layout === "mainVisual") {
				await supabase.from("main_visual_sections").insert({
					section_id: sec.id,
					class: section.class,
					bg_image: section.bgImage,
					name: section.name,
					image: section.image ?? null,
					html: section.html,
				});
			}
			if (section.layout === "imgText") {
				await supabase.from("img_text_sections").insert({
					section_id: sec.id,
					class: section.class,
					bg_image: section.bgImage,
					name: section.name,
					image: section.image ?? null,
					html: section.html,
				});
			}
			if (section.layout === "cards") {
				await supabase.from("cards_sections").insert({
					section_id: sec.id,
					class: section.class,
					bg_image: section.bgImage,
					name: section.name,
				});
				// cards本体
				for (const [j, card] of (section.cards ?? []).entries()) {
					await supabase.from("cards").insert({
						cards_section_id: sec.id,
						image: card.image ?? null,
						html: card.html,
						position: j,
					});
				}
			}
			if (section.layout === "form") {
				await supabase.from("form_sections").insert({
					section_id: sec.id,
					class: section.class,
					bg_image: section.bgImage,
					name: section.name,
					html: section.html,
					endpoint: section.endpoint,
				});
			}
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("保存エラー:", error);
		return NextResponse.json(
			{ error: "保存処理中にエラーが発生しました" },
			{ status: 500 }
		);
	}
}
 