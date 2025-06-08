"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import { Header } from "@/types";
import { EnhancedTextarea } from "../ui/enhanced-textarea";
import { Label } from "../ui/label";

interface HeaderEditorProps {
	header: Header;
	onUpdate: (header: Header) => void;
}

export function HeaderEditor({ header, onUpdate }: HeaderEditorProps) {
	const [html, setHtml] = useState(header.html);

	// HTMLの変更を処理
	const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newHtml = e.target.value;
		setHtml(newHtml);
		onUpdate({ html: newHtml });
	};

	  return (
      <div className="HeaderEditor flex h-full flex-col space-y-6">
        <Card className="flex flex-1 flex-col rounded-sm p-4">
          <h3 className="mb-4 text-lg font-medium">ヘッダー設定</h3>

          <div className="flex flex-1 flex-col space-y-4">
            <div className="flex flex-1 flex-col space-y-2">
              <Label htmlFor="header-html">HTMLを直接編集</Label>
              <EnhancedTextarea
                id="header-html"
                value={html}
                onChange={handleHtmlChange}
                className="max-h-[50vh] min-h-32 flex-1 resize-none font-mono text-sm"
                placeholder="ここにヘッダーのHTMLを入力..."
                style={{
                  height: "auto",
                  minHeight: "8rem",
                  maxHeight: "unset",
                  overflowY: "auto",
                }}
              />
            </div>

            <div className="mt-4">
              <h4 className="mb-2 font-medium">ヘッダープレビュー</h4>
              <div className="rounded border bg-white p-4">
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
}
