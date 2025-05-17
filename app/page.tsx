import { PageRenderer } from "@/components/PageRenderer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Page } from "@/types";

// サーバーコンポーネント
export default async function Home() {
	// ページデータ取得
	let pageData: Page | null = null;

	try {
		// サーバーサイドコンポーネントではAPiルートではなく直接Supabaseクライアントを使用
		const apiData = await fetch(`/api/page`, {
			cache: "no-store",
			next: { revalidate: 0 },
		});

		if (apiData.ok) {
			pageData = await apiData.json();
		}
	} catch (error) {
		console.error("ページデータの取得に失敗しました", error);
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
 