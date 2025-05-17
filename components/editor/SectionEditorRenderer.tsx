"use client";

import { Section, isSection } from "@/types";
import { MainVisualEditor } from "@/components/sections/MainVisualEditor";
import { ImgTextEditor } from "@/components/sections/ImgTextEditor";
import { CardsEditor } from "@/components/sections/CardsEditor";
import { FormEditor } from "@/components/sections/FormEditor";
import { Alert } from "@/components/ui/alert";

interface SectionEditorRendererProps {
	section: Section;
	onUpdate: (section: Section) => void;
}

export function SectionEditorRenderer({
	section,
	onUpdate,
}: SectionEditorRendererProps) {
	// 型ガードで不正データを排除
	if (!isSection(section)) {
		return (
			<Alert variant="destructive">
				<p>不正なセクションデータです</p>
			</Alert>
		);
	}
	// セクションタイプに応じたエディタコンポーネントを表示
	switch (section.layout) {
		case "mainVisual":
			return <MainVisualEditor section={section} onUpdate={onUpdate} />;
		case "imgText":
			return <ImgTextEditor section={section} onUpdate={onUpdate} />;
		case "cards":
			return <CardsEditor section={section} onUpdate={onUpdate} />;
		case "form":
			return <FormEditor section={section} onUpdate={onUpdate} />;
		default:
			return (
				<Alert variant="destructive">
					<p>
						未知のセクションタイプです:{" "}
						{(section as { layout?: string })?.layout ?? "不明"}
					</p>
				</Alert>
			);
	}
} 