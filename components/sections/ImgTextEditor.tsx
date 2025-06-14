"use client";

import { RichTextEditor } from "@/components/ui/editor";
import { ImageUpload } from "@/components/images/ImageUpload";
import { BackgroundImageUpload } from "@/components/images/BackgroundImageUpload";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImgTextSection } from "@/types";
import { getImageAspectRatio } from "@/lib/image-utils";

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
    <div className="ImgTextEditor h-full space-y-6">
      <Card className="flex  h-full flex-col rounded-sm p-4">
        <h3 className="mb-4 text-lg font-medium">画像テキストセクション設定</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Label className="" htmlFor="imgtext-name">
              セクション名
            </Label>
            <Input
              id="imgtext-name"
              value={section.name || ""}
              onChange={handleNameChange}
              placeholder="例: 画像とテキスト"
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-4">
            <Label className="" htmlFor="imgtext-class">
              セクションクラス
            </Label>
            <Input
              id="imgtext-class"
              value={section.class}
              onChange={handleClassNameChange}
              placeholder="例: ImgText"
              className="flex-1"
            />
          </div>

          <ImageUpload
            initialImage={section.image}
            initialClass={section.imageClass || ""}
            onImageChange={handleImageChange}
            onClassChange={handleImageClassChange}
            label="画像クラス"
          />

          <BackgroundImageUpload
            initialImage={section.bgImage}
            onImageChange={handleBgImageChange}
            label="背景画像"
          />

          <div className="flex items-center gap-4">
            <Label className="" htmlFor="imgtext-text-class">
              テキストクラス
            </Label>
            <Input
              id="imgtext-text-class"
              value={section.textClass || ""}
              onChange={handleTextClassChange}
              placeholder="例: text-content"
              className="flex-1"
            />
          </div>

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
