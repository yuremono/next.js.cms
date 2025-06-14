// 'use client' を削除
// useEffect, useState, isMounted判定を削除
// propsで受け取ったpageデータのみで描画

import { Page, Section } from "@/types";
import Image from "next/image";
import "../app/top.scss";

interface PageRendererProps {
  page: Page;
  showEditorButton?: boolean;
}

export function PageRenderer({
  page,
  showEditorButton = false,
}: PageRendererProps) {
  // グループ構造を解析してレンダリング
  const renderSectionsWithGroups = () => {
    const result = [];
    let i = 0;
    
    while (i < page.sections.length) {
      const section = page.sections[i];
      
      if (section.layout === "group-start") {
        // グループ開始を見つけたら、対応する終了まで探す
        const groupStartSection = section as any;
        const groupSections = [];
        let groupEndIndex = -1;
        
        // 対応する終了タグを探す
        for (let j = i + 1; j < page.sections.length; j++) {
          if (page.sections[j].layout === "group-end") {
            groupEndIndex = j;
            break;
          } else if (page.sections[j].layout !== "group-start") {
            // 通常のセクションをグループに追加
            groupSections.push(page.sections[j]);
          }
        }
        
        if (groupEndIndex !== -1) {
          // グループとして出力
          const sectionClass = groupStartSection.class || "";
          const bgStyle = groupStartSection.bgImage
            ? { backgroundImage: `url(${groupStartSection.bgImage})` }
            : {};
          const scopeStyles = groupStartSection.scopeStyles || "";
          
          result.push(
            <article
              key={`group-${i}`}
              className={sectionClass}
              style={{ ...bgStyle }}
              {...(scopeStyles ? { style: scopeStyles } : {})}
            >
              {groupSections.map((groupSection, idx) => 
                renderSection(groupSection, `${i}-${idx}`)
              )}
            </article>
          );
          
          // グループ全体をスキップ
          i = groupEndIndex + 1;
        } else {
          // 対応する終了タグがない場合は警告として出力
          result.push(
            <div key={i} className="bg-red-100 border border-red-400 p-4 text-red-700">
              警告: グループ開始タグに対応する終了タグがありません
            </div>
          );
          i++;
        }
      } else if (section.layout === "group-end") {
        // 対応する開始タグがない終了タグ
        result.push(
          <div key={i} className="bg-red-100 border border-red-400 p-4 text-red-700">
            警告: 対応する開始タグがない終了タグです
          </div>
        );
        i++;
      } else {
        // 通常のセクション
        result.push(renderSection(section, i));
        i++;
      }
    }
    
    return result;
  };

  const renderSection = (section: Section, index: number | string) => {
    const sectionClass = section.class || "";
    const bgStyle = section.bgImage
      ? { backgroundImage: `url(${section.bgImage})` }
      : {};

    switch (section.layout) {
      case "mainVisual":
        return (
          <section
            key={index}
            className={`MainVisual ${sectionClass}`}
            style={bgStyle}
          >
            <div className=" mx-auto ">
              {section.image && (
                <div
                  className={`relative w-full ${section.imageClass || ""}`}
                  style={{
                    aspectRatio: section.imageAspectRatio || "auto",
                    minHeight: section.imageAspectRatio ? "auto" : "500px",
                  }}
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
            className={`ImgText ${sectionClass}`}
            style={bgStyle}
          >
            <div className="container mx-auto">
              <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                <div>
                {section.image && (
                  <div
                    className={`relative w-full ${section.imageClass || ""}`}
                    style={{
                      aspectRatio: section.imageAspectRatio || "auto",
                    }}
                  >
                    <Image
                      src={section.image}
                      alt="Section Image"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                </div>
                <div className={!section.image ? "w-full" : ""}>
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
            className={`Cards ${sectionClass}`}
            style={bgStyle}
          >
            <div className="CardsContainer">
              {section.cards.map((card, idx) => (
                <div key={idx}>
                  {card.image && (
                    <div
                      className={`relative w-full ${card.imageClass || ""}`}
                      style={{
                        aspectRatio: card.imageAspectRatio || "auto",
                        minHeight: card.imageAspectRatio ? "auto" : "200px",
                      }}
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
          </section>
        );
      case "form":
        return (
          <section
            key={index}
            className={`Form ${sectionClass}`}
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
                  className="rounded bg-slate-700 px-4 py-2 font-medium text-white"
                >
                  送信
                </button>
              </form>
            </div>
          </section>
        );
      // group-start と group-end は個別レンダリングでは処理しない
      case "group-start":
      case "group-end":
        return null;
      default:
        return (
          <section key={index} className="unknown-section">
            <div className="container mx-auto ">
              <p className="text-red-500">未知のセクションタイプです</p>
            </div>
          </section>
        );
    }
  };

  return (
    <>
      {/* カスタムCSS */}
      {page.customCSS && (
        <style dangerouslySetInnerHTML={{ __html: page.customCSS }} />
      )}
      <header className="header relative">
        <div dangerouslySetInnerHTML={{ __html: page.header.html }} />
        {showEditorButton && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 transform">
            <a
              href="/editor"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow"
            >
              エディタを開く
            </a>
          </div>
        )}
      </header>
      <main className="min-h-screen">
        {renderSectionsWithGroups()}
      </main>
      <footer
        className="footer"
        dangerouslySetInnerHTML={{ __html: page.footer.html }}
      />
    </>
  );
}
