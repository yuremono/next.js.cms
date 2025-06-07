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
	const applyCSS = () => {
		onUpdate(css);
		toast.success("CSSが更新されました");
	};

	return (
    <div className="CSSEditor space-y-6">
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-medium">カスタムCSS</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-css">カスタムCSSを編集</Label>
            <Textarea
              id="custom-css"
              value={css}
              onChange={handleCSSChange}
              className="min-h-[300px] font-mono text-sm"
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

          <Button onClick={applyCSS}>CSSを適用</Button>

          <div className="mt-4">
            <h4 className="mb-2 font-medium">使用方法</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                このカスタムCSSはページのヘッダー（&lt;head&gt;タグ内）に直接挿入されます。
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
