"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import { Footer } from "@/types";
import { EnhancedTextarea } from "../ui/enhanced-textarea";
import { Label } from "../ui/label";

interface FooterEditorProps {
	footer: Footer;
	onUpdate: (footer: Footer) => void;
}

export function FooterEditor({ footer, onUpdate }: FooterEditorProps) {
	const [html, setHtml] = useState(footer.html);

	// HTMLの変更を処理
	const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newHtml = e.target.value;
		setHtml(newHtml);
		onUpdate({ html: newHtml });
	};

	return (
    <div className="FooterEditor space-y-6">
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-medium">フッター設定</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="footer-html">HTMLを直接編集</Label>
            <EnhancedTextarea
              id="footer-html"
              value={html}
              onChange={handleHtmlChange}
              className="min-h-[200px] font-mono text-sm"
              placeholder="ここにフッターのHTMLを入力..."
            />
          </div>

          <div className="mt-4">
            <h4 className="mb-2 font-medium">フッタープレビュー</h4>
            <div className="rounded border bg-white p-4">
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
