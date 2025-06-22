"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import { Header } from "@/types";
import { SimpleHtmlEditor } from "../ui/simple-html-editor";
import { Label } from "../ui/label";

interface HeaderEditorProps {
	header: Header;
	onUpdate: (header: Header) => void;
}

export function HeaderEditor({ header, onUpdate }: HeaderEditorProps) {
	const [html, setHtml] = useState(header.html);

	const handleHtmlChange = (newHtml: string) => {
		setHtml(newHtml);
		onUpdate({ html: newHtml });
	};

	return (
    <div className="HeaderEditor flex h-full flex-col space-y-6">
      <Card className="flex flex-1 flex-col rounded-sm p-4">
        <h3 className="mb-4">ヘッダー設定</h3>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex flex-1 flex-col space-y-2">
            <Label htmlFor="header-html">HTMLエディタ</Label>
            <SimpleHtmlEditor
              value={html}
              onChange={handleHtmlChange}
              placeholder="ここにヘッダーのHTMLを入力..."
              compact={true}
              style={{
                minHeight: "8rem",
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
