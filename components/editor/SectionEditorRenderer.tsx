"use client";

import { Section } from "@/types";
import { MainVisualEditor } from "./sections/MainVisualEditor";
import { ImgTextEditor } from "./sections/ImgTextEditor";
import { CardsEditor } from "./sections/CardsEditor";
import { FormEditor } from "./sections/FormEditor";

interface SectionEditorRendererProps {
	section: Section;
	onUpdate: (section: Section) => void;
}

export function SectionEditorRenderer({
	section,
	onUpdate,
}: SectionEditorRendererProps) {
	// セクションタイプに応じたコンポーネントを表示
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
				<div className="p-4 border rounded-md">
					<p className="text-red-500">
						未対応のセクションタイプです: {section.layout}
					</p>
				</div>
			);
	}
}
