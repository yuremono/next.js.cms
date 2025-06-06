"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section } from "@/types";
import { Grip, Trash2, ChevronUp, ChevronDown } from "lucide-react";

interface SortableSectionsProps {
	sections: Section[];
	activeSectionIndex: number | null;
	onSectionClick: (index: number) => void;
	onSectionMove: (fromIndex: number, toIndex: number) => void;
	onSectionDelete: (index: number) => void;
}

export function SortableSections({
	sections,
	activeSectionIndex,
	onSectionClick,
	onSectionMove,
	onSectionDelete,
}: SortableSectionsProps) {
	// セクションタイプに応じて表示名を取得
	const getSectionTitle = (section: Section) => {
		switch (section.layout) {
			case "mainVisual":
				return "メインビジュアル";
			case "imgText":
				return "画像テキスト";
			case "cards":
				return "カード";
			case "form":
				return "お問い合わせフォーム";
			default:
				return "不明なセクション";
		}
	};

	return (
		<div className="space-y-2">
			{sections.map((section, index) => (
				<Card
					key={index}
					className={`p-2 ${
						activeSectionIndex === index
							? "border-blue-500 bg-blue-50"
							: "hover:border-gray-300"
					} cursor-pointer transition-colors`}
					onClick={() => onSectionClick(index)}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<Grip className="h-4 w-4 mr-2 text-gray-400" />
							<span>{getSectionTitle(section)}</span>
						</div>
						<div className="flex items-center space-x-1">
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7"
								onClick={(e) => {
									e.stopPropagation();
									onSectionMove(index, index - 1);
								}}
								disabled={index === 0}
							>
								<ChevronUp className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7"
								onClick={(e) => {
									e.stopPropagation();
									onSectionMove(index, index + 1);
								}}
								disabled={index === sections.length - 1}
							>
								<ChevronDown className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7 text-red-500 hover:text-red-600"
								onClick={(e) => {
									e.stopPropagation();
									if (
										window.confirm(
											"このセクションを削除してもよろしいですか？"
										)
									) {
										onSectionDelete(index);
									}
								}}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</Card>
			))}

			{sections.length === 0 && (
				<div className="text-center p-6 border border-dashed rounded-md">
					<p className="text-gray-500">
						セクションがありません。「セクション追加」ボタンから新しいセクションを追加してください。
					</p>
				</div>
			)}
		</div>
	);
}
