import React from "react";
import { Card } from "@/components/ui/card";
import {
  ImageIcon,
  LayoutGrid,
  Mail,
  Copy,
  Folder,
  FileText,
  SquareCode,
} from "lucide-react";

interface SectionSelectorProps {
  onSelect: (sectionType: string) => void;
}

export function SectionSelector({ onSelect }: SectionSelectorProps) {
  const sectionTypes = [
    {
      type: "mainVisual",
      title: "メインビジュアル",
      description: "ページの最上部に表示される大きな画像とテキスト",
      icon: <ImageIcon className="h-10 w-10 text-slate-500" />,
    },
    {
      type: "imgText",
      title: "画像テキスト",
      description: "画像とテキストを組み合わせたセクション",
      icon: <Copy className="h-10 w-10 text-green-500" />,
    },
    {
      type: "cards",
      title: "カード",
      description: "複数のカードを並べて表示するセクション",
      icon: <LayoutGrid className="h-10 w-10 text-yellow-500" />,
    },
    {
      type: "form",
      title: "お問い合わせフォーム",
      description: "問い合わせフォームを設置するセクション",
      icon: <Mail className="h-10 w-10 text-purple-500" />,
    },
    {
      type: "descList",
      title: "DLリスト",
      description: "項目と説明のペアを表形式で表示するセクション",
      icon: <FileText className="h-10 w-10 text-cyan-500" />,
    },
    {
      type: "htmlContent",
      title: "HTMLコンテンツ",
      description: "自由入力のHTMLを挿入するセクション",
      icon: <SquareCode className="h-10 w-10 text-slate-600" />,
    },
    {
      type: "group",
      title: "グループ",
      description: "セクションをグループ化するためのコンテナ",
      icon: <Folder className="h-10 w-10 text-blue-500" />,
    },
  ];

  return (
    <div className="SectionSelector">
      <p className="mb-4 text-sm text-muted-foreground sm:mb-6">
        追加したいセクションのタイプを選択してください
      </p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 ">
        {sectionTypes.map((section) => (
          <Card
            key={section.type}
            className="cursor-pointer p-3 transition-colors hover:border-slate-300 sm:py-6"
            onClick={() => onSelect(section.type)}
          >
            <div className="flex flex-row items-center gap-3 text-left sm:flex-col sm:gap-0  sm:text-center">
              <div className="shrink-0 sm:mb-3">
                {/* アイコンサイズをモバイルで少し小さく */}
                {React.cloneElement(section.icon as React.ReactElement, {
                  className:
                    "h-8 w-8 sm:h-10 sm:w-10 " +
                    (section.icon as React.ReactElement).props.className,
                })}
              </div>
              <div>
                <h4 className="text-sm font-medium sm:text-base">
                  {section.title}
                </h4>
                <p className="line-clamp-2 text-xs sm:line-clamp-none sm:text-sm">
                  {section.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
