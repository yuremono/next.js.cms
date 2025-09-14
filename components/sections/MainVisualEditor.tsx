"use client";

import { SimpleHtmlEditor } from "@/components/ui/SimpleHtmlEditor";
import { ImageUpload } from "@/components/images/ImageUpload";
import { BackgroundImageUpload } from "@/components/images/BackgroundImageUpload";
import { FormField } from "@/components/ui/form-field";
import { Card } from "@/components/ui/card";
import { MainVisualSection } from "@/types";
import { getMediaAspectRatio } from "@/lib/mediaUtils";

interface MainVisualEditorProps {
  section: MainVisualSection;
  onUpdate: (section: MainVisualSection) => void;
}

export function MainVisualEditor({ section, onUpdate }: MainVisualEditorProps) {
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
        console.log(`メインビジュアル画像変更: ${img}`);
        // メディア比率を取得（画像・動画対応）
        const aspectRatio = await getMediaAspectRatio(img);
        console.log(`取得されたアスペクト比: ${aspectRatio}`);
        onUpdate({
          ...section,
          image: img,
          imageAspectRatio: aspectRatio,
        });
      } catch (error) {
        console.error("メディア比率の取得に失敗しました:", error);
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

  const handleSectionWidthChange = (value: string) => {
    onUpdate({
      ...section,
      sectionWidth: value,
    });
  };

  const handleBgImageChange = (img: string | null) => {
    onUpdate({
      ...section,
      bgImage: img || "", // undefinedではなく空文字列に設定
    });
  };

  const handleClassNameChange = (value: string) => {
    onUpdate({
      ...section,
      class: value,
    });
  };

  return (
    <div className="MainVisualEditor h-full space-y-6">
      <Card className="flex  h-full flex-col rounded-sm p-4">
        <h3 className="mb-4">メインビジュアル設定</h3>
        <div className="space-y-4">
          <FormField
            id="MainVisual-name"
            label="セクション名"
            value={section.name || ""}
            onChange={handleNameChange}
            placeholder="例: メインビジュアル"
          />
          <FormField
            id="MainVisual-class"
            label="セクションクラス"
            value={section.class}
            onChange={handleClassNameChange}
            placeholder="例: MainVisual"
          />
          <FormField
            id="MainVisual-section-width"
            label="セクション幅"
            value={section.sectionWidth || ""}
            onChange={handleSectionWidthChange}
            placeholder="例: max-w-7xl"
          />
          <BackgroundImageUpload
            initialImage={section.bgImage}
            onImageChange={handleBgImageChange}
            label="背景画像"
          />
          <FormField
            id="mainvisual-image-class"
            label="画像クラス"
            value={section.imageClass || ""}
            onChange={handleImageClassChange}
            placeholder="例: object-cover w-full h-screen"
          />
          <ImageUpload
            initialImage={section.image}
            onImageChange={handleImageChange}
            label="画像"
          />
          <FormField
            id="MainVisual-text-class"
            label="テキストクラス"
            value={section.textClass || ""}
            onChange={handleTextClassChange}
            placeholder="例: MainVisual-content text-center"
          />
          <SimpleHtmlEditor
            value={section.html}
            onChange={handleHtmlChange}
            autoConvertLineBreaks={true}
            compact={true}
            placeholder="ここにメインビジュアルのHTMLを入力..."
          />
        </div>
      </Card>
    </div>
  );
}
