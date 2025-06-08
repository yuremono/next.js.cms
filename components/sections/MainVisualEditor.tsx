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

  const handleImageClassChange = (className: string) => {
    onUpdate({
      ...section,
      imageClass: className,
    });
  };

  const handleTextClassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...section,
      textClass: e.target.value,
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
    <div className="MainVisualEditor space-y-6 h-full">
      <Card className="flex  flex-col rounded-sm p-4 h-full">
        <h3 className="mb-4 text-lg font-medium">メインビジュアル設定</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Label className="" htmlFor="main-visual-name">
              セクション名
            </Label>
            <Input
              id="main-visual-name"
              value={section.name || ""}
              onChange={handleNameChange}
              placeholder="例: メインビジュアル"
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label className="" htmlFor="main-visual-class">
              セクションクラス
            </Label>
            <Input
              id="main-visual-class"
              value={section.class}
              onChange={handleClassNameChange}
              placeholder="例: hero-section bg-gray-100"
              className="flex-1"
            />
          </div>
          <ImageUpload
            initialImage={section.image}
            initialClass={section.imageClass || ""}
            onImageChange={handleMainImageChange}
            onClassChange={handleImageClassChange}
            label="画像クラス"
          />
          <BackgroundImageUpload
            initialImage={section.bgImage}
            onImageChange={handleBgImageChange}
            label="背景画像"
          />
          <div className="flex items-center gap-4">
            <Label className="" htmlFor="main-visual-text-class">
              テキストクラス
            </Label>
            <Input
              id="main-visual-text-class"
              value={section.textClass || ""}
              onChange={handleTextClassChange}
              placeholder="例: hero-content text-center"
              className="flex-1"
            />
          </div>
          <RichTextEditor
          compact={true}
            content={section.html}
            onChange={handleHtmlChange}
            placeholder="ここにメインビジュアルのHTMLを入力..."
          />
        </div>
      </Card>
    </div>
  );
}
