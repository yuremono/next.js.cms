"use client";

import React from "react";
import { GroupStartSection } from "@/types";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { BackgroundImageUpload } from "@/components/images/BackgroundImageUpload";

interface GroupEditorProps {
  section: GroupStartSection;
  onUpdate: (section: GroupStartSection) => void;
}

export function GroupEditor({ section, onUpdate }: GroupEditorProps) {
  const handleNameChange = (value: string) => {
    onUpdate({
      ...section,
      name: value,
    });
  };

  const handleClassChange = (value: string) => {
    onUpdate({
      ...section,
      class: value,
    });
  };

  const handleBgImageChange = (img: string | null) => {
    onUpdate({
      ...section,
      bgImage: img || undefined,
    });
  };

  const handleScopeStylesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onUpdate({
      ...section,
      scopeStyles: e.target.value,
    });
  };

  const handleSectionWidthChange = (value: string) => {
    onUpdate({
      ...section,
      sectionWidth: value,
    });
  };

  return (
    <div className="GroupEditor h-full space-y-6">
      <Card className="flex h-full flex-col rounded-sm p-4">
        <h3 className="mb-4">グループ設定</h3>
        <div className="space-y-4">
          <FormField
            id="group-name"
            label="グループ名"
            value={section.name}
            onChange={handleNameChange}
            placeholder="例: ヘッダーセクション"
          />
          <FormField
            id="group-class"
            label="グループクラス"
            value={section.class}
            onChange={handleClassChange}
            placeholder="例: header-section"
          />
          <FormField
            id="group-section-width"
            label="セクション幅"
            value={section.sectionWidth || ""}
            onChange={handleSectionWidthChange}
            placeholder="例: max-w-6xl, container"
          />
          <div className="mt-4">
            <Label htmlFor="scope-styles">グループのstyle属性</Label>
            <Textarea
              id="scope-styles"
              value={section.scopeStyles || ""}
              onChange={handleScopeStylesChange}
              placeholder="例: --gap: 2rem; --bg-color: #f0f0f0; --text-color: #333;"
              rows={4}
              className="mt-2 font-mono  "
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
