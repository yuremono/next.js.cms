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
		<div className="space-y-6">
			<Card className="p-4">
				<h3 className="text-lg font-medium mb-4">ヘッダー設定</h3>

				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="header-html">HTMLを直接編集</Label>
						<EnhancedTextarea
							id="header-html"
							value={html}
							onChange={handleHtmlChange}
							className="font-mono text-sm min-h-[200px]"
							placeholder="ここにヘッダーのHTMLを入力..."
						/>
					</div>

					<div className="mt-4">
						<h4 className="font-medium mb-2">ヘッダープレビュー</h4>
						<div className="border rounded p-4 bg-white">
							<div dangerouslySetInnerHTML={{ __html: html }} />
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}
