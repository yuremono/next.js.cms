"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { MonacoEditor } from "./monaco-editor";
import { useState, useEffect } from "react";

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
		<div className="border rounded-md">
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="header">ヘッダー</TabsTrigger>
					<TabsTrigger value="footer">フッター</TabsTrigger>
				</TabsList>
				<TabsContent value="header">
					<MonacoEditor
						content={header}
						onChange={onHeaderChange}
						language="html"
						height="300px"
						options={{
							wordWrap: "on",
							minimap: { enabled: false },
						}}
					/>
				</TabsContent>
				<TabsContent value="footer">
					<MonacoEditor
						content={footer}
						onChange={onFooterChange}
						language="html"
						height="300px"
						options={{
							wordWrap: "on",
							minimap: { enabled: false },
						}}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
