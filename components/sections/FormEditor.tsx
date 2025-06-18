"use client";

import { SimpleHtmlEditor } from "@/components/ui/simple-html-editor";
import { BackgroundImageUpload } from "@/components/images/BackgroundImageUpload";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FormSection } from "@/types";

interface FormEditorProps {
  section: FormSection;
  onUpdate: (section: FormSection) => void;
}

export function FormEditor({ section, onUpdate }: FormEditorProps) {
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

  const handleEndpointChange = (value: string) => {
    onUpdate({
      ...section,
      endpoint: value,
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
    <div className="FormEditor space-y-6">
      <Card className=" rounded-sm p-4">
        <h3 className="mb-4 text-lg font-medium">フォームセクション設定</h3>
        <div className="space-y-4">
          <FormField
            id="form-name"
            label="セクション名"
            value={section.name || ""}
            onChange={handleNameChange}
            placeholder="例: お問い合わせフォーム"
          />
          <FormField
            id="form-class"
            label="セクションクラス"
            value={section.class}
            onChange={handleClassNameChange}
            placeholder="例: Form"
          />
          <FormField
            id="form-section-width"
            label="セクション幅"
            value={section.sectionWidth || ""}
            onChange={handleSectionWidthChange}
            placeholder="例: max-w-4xl"
          />
          <FormField
            id="form-endpoint"
            label="送信先エンドポイント"
            value={section.endpoint}
            onChange={handleEndpointChange}
            placeholder="例: /api/contact"
          />
          <BackgroundImageUpload
            initialImage={section.bgImage}
            onImageChange={handleBgImageChange}
            label="背景画像"
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
 