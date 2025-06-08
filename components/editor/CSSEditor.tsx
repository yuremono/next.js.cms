"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CSSEditorProps {
	initialCSS: string;
	onUpdate: (css: string) => void;
}

export function CSSEditor({ initialCSS, onUpdate }: CSSEditorProps) {
  const [css, setCSS] = useState(initialCSS || "");
  const [isApplying, setIsApplying] = useState(false);

  // 初期CSSが更新された場合に状態を更新
  useEffect(() => {
    setCSS(initialCSS || "");
  }, [initialCSS]);

  // CSSの変更を処理
  const handleCSSChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCSS = e.target.value;
    setCSS(newCSS);
  };

  // CSSを適用
  const applyCSS = async () => {
    setIsApplying(true);

    try {
      // 1. データベースの更新
      onUpdate(css);

      // 2. custom.cssファイルの生成
      const response = await fetch("/api/css", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ css }),
      });

      if (!response.ok) {
        throw new Error("CSSファイルの生成に失敗しました");
      }

      toast.success("CSSが更新され、トップページに反映されました");
    } catch (error) {
      console.error("CSS適用エラー:", error);
      toast.error("CSSの適用に失敗しました");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="CSSEditor flex h-full flex-col space-y-6">
      <Card className="flex flex-1 flex-col rounded-sm p-4">
        <h3 className="mb-4 text-lg font-medium">カスタムCSS</h3>

        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex flex-1 flex-col space-y-2">
            <Label htmlFor="custom-css">カスタムCSSを編集</Label>
            <Textarea
              id="custom-css"
              value={css}
              onChange={handleCSSChange}
              className="max-h-[50vh] min-h-32 flex-1 resize-none font-mono text-sm"
              placeholder="/* ここにカスタムCSSを入力 */
body {
  /* 例: 背景色を変更 */
  /* background-color: #f5f5f5; */
}

/* 例: ヘッダーのスタイル */
header {
  /* background-color: #ffffff; */
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
}

/* 例: フッターのスタイル */
footer {
  /* background-color: #333333; */
  /* color: #ffffff; */
}"
            />
          </div>

          <Button onClick={applyCSS} disabled={isApplying}>
            {isApplying ? "適用中..." : "CSSを適用"}
          </Button>

          <div className="mt-4">
            <h4 className="mb-2 font-medium">使用方法</h4>
            <div className="space-y-2 text-sm ">
              <p>
                このカスタムCSSはトップページのヘッダー（&lt;head&gt;タグ内）に直接挿入されます。
              </p>
              <p>
                カスタムCSSを使用して、ページ全体の見た目をカスタマイズできます。
              </p>
              <p>
                変更を保存するには「CSSを適用」ボタンをクリックし、ページの「保存」ボタンを押してください。
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
