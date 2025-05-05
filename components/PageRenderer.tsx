"use client";

import { Page, Section } from "@/types";
import { sanitizeHtml } from "@/lib/sanitize";
import { useEffect, useState } from "react";

interface PageRendererProps {
	page: Page;
}

export function PageRenderer({ page }: PageRendererProps) {
	const [isMounted, setIsMounted] = useState(false);

	// コンポーネントがマウントされた後に処理を行う
	useEffect(() => {
		setIsMounted(true);

		// カスタムCSSをhead要素に適用する
		if (page.customCSS) {
			// 既存のカスタムCSSスタイル要素を削除
			const existingStyle = document.getElementById("custom-css");
			if (existingStyle) {
				existingStyle.remove();
			}

			// 新しいスタイル要素を作成して追加
			const style = document.createElement("style");
			style.id = "custom-css";
			style.textContent = page.customCSS;
			document.head.appendChild(style);
		}

		// コンポーネントがアンマウントされたときにスタイル要素を削除
		return () => {
			const style = document.getElementById("custom-css");
			if (style) {
				style.remove();
			}
		};
	}, [page.customCSS]);

	// サーバーサイドレンダリングと初期マウント時のずれを防ぐため
	// マウント前は単純なスケルトンUIを表示
	if (!isMounted) {
		return (
			<div className="min-h-screen bg-background">
				<header className="bg-white shadow-sm p-4">
					<div className="container mx-auto"></div>
				</header>
				<main className="min-h-screen">
					<div className="container mx-auto p-4">
						<div className="animate-pulse bg-gray-200 h-16 w-3/4 mb-4"></div>
						<div className="animate-pulse bg-gray-200 h-8 w-1/2 mb-4"></div>
						<div className="animate-pulse bg-gray-200 h-32 w-full mb-4"></div>
					</div>
				</main>
				<footer className="bg-gray-800 text-white p-4">
					<div className="container mx-auto"></div>
				</footer>
			</div>
		);
	}

	// セクションに応じたレンダリング
	const renderSection = (section: Section, index: number) => {
		const sectionClass = section.class || "";
		const bgStyle = section.bgImage
			? { backgroundImage: `url(${section.bgImage})` }
			: {};

		switch (section.layout) {
			case "mainVisual":
				return (
					<section
						key={index}
						className={`main-visual ${sectionClass}`}
						style={bgStyle}
					>
						<div className="container mx-auto px-4 py-12">
							{section.image && (
								<img
									src={section.image}
									alt="メインビジュアル"
									className="max-w-full rounded-lg mb-6"
								/>
							)}
							<div
								className="content"
								dangerouslySetInnerHTML={{
									__html: sanitizeHtml(section.html),
								}}
							/>
						</div>
					</section>
				);

			case "imgText":
				return (
					<section
						key={index}
						className={`img-text ${sectionClass}`}
						style={bgStyle}
					>
						<div className="container mx-auto px-4 py-12">
							<div className="flex flex-col md:flex-row items-center gap-8">
								{section.image && (
									<div className="md:w-1/2">
										<img
											src={section.image}
											alt="セクション画像"
											className="max-w-full rounded-lg"
										/>
									</div>
								)}
								<div
									className={
										section.image ? "md:w-1/2" : "w-full"
									}
								>
									<div
										className="content"
										dangerouslySetInnerHTML={{
											__html: sanitizeHtml(section.html),
										}}
									/>
								</div>
							</div>
						</div>
					</section>
				);

			case "cards":
				return (
					<section
						key={index}
						className={`cards ${sectionClass}`}
						style={bgStyle}
					>
						<div className="container mx-auto px-4 py-12">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{section.cards.map((card, cardIndex) => (
									<div
										key={cardIndex}
										className="card border rounded-lg overflow-hidden"
									>
										{card.image && (
											<img
												src={card.image}
												alt={`カード ${cardIndex + 1}`}
												className="w-full h-48 object-cover"
											/>
										)}
										<div className="p-4">
											<div
												className="content"
												dangerouslySetInnerHTML={{
													__html: sanitizeHtml(
														card.html
													),
												}}
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					</section>
				);

			case "form":
				return (
					<section
						key={index}
						className={`form ${sectionClass}`}
						style={bgStyle}
					>
						<div className="container mx-auto px-4 py-12">
							<div
								className="content mb-8"
								dangerouslySetInnerHTML={{
									__html: sanitizeHtml(section.html),
								}}
							/>
							<form
								action={section.endpoint || "/api/contact"}
								method="POST"
								className="max-w-2xl mx-auto"
							>
								<div className="mb-4">
									<label
										htmlFor="name"
										className="block mb-2 font-medium"
									>
										お名前
									</label>
									<input
										type="text"
										id="name"
										name="name"
										className="w-full p-2 border rounded"
										required
									/>
								</div>
								<div className="mb-4">
									<label
										htmlFor="email"
										className="block mb-2 font-medium"
									>
										メールアドレス
									</label>
									<input
										type="email"
										id="email"
										name="email"
										className="w-full p-2 border rounded"
										required
									/>
								</div>
								<div className="mb-4">
									<label
										htmlFor="message"
										className="block mb-2 font-medium"
									>
										メッセージ
									</label>
									<textarea
										id="message"
										name="message"
										rows={4}
										className="w-full p-2 border rounded"
										required
									></textarea>
								</div>
								<div className="mb-4">
									<label className="flex items-center">
										<input
											type="checkbox"
											name="privacy"
											className="mr-2"
											required
										/>
										<span>
											プライバシーポリシーに同意する
										</span>
									</label>
								</div>
								<button
									type="submit"
									className="px-4 py-2 bg-blue-500 text-white rounded font-medium"
								>
									送信
								</button>
							</form>
						</div>
					</section>
				);

			default:
				return (
					<section key={index} className="unknown-section">
						<div className="container mx-auto px-4 py-12">
							<p className="text-red-500">
								未知のセクションタイプです
							</p>
						</div>
					</section>
				);
		}
	};

	return (
		<>
			<header
				className="header"
				dangerouslySetInnerHTML={{
					__html: sanitizeHtml(page.header.html),
				}}
			/>

			<main className="min-h-screen">
				{page.sections.map((section, index) =>
					renderSection(section, index)
				)}
			</main>

			<footer
				className="footer"
				dangerouslySetInnerHTML={{
					__html: sanitizeHtml(page.footer.html),
				}}
			/>
		</>
	);
}
