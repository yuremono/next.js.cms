"use client";

import { RichTextEditor } from "@/components/ui/editor";
import { BackgroundImageUpload } from "@/components/images/BackgroundImageUpload";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FormSection } from "@/types";

interface FormEditorProps {
	section: FormSection;
	onUpdate: (section: FormSection) => void;
}

export function FormEditor({ section, onUpdate }: FormEditorProps) {
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

	const handleEndpointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onUpdate({
			...section,
			endpoint: e.target.value,
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
    <div className="FormEditor space-y-6">
      <Card className=" rounded-sm p-4">
        <h3 className="mb-4 text-lg font-medium">フォームセクション設定</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Label className="" htmlFor="form-name">
              セクション名
            </Label>
            <Input
              id="form-name"
              value={section.name || ""}
              onChange={handleNameChange}
              placeholder="例: お問い合わせフォーム"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label className="" htmlFor="form-class">
              クラス名
            </Label>
            <Input
              id="form-class"
              value={section.class}
              onChange={handleClassNameChange}
              placeholder="例: form-section"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label className="" htmlFor="form-endpoint">
              送信先
              <br />
              エンドポイント
            </Label>
            <Input
              id="form-endpoint"
              value={section.endpoint}
              onChange={handleEndpointChange}
              placeholder="例: /api/contact"
            />
          </div>
          <BackgroundImageUpload
            initialImage={section.bgImage}
            onImageChange={handleBgImageChange}
            label="背景画像"
          />
          <div className="space-y-2">
            <Label>コンテンツ</Label>
            <RichTextEditor
          compact={true}
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
 