"use client";

import React from "react";
import { GroupStartSection } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { BackgroundImageUpload } from "@/components/images/BackgroundImageUpload";

interface GroupEditorProps {
  section: GroupStartSection;
  onUpdate: (section: GroupStartSection) => void;
}

export function GroupEditor({ section, onUpdate }: GroupEditorProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...section,
      name: e.target.value,
    });
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...section,
      class: e.target.value,
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

  return (
    <div className="GroupEditor h-full space-y-6">
      <Card className="flex h-full flex-col rounded-sm p-4">
        <h3 className="mb-4 text-lg font-medium">グループ設定</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Label className="" htmlFor="group-name">
              グループ名
            </Label>
            <Input
              id="group-name"
              value={section.name}
              onChange={handleNameChange}
              placeholder="例: ヘッダーセクション"
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label className="" htmlFor="group-class">
              グループクラス
            </Label>
            <Input
              id="group-class"
              value={section.class}
              onChange={handleClassChange}
              placeholder="例: header-section"
              className="flex-1"
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="scope-styles">グループのstyle=""</Label>
            <Textarea
              id="scope-styles"
              value={section.scopeStyles || ""}
              onChange={handleScopeStylesChange}
              placeholder="例: --gap: 2rem; --bg-color: #f0f0f0; --text-color: #333;"
              rows={4}
              className="mt-2 font-mono text-sm"
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
