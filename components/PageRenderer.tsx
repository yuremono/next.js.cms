// 'use client' を削除
// useEffect, useState, isMounted判定を削除
// propsで受け取ったpageデータのみで描画

import { Page, Section } from "@/types";
import Image from "next/image";
import { CSSProperties } from "react";
import {
  resolveTagType,
  extractHtmlContents,
  analyzeMultipleHtmlContents,
} from "@/lib/html-tag-utils";
import { MediaRenderer } from "@/components/MediaRenderer";
import "../app/top.scss";

interface PageRendererProps {
  page: Page;
  showEditorButton?: boolean;
}

// CSS変数をカスタムCSSから抽出する関数（現在未使用：CSSファイルから読み込むため）
/*
function extractCSSVariables(customCSS: string): {
  variables: string;
  remainingCSS: string;
} {
  if (!customCSS) return { variables: "", remainingCSS: "" };

  // :root { ... } ブロックを検索
  const rootRegex = /:root\s*\{([^}]*)\}/g;
  let variables = "";
  let remainingCSS = customCSS;

  let match;
  while ((match = rootRegex.exec(customCSS)) !== null) {
    const rootContent = match[1];
    // 設定した変数のみを抽出（--base, --head, --sectionMT, etc.）
    const variableLines = rootContent.split("\n").filter((line) => {
      const trimmed = line.trim();
      return (
        trimmed &&
        (trimmed.includes("--base:") ||
          trimmed.includes("--head:") ||
          trimmed.includes("--sectionMT:") ||
          trimmed.includes("--titleAfter:") ||
          trimmed.includes("--sectionPY:") ||
          trimmed.includes("--spaceX:") ||
          trimmed.includes("--gap:") ||
          trimmed.includes("--mc:") ||
          trimmed.includes("--sc:") ||
          trimmed.includes("--ac:") ||
          trimmed.includes("--bc:") ||
          trimmed.includes("--tx:"))
      );
    });

    if (variableLines.length > 0) {
      variables = `:root {\n${variableLines.join("\n")}\n}`;
    }

    // :rootブロックを残りのCSSから削除
    remainingCSS = remainingCSS.replace(match[0], "");
  }

  return { variables: variables.trim(), remainingCSS: remainingCSS.trim() };
}
*/

export function PageRenderer({ page }: PageRendererProps) {
  // CSS変数とカスタムCSSを分離
  // CSS変数を抽出（コメントアウト：CSSファイルから読み込むため不要）
  // const { variables, remainingCSS } = extractCSSVariables(page.customCSS || "");

  // グループ構造を解析してレンダリング
  function parseScopeStylesToStyleObject(
    declarations: string
  ): Record<string, string> {
    // 例: "--gap: 40px; --bg: #fff" → { "--gap": "40px", "--bg": "#fff" }
    const styleObject: Record<string, string> = {};
    if (!declarations) return styleObject;
    // 分割: セミコロンで区切る
    const parts = declarations
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    for (const part of parts) {
      const idx = part.indexOf(":");
      if (idx === -1) continue;
      const rawKey = part.slice(0, idx).trim();
      const rawVal = part.slice(idx + 1).trim();
      if (!rawKey) continue;
      // CSSカスタムプロパティ（--で始まる）を優先してそのまま保存
      styleObject[rawKey] = rawVal;
    }
    return styleObject;
  }

  const renderSectionsWithGroups = () => {
    const result = [];
    let i = 0;

    while (i < page.sections.length) {
      const section = page.sections[i];

      if (section.layout === "group-start") {
        // グループ開始を見つけたら、対応する終了まで探す
        const groupStartSection = section as {
          layout: "group-start";
          class?: string;
          bgImage?: string;
          scopeStyles?: string;
          sectionWidth?: string;
        };
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
          const bgStyle: CSSProperties = groupStartSection.bgImage
            ? { backgroundImage: `url(${groupStartSection.bgImage})` }
            : {};
          const scopeStyles = groupStartSection.scopeStyles || "";

          // グループ幅のCSS変数を追加
          const groupWidthStyle = groupStartSection.sectionWidth
            ? { "--base": groupStartSection.sectionWidth }
            : {};

          // スタイルを統合
          let combinedGroupStyle: Record<string, string> | CSSProperties = {
            ...bgStyle,
            ...groupWidthStyle,
          } as CSSProperties;
          if (scopeStyles) {
            const parsedScopeStyles =
              parseScopeStylesToStyleObject(scopeStyles);
            combinedGroupStyle = {
              ...combinedGroupStyle,
              ...parsedScopeStyles,
            };
          }

          // グループレベルのタグタイプ判定：グループ内全HTMLコンテンツで判定
          const allGroupHtmlContents: (string | undefined)[] = [];
          groupSections.forEach((groupSection) => {
            const sectionContents = extractHtmlContents(groupSection);
            allGroupHtmlContents.push(...sectionContents);
          });
          const GroupTagType = analyzeMultipleHtmlContents(
            allGroupHtmlContents
          ) as keyof JSX.IntrinsicElements;

          result.push(
            <GroupTagType
              key={`group-${i}`}
              className={sectionClass}
              style={combinedGroupStyle}
            >
              {groupSections.map((groupSection, idx) =>
                renderSection(groupSection, `${i}-${idx}`, true)
              )}
            </GroupTagType>
          );

          // グループ全体をスキップ
          i = groupEndIndex + 1;
        } else {
          // 対応する終了タグがない場合は警告として出力
          result.push(
            <div
              key={i}
              className="border border-red-400 bg-red-100 p-4 text-red-700"
            >
              警告: グループ開始タグに対応する終了タグがありません
            </div>
          );
          i++;
        }
      } else if (section.layout === "group-end") {
        // 対応する開始タグがない終了タグ
        result.push(
          <div
            key={i}
            className="border border-red-400 bg-red-100 p-4 text-red-700"
          >
            警告: 対応する開始タグがない終了タグです
          </div>
        );
        i++;
      } else {
        // 通常のセクション
        result.push(renderSection(section, i, false));
        i++;
      }
    }

    return result;
  };

  const renderSection = (
    section: Section,
    index: number | string,
    isInsideGroup: boolean = false
  ) => {
    const sectionClass = section.class || "";
    const bgStyle = section.bgImage
      ? { backgroundImage: `url(${section.bgImage})` }
      : {};

    // セクション幅のCSS変数を追加
    const sectionWidthStyle = section.sectionWidth
      ? { "--base": section.sectionWidth }
      : {};
    const combinedStyle = { ...bgStyle, ...sectionWidthStyle };

    // 動的タグ選択（section または div）
    const TagType = resolveTagType(
      section,
      undefined,
      isInsideGroup
    ) as keyof JSX.IntrinsicElements;

    switch (section.layout) {
      case "mainVisual":
        return (
          <TagType
            key={index}
            className={`MainVisual ${sectionClass}`}
            style={combinedStyle}
          >
            {section.image && (
              <div
                className={`relative ${section.imageClass || ""}`}
                style={{
                  aspectRatio: section.imageAspectRatio || "auto",
                  minHeight: section.imageAspectRatio ? "auto" : "500px",
                }}
              >
                <MediaRenderer
                  src={section.image}
                  alt="Main Visual"
                  fill
                  className="object-cover"
                  priority
                  style={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
              </div>
            )}
            <div
              className={`  ${section.textClass || ""}`}
              dangerouslySetInnerHTML={{
                __html: section.html,
              }}
            />
          </TagType>
        );
      case "imgText":
        return (
          <TagType
            key={index}
            className={`ImgText  grid grid-cols-1 items-center gap-8 md:grid-cols-2 ${sectionClass}`}
            style={combinedStyle}
          >
            {section.image && (
              <div
                className={`relative ${section.imageClass || ""}`}
                style={{
                  aspectRatio: section.imageAspectRatio || "auto",
                }}
              >
                <MediaRenderer
                  src={section.image}
                  alt="Section Image"
                  fill
                  className="rounded-lg object-cover"
                  style={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
              </div>
            )}
            <div className={!section.image ? "" : ""}>
              <div
                className={`  ${section.textClass || ""}`}
                dangerouslySetInnerHTML={{
                  __html: section.html,
                }}
              />
            </div>
          </TagType>
        );
      case "cards":
        return (
          <TagType
            key={index}
            className={`Cards  ${sectionClass}`}
            style={combinedStyle}
          >
            {section.cards.map((card, idx) => (
              <div key={card.id || idx} className={card.cardClass || ""}>
                {card.image && (
                  <div
                    className={`relative w-full ${card.imageClass || ""}`}
                    style={{
                      aspectRatio: card.imageAspectRatio || "auto",
                      minHeight: card.imageAspectRatio ? "auto" : "200px",
                    }}
                  >
                    <MediaRenderer
                      src={card.image}
                      alt={`Card ${idx + 1}`}
                      fill
                      className="object-cover"
                      style={{
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                      }}
                    />
                  </div>
                )}
                <div
                  className={`  ${card.textClass || ""}`}
                  dangerouslySetInnerHTML={{
                    __html: card.html,
                  }}
                />
              </div>
            ))}
          </TagType>
        );
      case "descList":
        return (
          <TagType
            key={index}
            className={`DescList ${sectionClass}`}
            style={combinedStyle}
          >
            {section.title && section.title.trim() && (
              <h2
                className="mb-4 text-xl font-semibold"
                dangerouslySetInnerHTML={{ __html: section.title }}
              />
            )}
            <div
              dangerouslySetInnerHTML={{
                __html: section.html,
              }}
            />
          </TagType>
        );
      case "htmlContent":
        return (
          <TagType
            key={index}
            className={`HtmlContent ${sectionClass}`}
            style={combinedStyle}
            dangerouslySetInnerHTML={{ __html: section.html }}
          />
        );
      case "form":
        return (
          <TagType
            key={index}
            className={`Form   ${sectionClass}`}
            style={combinedStyle}
          >
            <div
              className={`  mb-8 ${section.textClass || ""}`}
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
          </TagType>
        );
      // group-start と group-end は個別レンダリングでは処理しない
      case "group-start":
      case "group-end":
        return null;
      default:
        return (
          <TagType key={index} className="unknown-section">
            <div className="container mx-auto ">
              <p className="text-red-500">未知のセクションタイプです</p>
            </div>
          </TagType>
        );
    }
  };

  return (
    <>
      <header
        className="header relative"
        dangerouslySetInnerHTML={{ __html: page.header.html }}
      />
      {/* エディタを開くボタン */}
      {/* {showEditorButton && (
        <div className="fixed right-4 top-4 z-50">
          <a
            href="/editor"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2  font-medium text-primary-foreground shadow"
          >
            エディタを開く
          </a>
        </div>
      )} */}
      <main className="min-h-screen">{renderSectionsWithGroups()}</main>
      <footer
        className="footer"
        dangerouslySetInnerHTML={{ __html: page.footer.html }}
      />
    </>
  );
}
