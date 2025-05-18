"use client";

import { RichTextEditor } from "@/components/ui/editor";
import { ImageUpload } from "@/components/images/ImageUpload";
import { BackgroundImageUpload } from "@/components/images/BackgroundImageUpload";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MainVisualSection } from "@/types";

interface MainVisualEditorProps {
	section: MainVisualSection;
	onUpdate: (section: MainVisualSection) => void;
}

export function MainVisualEditor({ section, onUpdate }: MainVisualEditorProps) {
	// 直接propsからの値を使用し、内部状態を持たないようにする

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onUpdate({
			...section,
			name: e.target.value,
		});
	};

	const handleHtmlChange = (content: string) => {
		onUpdate({
			...section,
			html: content,
		});
	};

	const handleMainImageChange = (img: string | null) => {
		onUpdate({
			...section,
			image: img || undefined,
		});
	};

	const handleBgImageChange = (img: string | null) => {
		onUpdate({
			...section,
			bgImage: img || undefined,
		});
	};

	const handleClassNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onUpdate({
			...section,
			class: e.target.value,
		});
	};

	return (
		<div className="space-y-6">
			<Card className="p-4">
				<h3 className="text-lg font-medium mb-4">
					メインビジュアル設定
				</h3>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="main-visual-name">セクション名</Label>
						<Input
							id="main-visual-name"
							value={section.name || ""}
							onChange={handleNameChange}
							placeholder="例: メインビジュアル"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="main-visual-class">クラス名</Label>
						<Input
							id="main-visual-class"
							value={section.class}
							onChange={handleClassNameChange}
							placeholder="例: hero-section bg-gray-100"
						/>
					</div>
					<ImageUpload
						initialImage={section.image}
						onImageChange={handleMainImageChange}
						label="メイン画像"
					/>
					<BackgroundImageUpload
						initialImage={section.bgImage}
						onImageChange={handleBgImageChange}
						label="背景画像"
					/>
					<div className="space-y-2">
						<Label>コンテンツ</Label>
						<RichTextEditor
							content={section.html}
							onChange={handleHtmlChange}
							placeholder="ここにメインビジュアルのHTMLを入力..."
						/>
					</div>
				</div>
			</Card>
		</div>
	);
}
 