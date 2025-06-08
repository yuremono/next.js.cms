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
            <div className="container mx-auto ">
              {section.image && (
                <div
                  className={`relative h-[500px] w-full ${section.imageClass || ""}`}
                >
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
                className={`content ${section.textClass || ""}`}
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
            <div className="container mx-auto ">
              <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                {section.image && (
                  <div
                    className={`relative h-[400px] w-full ${section.imageClass || ""}`}
                  >
                    <Image
                      src={section.image}
                      alt="Section Image"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                <div className={section.image ? "md:w-1/2" : "w-full"}>
                  <div
                    className={`content ${section.textClass || ""}`}
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
            <div className="container mx-auto ">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {section.cards.map((card, idx) => (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-lg bg-white shadow-lg"
                  >
                    {card.image && (
                      <div
                        className={`relative h-[200px] w-full ${card.imageClass || ""}`}
                      >
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
                        className={`content ${card.textClass || ""}`}
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
            <div className="container mx-auto ">
              <div
                className={`content mb-8 ${section.textClass || ""}`}
                dangerouslySetInnerHTML={{
                  __html: section.html,
                }}
              />
              <form
                action={section.endpoint || "/api/contact"}
                method="POST"
                className="mx-auto max-w-2xl"
              >
                <div className="mb-4">
                  <label htmlFor="name" className="mb-2 block font-medium">
                    お名前
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full rounded border p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="mb-2 block font-medium">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full rounded border p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="mb-2 block font-medium">
                    メッセージ
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full rounded border p-2"
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
                    <span>プライバシーポリシーに同意する</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="rounded bg-blue-900 px-4 py-2 font-medium text-white"
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
						<div className="container mx-auto ">
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
