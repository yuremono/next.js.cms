"use client";

import { HtmlContentSection } from "@/types";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { SimpleHtmlEditor } from "@/components/ui/SimpleHtmlEditor";
import { BackgroundImageUpload } from "@/components/images/BackgroundImageUpload";
import { Textarea } from "@/components/ui/textarea";

interface HtmlContentEditorProps {
  section: HtmlContentSection;
  onUpdate: (section: HtmlContentSection) => void;
}

export function HtmlContentEditor({
  section,
  onUpdate,
}: HtmlContentEditorProps) {
  const handleNameChange = (value: string) => {
    onUpdate({ ...section, name: value });
  };

  const handleClassChange = (value: string) => {
    onUpdate({ ...section, class: value });
  };

  const handleSectionWidthChange = (value: string) => {
    onUpdate({ ...section, sectionWidth: value });
  };

  const handleScopeStylesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onUpdate({ ...section, scopeStyles: e.target.value });
  };

  const handleBgImageChange = (img: string | null) => {
    onUpdate({ ...section, bgImage: img || "" }); // undefinedではなく空文字列に設定
  };

  const handleHtmlChange = (value: string) => {
    onUpdate({ ...section, html: value });
  };

  // textClassは廃止

  return (
    <div className="HtmlContentEditor h-full space-y-6">
      <Card className="flex h-full flex-col rounded-sm p-4">
        <h3 className="mb-4">HTMLコンテンツ設定</h3>
        <div className="space-y-4">
          <FormField
            id="html-name"
            label="セクション名"
            value={section.name || ""}
            onChange={handleNameChange}
            placeholder="例: コンテンツセクション"
          />
          <FormField
            id="html-class"
            label="セクションクラス"
            value={section.class}
            onChange={handleClassChange}
            placeholder="例: HtmlContent"
          />
          <FormField
            id="html-section-width"
            label="セクション幅"
            value={section.sectionWidth || ""}
            onChange={handleSectionWidthChange}
            placeholder="例: max-w-6xl, container"
          />
          {/* テキストコンテナのクラスは不要になったため削除 */}

          <div className="mt-4">
            <Label htmlFor="html-scope-styles">
              セクションのstyle属性（CSS変数）
            </Label>
            <Textarea
              id="html-scope-styles"
              value={section.scopeStyles || ""}
              onChange={handleScopeStylesChange}
              placeholder="例: --gap: 2rem; --bg-color: #f0f0f0; --text-color: #333;"
              rows={4}
              className="mt-4 font-mono "
            />
          </div>

          <div>
            <Label htmlFor="html-editor">HTMLエディタ</Label>
            <SimpleHtmlEditor
              value={section.html}
              onChange={handleHtmlChange}
              placeholder="ここにHTMLを入力..."
              compact={true}
              style={{ minHeight: "10rem" }}
              className="mt-4"
            />
          </div>

          <BackgroundImageUpload
            initialImage={section.bgImage}
            onImageChange={handleBgImageChange}
            label="背景画像"
          />
        </div>
      </Card>
    </div>
  );
}
