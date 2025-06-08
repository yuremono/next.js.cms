import { Card } from "@/components/ui/card";
import { ImageIcon, LayoutGrid, Mail, Copy } from "lucide-react";

interface SectionSelectorProps {
	onSelect: (sectionType: string) => void;
}

export function SectionSelector({ onSelect }: SectionSelectorProps) {
	const sectionTypes = [
    {
      type: "mainVisual",
      title: "メインビジュアル",
      description: "ページの最上部に表示される大きな画像とテキスト",
      icon: <ImageIcon className="h-10 w-10 text-blue-500" />,
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
  ];

	return (
    <div className="SectionSelector p-4">
      <h3 className="mb-4 text-xl font-medium">セクションを追加</h3>
      <p className="mb-6 text-gray-500">
        追加したいセクションのタイプを選択してください
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sectionTypes.map((section) => (
          <Card
            key={section.type}
            className="cursor-pointer p-4 transition-colors hover:border-blue-300"
            onClick={() => onSelect(section.type)}
          >
            <div className="flex flex-col items-center p-4 text-center">
              {section.icon}
              <h4 className="mb-1 mt-3 font-medium">{section.title}</h4>
              <p className="text-sm text-gray-500">{section.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
