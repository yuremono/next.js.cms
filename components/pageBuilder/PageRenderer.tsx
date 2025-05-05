"use client";

import { useState, useEffect } from "react";
import { Section, Page } from "@/types";
import { toast } from "sonner";
import Head from "next/head";

interface PageRendererProps {
	pageData: Page;
}

export function PageRenderer({ pageData }: PageRendererProps) {
	const [page, setPage] = useState<Page>(pageData);
	const [cssInserted, setCssInserted] = useState(false);

	// カスタムCSSをヘッドに挿入
	useEffect(() => {
		if (!page?.customCss) return;

		// 既存のスタイルタグがあれば削除
		const existingStyle = document.getElementById("custom-css");
		if (existingStyle) {
			existingStyle.remove();
		}

		// 新しいスタイルタグを作成
		const style = document.createElement("style");
		style.id = "custom-css";
		style.textContent = page.customCss;
		document.head.appendChild(style);

		setCssInserted(true);

		// クリーンアップ関数
		return () => {
			const styleToRemove = document.getElementById("custom-css");
			if (styleToRemove) {
				styleToRemove.remove();
			}
		};
	}, [page?.customCss]);

	// ページデータが更新された場合
	useEffect(() => {
		setPage(pageData);
	}, [pageData]);

	if (!page) {
		return (
			<div className="p-8 text-center">ページが見つかりませんでした</div>
		);
	}

	// ページデータからヘッダーとフッターを取得
	const header = page.header?.html || "";
	const footer = page.footer?.html || "";

	// セクションのレンダリング
	const renderSection = (section: Section, index: number) => {
		const { type, id } = section;

		// セクションの背景画像スタイル
		const bgImageStyle = section.bgImage
			? {
					backgroundImage: `url(${section.bgImage})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
			  }
			: {};

		// セクションのクラスとスタイル
		const sectionClass = "section relative";
		const sectionStyle = { ...bgImageStyle };

		switch (type) {
			case "text":
				return (
					<section
						key={id}
						id={`section-${id}`}
						className={sectionClass}
						style={sectionStyle}
					>
						<div
							className="container mx-auto px-4 py-12"
							dangerouslySetInnerHTML={{ __html: section.html }}
						/>
					</section>
				);

			case "main-visual":
				return (
					<section
						key={id}
						id={`section-${id}`}
						className={`${sectionClass} min-h-[50vh] flex items-center`}
						style={sectionStyle}
					>
						<div
							className="container mx-auto px-4 py-12 text-center"
							dangerouslySetInnerHTML={{ __html: section.html }}
						/>
					</section>
				);

			case "img-text":
				return (
					<section
						key={id}
						id={`section-${id}`}
						className={sectionClass}
						style={sectionStyle}
					>
						<div className="container mx-auto px-4 py-12">
							<div className="flex flex-col md:flex-row items-center gap-8">
								{section.image && (
									<div className="w-full md:w-1/2">
										<img
											src={section.image}
											alt=""
											className="max-w-full h-auto rounded"
										/>
									</div>
								)}
								<div
									className={
										section.image
											? "w-full md:w-1/2"
											: "w-full"
									}
									dangerouslySetInnerHTML={{
										__html: section.html,
									}}
								/>
							</div>
						</div>
					</section>
				);

			case "cards":
				return (
					<section
						key={id}
						id={`section-${id}`}
						className={sectionClass}
						style={sectionStyle}
					>
						<div className="container mx-auto px-4 py-12">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{section.cards.map((card, cardIndex) => (
									<div
										key={`card-${cardIndex}`}
										className="card border rounded-lg overflow-hidden bg-white shadow-sm"
									>
										{card.image && (
											<div className="card-image">
												<img
													src={card.image}
													alt=""
													className="w-full h-48 object-cover"
												/>
											</div>
										)}
										<div
											className="card-content p-4"
											dangerouslySetInnerHTML={{
												__html: card.html,
											}}
										/>
									</div>
								))}
							</div>
						</div>
					</section>
				);

			case "form":
				return (
					<section
						key={id}
						id={`section-${id}`}
						className={sectionClass}
						style={sectionStyle}
					>
						<div className="container mx-auto px-4 py-12">
							{section.html && (
								<div
									className="mb-8"
									dangerouslySetInnerHTML={{
										__html: section.html,
									}}
								/>
							)}
							<div className="max-w-lg mx-auto">
								{/* フォームコンポーネント */}
								<div className="p-4 border rounded-lg bg-white shadow-sm">
									<form
										action={
											section.endpoint || "/api/contact"
										}
										method="POST"
										className="space-y-4"
									>
										<div>
											<label
												htmlFor="name"
												className="block text-sm font-medium mb-1"
											>
												お名前
											</label>
											<input
												type="text"
												id="name"
												name="name"
												required
												className="w-full px-3 py-2 border rounded"
											/>
										</div>

										<div>
											<label
												htmlFor="email"
												className="block text-sm font-medium mb-1"
											>
												メールアドレス
											</label>
											<input
												type="email"
												id="email"
												name="email"
												required
												className="w-full px-3 py-2 border rounded"
											/>
										</div>

										<div>
											<label
												htmlFor="message"
												className="block text-sm font-medium mb-1"
											>
												メッセージ
											</label>
											<textarea
												id="message"
												name="message"
												rows={5}
												required
												className="w-full px-3 py-2 border rounded"
											></textarea>
										</div>

										<div className="flex items-start space-x-2">
											<input
												type="checkbox"
												id="agree"
												name="agree"
												required
												className="mt-1"
											/>
											<label
												htmlFor="agree"
												className="text-sm"
											>
												利用規約とプライバシーポリシーに同意します
											</label>
										</div>

										<button
											type="submit"
											className="w-full py-2 px-4 bg-primary text-white font-medium rounded"
										>
											送信する
										</button>
									</form>
								</div>
							</div>
						</div>
					</section>
				);

			default:
				return null;
		}
	};

	return (
		<div className="page-renderer">
			{/* ヘッダー */}
			<header
				className="site-header bg-white shadow-sm"
				dangerouslySetInnerHTML={{ __html: header }}
			/>

			{/* メインコンテンツ */}
			<main className="site-main">
				{page.sections.map((section, index) =>
					renderSection(section, index)
				)}
			</main>

			{/* フッター */}
			<footer
				className="site-footer bg-gray-800 text-white py-8"
				dangerouslySetInnerHTML={{ __html: footer }}
			/>
		</div>
	);
}
