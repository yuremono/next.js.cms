"use client";

import { Card } from "@/components/ui/card";
import { ImageIcon, LayoutIcon, CreditCard, FormInput } from "lucide-react";

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
			icon: <LayoutIcon className="h-10 w-10 text-green-500" />,
		},
		{
			type: "cards",
			title: "カード",
			description: "複数のカードを並べて表示するセクション",
			icon: <CreditCard className="h-10 w-10 text-yellow-500" />,
		},
		{
			type: "form",
			title: "お問い合わせフォーム",
			description: "問い合わせフォームを設置するセクション",
			icon: <FormInput className="h-10 w-10 text-purple-500" />,
		},
	];

	return (
		<div className="p-4">
			<h3 className="text-xl font-medium mb-4">セクションを追加</h3>
			<p className="text-gray-500 mb-6">
				追加したいセクションのタイプを選択してください
			</p>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{sectionTypes.map((section) => (
					<Card
						key={section.type}
						className="p-4 cursor-pointer hover:border-blue-300 transition-colors"
						onClick={() => onSelect(section.type)}
					>
						<div className="flex flex-col items-center text-center p-4">
							{section.icon}
							<h4 className="font-medium mt-3 mb-1">
								{section.title}
							</h4>
							<p className="text-sm text-gray-500">
								{section.description}
							</p>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
 