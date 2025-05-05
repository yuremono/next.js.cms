"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Footer, Header, Page, Section } from "@/types";
import { HeaderEditor } from "@/components/sections/HeaderEditor";
import { FooterEditor } from "@/components/sections/FooterEditor";
import { SortableSections } from "@/components/SortableSections";
import { SectionSelector } from "@/components/SectionSelector";
import { SectionEditorRenderer } from "@/components/SectionEditorRenderer";
import { PageRenderer } from "@/components/PageRenderer";
import { Save, Plus, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { TextGenerator } from "@/components/TextGenerator";
import { ImageGallery } from "@/components/ImageGallery";
import { CSSEditor } from "@/components/sections/CSSEditor";

// デフォルトのセクションを作成する関数
const createDefaultSection = (type: string): Section => {
	switch (type) {
		case "mainVisual":
			return {
				layout: "mainVisual",
				class: "hero-section",
				html: "<h1>メインタイトル</h1><p>サブタイトル：ここにテキストを入力</p>",
				image: "",
			};
		case "imgText":
			return {
				layout: "imgText",
				class: "img-text-section",
				html: "<h2>セクションタイトル</h2><p>ここにテキストを入力します。</p>",
				image: "",
			};
		case "cards":
			return {
				layout: "cards",
				class: "cards-section",
				cards: [
					{
						html: "<h3>カード1</h3><p>カード1の内容</p>",
						image: "",
					},
				],
			};
		case "form":
			return {
				layout: "form",
				class: "form-section",
				html: "<h2>お問い合わせ</h2><p>以下のフォームよりお問い合わせください。</p>",
				endpoint: "/api/contact",
			};
		default:
			throw new Error(`未対応のセクションタイプ: ${type}`);
	}
};

export default function EditorPage() {
	// ページデータの状態
	const [page, setPage] = useState<Page>({
		header: {
			html: `<header class="bg-white shadow-sm">
  <div class=" mx-auto px-4 py-4 flex justify-between items-center">
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
		sections: [],
		customCSS: "",
	});

	// 選択中のセクションインデックス
	const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(
		null
	);

	// 選択中のメニュータブ
	const [activeMenuTab, setActiveMenuTab] = useState<string>("sections");

	// セクション追加ダイアログの状態
	const [isSelectorOpen, setIsSelectorOpen] = useState(false);

	// プレビューモードの状態
	const [previewMode, setPreviewMode] = useState(false);

	// ロード中の状態
	const [isLoading, setIsLoading] = useState(true);

	// データの保存中状態
	const [isSaving, setIsSaving] = useState(false);

	// 初期データの読み込み
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/api/page");
				if (response.ok) {
					const data = await response.json();
					setPage(data);
				}
			} catch (error) {
				console.error("ページデータの取得に失敗しました", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	// ヘッダーの更新
	const updateHeader = (header: Header) => {
		setPage((prev) => ({ ...prev, header }));
	};

	// フッターの更新
	const updateFooter = (footer: Footer) => {
		setPage((prev) => ({ ...prev, footer }));
	};

	// カスタムCSSの更新
	const updateCustomCSS = (customCSS: string) => {
		setPage((prev) => ({ ...prev, customCSS }));
	};

	// セクションの更新
	const updateSection = (index: number, section: Section) => {
		setPage((prev) => {
			const newSections = [...prev.sections];
			newSections[index] = section;
			return { ...prev, sections: newSections };
		});
	};

	// セクションの選択
	const handleSectionClick = (index: number) => {
		setActiveSectionIndex(index);
		setActiveMenuTab("edit");
	};

	// セクションの並び替え
	const moveSection = (fromIndex: number, toIndex: number) => {
		if (
			fromIndex < 0 ||
			fromIndex >= page.sections.length ||
			toIndex < 0 ||
			toIndex >= page.sections.length
		) {
			return;
		}

		setPage((prev) => {
			const newSections = [...prev.sections];
			const [movedSection] = newSections.splice(fromIndex, 1);
			newSections.splice(toIndex, 0, movedSection);
			return { ...prev, sections: newSections };
		});

		if (activeSectionIndex === fromIndex) {
			setActiveSectionIndex(toIndex);
		} else if (
			activeSectionIndex !== null &&
			((fromIndex < activeSectionIndex &&
				toIndex >= activeSectionIndex) ||
				(fromIndex > activeSectionIndex &&
					toIndex <= activeSectionIndex))
		) {
			setActiveSectionIndex(
				fromIndex < activeSectionIndex
					? activeSectionIndex - 1
					: activeSectionIndex + 1
			);
		}
	};

	// セクションの削除
	const deleteSection = (index: number) => {
		setPage((prev) => {
			const newSections = prev.sections.filter((_, i) => i !== index);
			return { ...prev, sections: newSections };
		});

		if (activeSectionIndex === index) {
			setActiveSectionIndex(null);
		} else if (activeSectionIndex !== null && index < activeSectionIndex) {
			setActiveSectionIndex(activeSectionIndex - 1);
		}
	};

	// セクションの追加
	const addSection = (type: string) => {
		try {
			const newSection = createDefaultSection(type);

			setPage((prev) => {
				const newSections = [...prev.sections, newSection];
				return { ...prev, sections: newSections };
			});

			// 新しく追加したセクションを選択
			setActiveSectionIndex(page.sections.length);
			setActiveMenuTab("edit");
			setIsSelectorOpen(false);
		} catch (error) {
			console.error("セクションの追加に失敗しました", error);
		}
	};

	// ページデータの保存
	const savePage = async () => {
		setIsSaving(true);

		try {
			const response = await fetch("/api/page", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(page),
			});

			if (!response.ok) {
				throw new Error("保存に失敗しました");
			}

			toast.success("ページが保存されました");
		} catch (error) {
			console.error("保存エラー:", error);
			toast.error("保存に失敗しました");
		} finally {
			setIsSaving(false);
		}
	};

	// タイプに応じた編集コンポーネントを表示
	const renderEditor = () => {
		switch (activeMenuTab) {
			case "header":
				return (
					<HeaderEditor
						header={page.header}
						onUpdate={updateHeader}
					/>
				);
			case "footer":
				return (
					<FooterEditor
						footer={page.footer}
						onUpdate={updateFooter}
					/>
				);
			case "css-editor":
				return (
					<CSSEditor
						initialCSS={page.customCSS || ""}
						onUpdate={updateCustomCSS}
					/>
				);
			case "ai-generator":
				return (
					<div className="space-y-6">
						<Card className="p-4">
							<h3 className="text-lg font-medium mb-4">
								AIテキスト生成
							</h3>
							<TextGenerator
								onSelect={(text) => {
									// テキストを生成して、クリップボードにコピー
									navigator.clipboard
										.writeText(text)
										.then(() => {
											toast.success(
												"テキストをクリップボードにコピーしました"
											);
										})
										.catch(() => {
											toast.error("コピーに失敗しました");
										});
								}}
							/>
							<div className="mt-4 text-sm text-gray-500">
								<p>
									生成したテキストは各セクションのHTMLエディタにコピー＆ペーストして使用できます。
								</p>
							</div>
						</Card>
					</div>
				);
			case "image-gallery":
				return <ImageGallery />;
			case "edit":
				if (
					activeSectionIndex !== null &&
					page.sections[activeSectionIndex]
				) {
					return (
						<SectionEditorRenderer
							section={page.sections[activeSectionIndex]}
							onUpdate={(updatedSection) =>
								updateSection(
									activeSectionIndex,
									updatedSection
								)
							}
						/>
					);
				}
				return (
					<div className="text-center p-8">
						<p className="text-gray-500 mb-4">
							編集するセクションを選択するか、新しいセクションを追加してください。
						</p>
						<Button onClick={() => setIsSelectorOpen(true)}>
							<Plus className="h-4 w-4 mr-2" />
							セクションを追加
						</Button>
					</div>
				);
			default:
				return null;
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
					<p className="mt-4">読み込み中...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col">
			{/* ヘッダー */}
			<header className="border-b bg-white shadow-sm">
				<div className="px-4 py-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link href="/">
							<Button variant="outline" size="icon">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<h1 className="text-xl font-bold">CMSエディタ</h1>
					</div>
					<div className="flex items-center gap-2">
						<Link href="/" target="_blank">
							<Button variant="outline">
								<Eye className="h-4 w-4 mr-2" />
								ページを開く
							</Button>
						</Link>
						<Button
							variant="outline"
							onClick={() => setPreviewMode(!previewMode)}
						>
							<Eye className="h-4 w-4 mr-2" />
							{previewMode ? "編集に戻る" : "プレビュー"}
						</Button>
						<Button onClick={savePage} disabled={isSaving}>
							<Save className="h-4 w-4 mr-2" />
							{isSaving ? "保存中..." : "保存"}
						</Button>
					</div>
				</div>
			</header>

			{previewMode ? (
				// プレビューモード
				<div className="flex-1 overflow-auto relative">
					<PageRenderer page={page} />
					<div className="fixed top-4 left-4 z-50">
						<Link href="/" target="_blank">
							<Button>
								<Eye className="h-4 w-4 mr-2" />
								ページを開く
							</Button>
						</Link>
					</div>
				</div>
			) : (
				// 編集モード
				<div className="flex-1 flex overflow-hidden">
					{/* サイドバー */}
					<div className="w-64 bg-gray-50 border-r overflow-y-auto">
						<div className="p-4">
							<Tabs
								value={activeMenuTab}
								onValueChange={setActiveMenuTab}
								className="w-full"
							>
								<TabsList className="grid w-full grid-cols-3 gap-1">
									<TabsTrigger value="header">
										ヘッダー
									</TabsTrigger>
									<TabsTrigger value="footer">
										フッター
									</TabsTrigger>
									<TabsTrigger value="css-editor">
										CSS追加
									</TabsTrigger>
									<TabsTrigger value="ai-generator">
										AIで生成
									</TabsTrigger>
									<TabsTrigger value="image-gallery">
										画像
									</TabsTrigger>
									<TabsTrigger value="sections">
										セクション
									</TabsTrigger>
								</TabsList>
							</Tabs>

							<div className="mt-4">
								{/* セクションリスト - 常に表示 */}
								<div className="space-y-4">
									<div className="flex justify-between items-center mb-3">
										<h2 className="text-sm font-medium">
											セクション ({page.sections.length})
										</h2>
										<Button
											size="sm"
											onClick={() =>
												setIsSelectorOpen(true)
											}
										>
											<Plus className="h-3 w-3 mr-1" />
											追加
										</Button>
									</div>
									<SortableSections
										sections={page.sections}
										activeSectionIndex={activeSectionIndex}
										onSectionClick={handleSectionClick}
										onSectionMove={moveSection}
										onSectionDelete={deleteSection}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* メインコンテンツ */}
					<div className="flex-1 overflow-y-auto p-6">
						{renderEditor()}
					</div>
				</div>
			)}

			{/* セクション追加ダイアログ */}
			<Dialog open={isSelectorOpen} onOpenChange={setIsSelectorOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogTitle>セクションを追加</DialogTitle>
					<SectionSelector onSelect={addSection} />
				</DialogContent>
			</Dialog>
		</div>
	);
}
