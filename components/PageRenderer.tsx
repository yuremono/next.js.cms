// 'use client' を削除
// useEffect, useState, isMounted判定を削除
// propsで受け取ったpageデータのみで描画

import { Page, Section } from "@/types";
import Image from "next/image";

interface PageRendererProps {
	page: Page;
}

export function PageRenderer({ page }: PageRendererProps) {
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
								<div className="relative w-full h-[500px]">
									<Image
										src={section.image}
										alt="Main Visual"
										fill
										className="object-cover"
										priority
									/>
								</div>
							)}
							<div
								className="content"
								dangerouslySetInnerHTML={{
									__html: section.html,
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
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
								{section.image && (
									<div className="relative w-full h-[400px]">
										<Image
											src={section.image}
											alt="Section Image"
											fill
											className="object-cover rounded-lg"
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
											__html: section.html,
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
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
								{section.cards.map((card, idx) => (
									<div
										key={idx}
										className="bg-white rounded-lg shadow-lg overflow-hidden"
									>
										{card.image && (
											<div className="relative w-full h-[200px]">
												<Image
													src={card.image}
													alt={`Card ${idx + 1}`}
													fill
													className="object-cover"
												/>
											</div>
										)}
										<div className="p-6">
											<div
												className="content"
												dangerouslySetInnerHTML={{
													__html: card.html,
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
									__html: section.html,
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
									className="px-4 py-2 bg-blue-900 text-white rounded font-medium"
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
				dangerouslySetInnerHTML={{ __html: page.header.html }}
			/>
			<main className="min-h-screen">
				{page.sections.map((section, index) =>
					renderSection(section, index)
				)}
			</main>
			<footer
				className="footer"
				dangerouslySetInnerHTML={{ __html: page.footer.html }}
			/>
		</>
	);
}
