"use client";

import { RichTextEditor } from "@/components/ui/editor";
import { ImageUpload } from "@/components/images/ImageUpload";
import { BackgroundImageUpload } from "@/components/images/BackgroundImageUpload";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ImgTextSection } from "@/types";

interface ImgTextEditorProps {
	section: ImgTextSection;
	onUpdate: (section: ImgTextSection) => void;
}

export function ImgTextEditor({ section, onUpdate }: ImgTextEditorProps) {
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

	const handleImageChange = (img: string | null) => {
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
					画像テキストセクション設定
				</h3>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="imgtext-name">セクション名</Label>
						<Input
							id="imgtext-name"
							value={section.name || ""}
							onChange={handleNameChange}
							placeholder="例: 画像とテキスト"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="imgtext-class">クラス名</Label>
						<Input
							id="imgtext-class"
							value={section.class}
							onChange={handleClassNameChange}
							placeholder="例: img-text-section"
						/>
					</div>
					<ImageUpload
						initialImage={section.image}
						onImageChange={handleImageChange}
						label="画像"
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
							placeholder="ここにHTMLを入力..."
						/>
					</div>
				</div>
			</Card>
		</div>
	);
}
 