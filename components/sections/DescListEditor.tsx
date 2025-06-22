"use client";

import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { BackgroundImageUpload } from "@/components/images/BackgroundImageUpload";
import { Textarea } from "@/components/ui/textarea";
import { DescListSection } from "@/types";
import { Plus, Trash2 } from "lucide-react";

interface DescListEditorProps {
  section: DescListSection;
  onUpdate: (section: DescListSection) => void;
}

interface DescListItem {
  dt: string;
  dd: string;
}

// HTMLパース関数
const parseDLHTML = (html: string): DescListItem[] => {
  if (!html) return [];

  // <dt>と<dd>のペアを抽出
  const dtRegex = /<dt>(.*?)<\/dt>/g;
  const ddRegex = /<dd>(.*?)<\/dd>/g;

  const dts = Array.from(html.matchAll(dtRegex), (m) => m[1] || "");
  const dds = Array.from(html.matchAll(ddRegex), (m) => m[1] || "");

  const maxLength = Math.max(dts.length, dds.length);
  const result: DescListItem[] = [];

  for (let i = 0; i < maxLength; i++) {
    result.push({
      dt: dts[i] || "",
      dd: dds[i] || "",
    });
  }

  return result.length > 0 ? result : [{ dt: "", dd: "" }];
};

// HTML生成関数
const generateDLHTML = (items: DescListItem[], dtWidth: string): string => {
  const filteredItems = items.filter(
    (item) => item.dt.trim() || item.dd.trim()
  );

  if (filteredItems.length === 0) return "";

  const dlContent = filteredItems
    .map((item) => `<dt>${item.dt}</dt>\n<dd>${item.dd}</dd>`)
    .join("\n");

  return `<dl style="--dtWidth: ${dtWidth}">\n${dlContent}\n</dl>`;
};

export function DescListEditor({ section, onUpdate }: DescListEditorProps) {
  const [items, setItems] = useState<DescListItem[]>(() => {
    const parsed = parseDLHTML(section.html);
    // 最低3行は表示
    while (parsed.length < 3) {
      parsed.push({ dt: "", dd: "" });
    }
    return parsed;
  });

  const cellRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  // 共通のセクション設定ハンドラー
  const handleNameChange = (value: string) => {
    onUpdate({
      ...section,
      name: value,
    });
  };

  const handleClassNameChange = (value: string) => {
    onUpdate({
      ...section,
      class: value,
    });
  };

  const handleSectionWidthChange = (value: string) => {
    onUpdate({
      ...section,
      sectionWidth: value,
    });
  };

  const handleBgImageChange = (img: string | null) => {
    onUpdate({
      ...section,
      bgImage: img || undefined,
    });
  };

  const handleTitleChange = (value: string) => {
    onUpdate({
      ...section,
      title: value,
    });
  };

  const handleDtWidthChange = (value: string) => {
    const newSection = {
      ...section,
      dtWidth: value,
    };

    // HTMLも再生成
    const html = generateDLHTML(items, value);
    onUpdate({
      ...newSection,
      html,
    });
  };

  const handleItemChange = (
    index: number,
    field: "dt" | "dd",
    value: string
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);

    // HTMLを生成して保存
    const html = generateDLHTML(newItems, section.dtWidth || "20%");
    onUpdate({
      ...section,
      html,
    });
  };

  const addRow = () => {
    setItems([...items, { dt: "", dd: "" }]);
  };

  const removeRow = (index: number) => {
    if (items.length <= 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);

    const html = generateDLHTML(newItems, section.dtWidth || "20%");
    onUpdate({
      ...section,
      html,
    });
  };

  // セル移動処理（インデント・アンインデント処理を置き換え）
  const handleKeyDown = (
    index: number,
    field: "dt" | "dd",
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Tab") {
      e.preventDefault();

      let nextIndex = index;
      let nextField: "dt" | "dd" = field;

      if (e.shiftKey) {
        // Shift+Tab: 前のセルに移動
        if (field === "dd") {
          nextField = "dt";
        } else {
          nextIndex = index - 1;
          nextField = "dd";
          if (nextIndex < 0) {
            nextIndex = items.length - 1;
            nextField = "dd";
          }
        }
      } else {
        // Tab: 次のセルに移動
        if (field === "dt") {
          nextField = "dd";
        } else {
          nextIndex = index + 1;
          nextField = "dt";

          // 最下行の場合、新しい行を追加
          if (nextIndex >= items.length) {
            const currentItem = items[index];
            if (currentItem.dt.trim() || currentItem.dd.trim()) {
              addRow();
            } else {
              nextIndex = 0;
              nextField = "dt";
            }
          }
        }
      }

      // フォーカス移動
      setTimeout(() => {
        const key = `${nextIndex}-${nextField}`;
        cellRefs.current[key]?.focus();
      }, 10);
    }
  };

  return (
    <div className="DescListEditor h-full space-y-6">
      <Card className="flex h-full flex-col rounded-sm p-4">
        <h3 className="mb-4">DLリスト設定</h3>

        <div className="space-y-4">
          {/* 共通のセクション設定 */}
          <FormField
            id="desc-list-name"
            label="セクション名"
            value={section.name || ""}
            onChange={handleNameChange}
            placeholder="例: DLリスト"
          />
          <FormField
            id="desc-list-class"
            label="セクションクラス"
            value={section.class}
            onChange={handleClassNameChange}
            placeholder="例: DescList"
          />
          <FormField
            id="desc-list-section-width"
            label="セクション幅"
            value={section.sectionWidth || ""}
            onChange={handleSectionWidthChange}
            placeholder="例: max-w-7xl"
          />
          <BackgroundImageUpload
            initialImage={section.bgImage}
            onImageChange={handleBgImageChange}
            label="背景画像"
          />

          <FormField
            id="desc-list-title"
            label="タイトル(H2)"
            value={section.title || ""}
            onChange={handleTitleChange}
            placeholder="例: リストのタイトル"
            allowHtml={true}
          />
          <FormField
            id="dt-width"
            label="DT幅"
            value={section.dtWidth || ""}
            onChange={handleDtWidthChange}
            placeholder="例: 20%"
          />

          <Button
            onClick={addRow}
            size="sm"
            variant="outline"
            className="w-full"
          >
            <Plus className="mr-1 h-4 w-4" />
            行追加
          </Button>

          {/* DT(項目)DD(説明)グリッド */}
          <div className="overflow-hidden rounded-sm border border-gray-200">
            {/* ヘッダー */}
            <div className="grid grid-cols-12 border-b border-gray-200 bg-gray-50">
              <div className="col-span-3 border-r border-gray-200 px-3 py-2 text-sm font-medium text-gray-700">
                DT (項目)
              </div>
              <div className="col-span-8 border-r border-gray-200 px-3 py-2 text-sm font-medium text-gray-700">
                DD (説明)
              </div>
              <div className="col-span-1 px-3 py-2 text-center text-sm font-medium text-gray-700">
                削除
              </div>
            </div>

            {/* データ行 */}
            {items.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-12 ${index !== items.length - 1 ? "border-b border-gray-200" : ""}`}
              >
                <div className="col-span-3 border-r border-gray-200">
                  <Textarea
                    ref={(el) => {
                      cellRefs.current[`${index}-dt`] = el;
                    }}
                    value={item.dt}
                    onChange={(e) =>
                      handleItemChange(index, "dt", e.target.value)
                    }
                    placeholder="項目名"
                    className="min-h-[2em] resize-none rounded-none border-0 bg-transparent focus:border-0 focus:ring-0"
                    onKeyDown={(e) => handleKeyDown(index, "dt", e)}
                  />
                </div>
                <div className="col-span-8 border-r border-gray-200">
                  <Textarea
                    ref={(el) => {
                      cellRefs.current[`${index}-dd`] = el;
                    }}
                    value={item.dd}
                    onChange={(e) =>
                      handleItemChange(index, "dd", e.target.value)
                    }
                    placeholder="説明"
                    className="min-h-[2em] resize-none rounded-none border-0 bg-transparent focus:border-0 focus:ring-0"
                    onKeyDown={(e) => handleKeyDown(index, "dd", e)}
                  />
                </div>
                <div className="col-span-1 flex items-center justify-center p-2">
                  <Button
                    onClick={() => removeRow(index)}
                    size="sm"
                    variant="ghost"
                    disabled={items.length <= 1}
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
