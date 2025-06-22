"use client";

import { SimpleHtmlEditor } from "@/components/ui/simple-html-editor";
import { ImageUpload } from "@/components/images/ImageUpload";
import { BackgroundImageUpload } from "@/components/images/BackgroundImageUpload";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import { ImgTextSection } from "@/types";
import { getImageAspectRatio } from "@/lib/image-utils";

interface ImgTextEditorProps {
  section: ImgTextSection;
  onUpdate: (section: ImgTextSection) => void;
}

export function ImgTextEditor({ section, onUpdate }: ImgTextEditorProps) {
  // 直接propsからの値を使用し、内部状態を持たないようにする

  const handleNameChange = (value: string) => {
    onUpdate({
      ...section,
      name: value,
    });
  };

  const handleHtmlChange = (content: string) => {
    onUpdate({
      ...section,
      html: content,
    });
  };

  const handleImageChange = async (img: string | null) => {
    if (img) {
      try {
        // 画像比率を取得
        const aspectRatio = await getImageAspectRatio(img);
        onUpdate({
          ...section,
          image: img,
          imageAspectRatio: aspectRatio,
        });
      } catch (error) {
        console.error("画像比率の取得に失敗しました:", error);
        onUpdate({
          ...section,
          image: img,
          imageAspectRatio: "auto",
        });
      }
    } else {
      onUpdate({
        ...section,
        image: undefined,
        imageAspectRatio: undefined,
      });
    }
  };

  const handleImageClassChange = (className: string) => {
    onUpdate({
      ...section,
      imageClass: className,
    });
  };

  const handleTextClassChange = (value: string) => {
    onUpdate({
      ...section,
      textClass: value,
    });
  };

  const handleBgImageChange = (img: string | null) => {
    onUpdate({
      ...section,
      bgImage: img || undefined,
    });
  };

  const handleClassNameChange = (value: string) => {
    onUpdate({
      ...section,
      class: value,
    });
  };

  const handleSectionWidthChange = (value: string) => {
    onUpdate({
      ...section,
      sectionWidth: value,
    });
  };

  return (
    <div className="ImgTextEditor h-full space-y-6">
      <Card className="flex  h-full flex-col rounded-sm p-4">
        <h3 className="mb-4">画像テキストセクション設定</h3>
        <div className="space-y-4">
          <FormField
            id="imgtext-name"
            label="セクション名"
            value={section.name || ""}
            onChange={handleNameChange}
            placeholder="例: 画像とテキスト"
          />

          <FormField
            id="imgtext-class"
            label="セクションクラス"
            value={section.class}
            onChange={handleClassNameChange}
            placeholder="例: ImgText"
          />
          <FormField
            id="imgtext-section-width"
            label="セクション幅"
            value={section.sectionWidth || ""}
            onChange={handleSectionWidthChange}
            placeholder="例: max-w-6xl"
          />

          <BackgroundImageUpload
            initialImage={section.bgImage}
            onImageChange={handleBgImageChange}
            label="背景画像"
          />

          <ImageUpload
            initialImage={section.image}
            initialClass={section.imageClass || ""}
            onImageChange={handleImageChange}
            onClassChange={handleImageClassChange}
            label="画像クラス"
          />

          <FormField
            id="imgtext-text-class"
            label="テキストクラス"
            value={section.textClass || ""}
            onChange={handleTextClassChange}
            placeholder="例: text-content"
          />

          <div className="space-y-2">
            <Label>コンテンツ</Label>
            <SimpleHtmlEditor
              value={section.html}
              onChange={handleHtmlChange}
              autoConvertLineBreaks={true}
              compact={true}
              placeholder="ここにHTMLを入力..."
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
