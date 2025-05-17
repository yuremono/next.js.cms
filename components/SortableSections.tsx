import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section } from "@/types";
import {
	ChevronUp,
	ChevronDown,
	Trash2,
	ImageIcon,
	LayoutIcon,
	CreditCard,
	FormInput,
} from "lucide-react";

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
		// セクション名が設定されている場合はそれを表示
		if (section.name) {
			return section.name;
		}

		// セクション名が未設定の場合はデフォルト名を表示
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

	// セクションタイプに応じたアイコンを取得
	const getSectionIcon = (section: Section) => {
		switch (section.layout) {
			case "mainVisual":
				return <ImageIcon className="h-6 w-6 text-blue-500 mr-2" />;
			case "imgText":
				return <LayoutIcon className="h-6 w-6 text-green-500 mr-2" />;
			case "cards":
				return <CreditCard className="h-6 w-6 text-yellow-500 mr-2" />;
			case "form":
				return <FormInput className="h-6 w-6 text-purple-500 mr-2" />;
			default:
				return null;
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
							{getSectionIcon(section)}
							<span className="text-base">
								{getSectionTitle(section)}
							</span>
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
