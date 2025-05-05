"use client";

import { useState, useEffect } from "react";
import { RichTextEditor } from "../ui/editor";
import { ImageUpload } from "../ImageUpload";
import { BackgroundImageUpload } from "../BackgroundImageUpload";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { MainVisualSection } from "@/types";

interface MainVisualEditorProps {
	section: MainVisualSection;
	onUpdate: (section: MainVisualSection) => void;
}

export function MainVisualEditor({ section, onUpdate }: MainVisualEditorProps) {
	const [html, setHtml] = useState(section.html);
	const [mainImage, setMainImage] = useState<string | null>(
		section.image || null
	);
	const [backgroundImage, setBackgroundImage] = useState<string | null>(
		section.bgImage || null
	);
	const [className, setClassName] = useState(section.class);

	// セクションの更新を処理
	const handleUpdate = (key: keyof MainVisualSection, value: any) => {
		onUpdate({
			...section,
			[key]: value,
		});
	};

	// セクション全体を更新
	const updateSection = () => {
		onUpdate({
			...section,
			html,
			class: className,
			image: mainImage || undefined,
			bgImage: backgroundImage || undefined,
		});
	};

	// 値が変更されたらセクションを更新
	useEffect(() => {
		updateSection();
	}, [html, className, mainImage, backgroundImage]);

	return (
		<div className="space-y-6">
			<Card className="p-4">
				<h3 className="text-lg font-medium mb-4">
					メインビジュアル設定
				</h3>

				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="main-visual-class">クラス名</Label>
						<Input
							id="main-visual-class"
							value={className}
							onChange={(e) => setClassName(e.target.value)}
							placeholder="例: hero-section bg-gray-100"
						/>
					</div>

					<ImageUpload
						initialImage={mainImage || undefined}
						onImageChange={setMainImage}
						label="メイン画像"
					/>

					<BackgroundImageUpload
						initialImage={backgroundImage || undefined}
						onImageChange={setBackgroundImage}
						label="背景画像"
					/>

					<div className="space-y-2">
						<Label>コンテンツ</Label>
						<RichTextEditor
							content={html}
							onChange={(content) => setHtml(content)}
							placeholder="ここにメインビジュアルのHTMLを入力..."
						/>
					</div>
				</div>
			</Card>
		</div>
	);
}
 