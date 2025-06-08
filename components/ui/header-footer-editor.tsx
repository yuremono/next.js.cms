"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { SimpleHtmlEditor } from "./simple-html-editor";
import { useState } from "react";

interface HeaderFooterEditorProps {
	header: string;
	footer: string;
	onHeaderChange: (content: string) => void;
	onFooterChange: (content: string) => void;
}

export function HeaderFooterEditor({
	header,
	footer,
	onHeaderChange,
	onFooterChange,
}: HeaderFooterEditorProps) {
	const [activeTab, setActiveTab] = useState<string>("header");

	return (
    <div className="rounded-md border">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="header">ヘッダー</TabsTrigger>
          <TabsTrigger value="footer">フッター</TabsTrigger>
        </TabsList>
        <TabsContent value="header">
          <SimpleHtmlEditor
            value={header}
            onChange={onHeaderChange}
            placeholder="ヘッダーのHTMLを入力してください..."
            compact={true}
            style={{
              minHeight: "300px",
            }}
          />
        </TabsContent>
        <TabsContent value="footer">
          <SimpleHtmlEditor
            value={footer}
            onChange={onFooterChange}
            placeholder="フッターのHTMLを入力してください..."
            compact={true}
            style={{
              minHeight: "300px",
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
