"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SimpleHtmlEditor } from "@/components/ui/simple-html-editor";
import { VariableField } from "@/components/ui/variable-field";
import { VariableColorField } from "@/components/ui/variable-color-field";
import { ChevronDown } from "lucide-react";

interface CSSEditorProps {
  initialCSS: string;
  onUpdate: (css: string) => void;
}

interface CSSVariables {
  // レイアウト関連
  contentMaxWidth: string;
  headerHeight: string;
  sectionSpacing: string;
  titleMarginBottom: string;
  sectionPaddingY: string;
  sectionPaddingX: string;
  cardGap: string;

  // カラー関連
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  baseColor: string;
  textColor: string;
}

export function CSSEditor({ initialCSS, onUpdate }: CSSEditorProps) {
  const [css, setCSS] = useState(initialCSS || "");

  // CSS変数の状態（デフォルト値なし）
  const [cssVariables, setCssVariables] = useState<CSSVariables>({
    contentMaxWidth: "",
    headerHeight: "",
    sectionSpacing: "",
    titleMarginBottom: "",
    sectionPaddingY: "",
    sectionPaddingX: "",
    cardGap: "",
    primaryColor: "",
    secondaryColor: "",
    accentColor: "",
    baseColor: "",
    textColor: "",
  });

  // 変数設定セクションの開閉状態
  const [isVariablesOpen, setIsVariablesOpen] = useState(false);

  // デバウンス用のタイマーref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 初期CSSが更新された場合に状態を更新
  useEffect(() => {
    setCSS(initialCSS || "");
    // 初期CSSから変数を抽出してフォームに設定
    if (initialCSS) {
      const extractedVariables = extractCSSVariables(initialCSS);
      setCssVariables(extractedVariables);
    }
  }, [initialCSS]);

  // CSSの変更を処理
  const handleCSSChange = (newCSS: string) => {
    setCSS(newCSS);
    onUpdate(newCSS);
  };

  // CSSからCSS変数を抽出する関数
  const extractCSSVariables = (cssText: string): CSSVariables => {
    const variables: CSSVariables = {
      contentMaxWidth: "",
      headerHeight: "",
      sectionSpacing: "",
      titleMarginBottom: "",
      sectionPaddingY: "",
      sectionPaddingX: "",
      cardGap: "",
      primaryColor: "",
      secondaryColor: "",
      accentColor: "",
      baseColor: "",
      textColor: "",
    };

    // :root { ... } ブロックを検索
    const rootRegex = /:root\s*\{([^}]*)\}/g;
    const match = rootRegex.exec(cssText);

    if (match) {
      const rootContent = match[1];

      // 各CSS変数を抽出
      const extractValue = (varName: string) => {
        const regex = new RegExp(`--${varName}\\s*:\\s*([^;]+);`, "i");
        const match = rootContent.match(regex);
        return match ? match[1].trim() : "";
      };

      variables.contentMaxWidth = extractValue("base");
      variables.headerHeight = extractValue("head");
      variables.sectionSpacing = extractValue("sectionMT");
      variables.titleMarginBottom = extractValue("titleAfter");
      variables.sectionPaddingY = extractValue("sectionPY");
      variables.sectionPaddingX = extractValue("spaceX");
      variables.cardGap = extractValue("gap");
      variables.primaryColor = extractValue("mc");
      variables.secondaryColor = extractValue("sc");
      variables.accentColor = extractValue("ac");
      variables.baseColor = extractValue("bc");
      variables.textColor = extractValue("tx");
    }

    return variables;
  };

  // CSS変数をCSS文字列に変換
  const generateVariablesCSS = (variables: CSSVariables) => {
    const variablesList = [];

    if (variables.contentMaxWidth)
      variablesList.push(`  --base: ${variables.contentMaxWidth};`);
    if (variables.headerHeight)
      variablesList.push(`  --head: ${variables.headerHeight};`);
    if (variables.sectionSpacing)
      variablesList.push(`  --sectionMT: ${variables.sectionSpacing};`);
    if (variables.titleMarginBottom)
      variablesList.push(`  --titleAfter: ${variables.titleMarginBottom};`);
    if (variables.sectionPaddingY)
      variablesList.push(`  --sectionPY: ${variables.sectionPaddingY};`);
    if (variables.sectionPaddingX)
      variablesList.push(`  --spaceX: ${variables.sectionPaddingX};`);
    if (variables.cardGap) variablesList.push(`  --gap: ${variables.cardGap};`);
    if (variables.primaryColor)
      variablesList.push(`  --mc: ${variables.primaryColor};`);
    if (variables.secondaryColor)
      variablesList.push(`  --sc: ${variables.secondaryColor};`);
    if (variables.accentColor)
      variablesList.push(`  --ac: ${variables.accentColor};`);
    if (variables.baseColor)
      variablesList.push(`  --bc: ${variables.baseColor};`);
    if (variables.textColor)
      variablesList.push(`  --tx: ${variables.textColor};`);

    if (variablesList.length === 0) return "";

    return `:root {\n${variablesList.join("\n")}\n}\n\n`;
  };

  // 変数CSSとカスタムCSSを統合
  const mergeVariablesWithCustomCSS = (
    variablesCSS: string,
    customCSS: string
  ) => {
    if (!variablesCSS) return customCSS;

    // 既存のカスタムCSSから:rootブロックを除去
    const cssWithoutVariables = customCSS
      .replace(/:root\s*\{[^}]*\}\s*/g, "")
      .trim();

    // 変数CSSと残りのCSSを結合
    return variablesCSS + (cssWithoutVariables ? cssWithoutVariables : "");
  };

  // 変数CSSファイル更新（デバウンス）
  const debouncedUpdateVariablesFile = useCallback(
    (variables: CSSVariables) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        try {
          const variablesCSS = generateVariablesCSS(variables);
          const response = await fetch("/api/css", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ css: variablesCSS }),
          });

          if (!response.ok) {
            console.warn("変数CSSファイルの更新に失敗しました");
          }
        } catch (error) {
          console.warn("変数CSSファイルの更新エラー:", error);
        }
      }, 500);
    },
    []
  );

  // CSS変数の変更を処理
  const handleVariableChange = (key: keyof CSSVariables, value: string) => {
    const newVariables = {
      ...cssVariables,
      [key]: value,
    };
    setCssVariables(newVariables);

    // 変数をpublic/custom.cssに保存（カスタムCSSとは独立）
    debouncedUpdateVariablesFile(newVariables);

    // 現在のカスタムCSSと変数CSSを統合してカスタムCSS編集エリアも更新
    const variablesCSS = generateVariablesCSS(newVariables);
    const updatedCSS = mergeVariablesWithCustomCSS(variablesCSS, css);
    setCSS(updatedCSS);
    onUpdate(updatedCSS);
  };

  return (
    <div className="CSSEditor flex h-full flex-col space-y-6">
      <Card className="flex flex-1 flex-col rounded-sm p-4">
        <h3 className="mb-4">カスタムCSS</h3>

        <div className="flex flex-1 flex-col space-y-4">
          {/* 変数を設定 */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setIsVariablesOpen(!isVariablesOpen)}
              className="flex w-full items-center  gap-2 text-base font-medium hover:text-primary focus:text-primary focus:outline-none"
            >
              <span>変数を設定</span>
              {isVariablesOpen ? (
                <ChevronDown className="h-4 w-4 -scale-y-100 " />
              ) : (
                <ChevronDown className="h-4 w-4 transition-transform " />
              )}
            </button>

            {/* 折りたたみ可能なコンテンツ */}
            <div
              className={`overflow-hidden ${
                isVariablesOpen
                  ? "max-h-[2000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
              style={{
                transitionDuration: "900ms",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* レイアウト関連 */}
              <div className="space-y-3">
                <h5 className="  font-medium text-muted-foreground">
                  レイアウト設定
                </h5>
                <div className="grid grid-cols-2 gap-4  lg:grid-cols-3">
                  <VariableField
                    id="content-max-width"
                    label="コンテンツ基本幅　 --base"
                    value={cssVariables.contentMaxWidth}
                    onChange={(value) =>
                      handleVariableChange("contentMaxWidth", value)
                    }
                    placeholder="1200px"
                  />
                  <VariableField
                    id="header-height"
                    label="ヘッダー高さ　--head"
                    value={cssVariables.headerHeight}
                    onChange={(value) =>
                      handleVariableChange("headerHeight", value)
                    }
                    placeholder="80px"
                  />
                  <VariableField
                    id="section-spacing"
                    label="セクション間タテ余白　--sectionMT"
                    value={cssVariables.sectionSpacing}
                    onChange={(value) =>
                      handleVariableChange("sectionSpacing", value)
                    }
                    placeholder="80px"
                  />
                  <VariableField
                    id="title-margin-bottom"
                    label="タイトル後タテ余白　--titleAfter"
                    value={cssVariables.titleMarginBottom}
                    onChange={(value) =>
                      handleVariableChange("titleMarginBottom", value)
                    }
                    placeholder="24px"
                  />
                  <VariableField
                    id="section-padding-y"
                    label="セクション上下余白　--sectionPY"
                    value={cssVariables.sectionPaddingY}
                    onChange={(value) =>
                      handleVariableChange("sectionPaddingY", value)
                    }
                    placeholder="60px"
                  />
                  <VariableField
                    id="section-padding-x"
                    label="基本ヨコ余白　--spaceX"
                    value={cssVariables.sectionPaddingX}
                    onChange={(value) =>
                      handleVariableChange("sectionPaddingX", value)
                    }
                    placeholder="20px"
                  />
                  <VariableField
                    id="card-gap"
                    label="カード間ヨコ余白　--gap"
                    value={cssVariables.cardGap}
                    onChange={(value) => handleVariableChange("cardGap", value)}
                    placeholder="24px"
                  />
                </div>
              </div>

              {/* カラー関連 */}
              <div className="space-y-3">
                <h5 className="  font-medium text-muted-foreground">
                  カラー設定
                </h5>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <VariableColorField
                    id="primary-color"
                    label="メインカラー　--mc"
                    value={cssVariables.primaryColor}
                    onChange={(value) =>
                      handleVariableChange("primaryColor", value)
                    }
                    placeholder="#3b82f6"
                  />
                  <VariableColorField
                    id="secondary-color"
                    label="サブカラー　--sc"
                    value={cssVariables.secondaryColor}
                    onChange={(value) =>
                      handleVariableChange("secondaryColor", value)
                    }
                    placeholder="#64748b"
                  />
                  <VariableColorField
                    id="accent-color"
                    label="アクセントカラー　--ac"
                    value={cssVariables.accentColor}
                    onChange={(value) =>
                      handleVariableChange("accentColor", value)
                    }
                    placeholder="#f59e0b"
                  />
                  <VariableColorField
                    id="base-color"
                    label="ベースカラー　--bc"
                    value={cssVariables.baseColor}
                    onChange={(value) =>
                      handleVariableChange("baseColor", value)
                    }
                    placeholder="#ffffff"
                  />
                  <VariableColorField
                    id="text-color"
                    label="文字色　--tx"
                    value={cssVariables.textColor}
                    onChange={(value) =>
                      handleVariableChange("textColor", value)
                    }
                    placeholder="#1f2937"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* カスタムCSS編集 */}
          <div className="flex flex-1 flex-col space-y-4">
            <div className="flex flex-1 flex-col space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="custom-css">カスタムCSSを編集</Label>
              </div>
              <SimpleHtmlEditor
                value={css}
                onChange={handleCSSChange}
                placeholder="CSSを入力してください..."
                className="h-80"
                commentStyle="css"
                compact={true}
              />
            </div>

            <div className="mt-4">
              <h4 className="mb-2 font-medium">使用方法</h4>
              <div className="space-y-2   ">
                <p>
                  上記の変数設定で基本的なレイアウトとカラーを調整できます。設定した値は自動的に保存・表示されます。
                </p>
                <p>
                  カスタムCSSエリアでは、設定した変数を{" "}
                  <code className="rounded bg-gray-100 px-1">
                    var(--変数名)
                  </code>{" "}
                  の形式で使用できます。
                </p>
                <p>変更は「保存」ボタンでデータベースに保存されます。</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
