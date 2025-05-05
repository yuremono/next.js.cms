"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { MonacoEditor } from "./monaco-editor";

interface CssEditorModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialCss: string;
	onSave: (css: string) => void;
}

export function CssEditorModal({
	isOpen,
	onClose,
	initialCss,
	onSave,
}: CssEditorModalProps) {
	const [cssContent, setCssContent] = useState(initialCss);

	const handleSave = () => {
		onSave(cssContent);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
				<DialogHeader>
					<DialogTitle>カスタムCSSの編集</DialogTitle>
				</DialogHeader>
				<div className="flex-1 min-h-[400px]">
					<MonacoEditor
						content={cssContent}
						onChange={setCssContent}
						language="css"
						height="400px"
						options={{
							wordWrap: "on",
							lineNumbers: "on",
						}}
					/>
				</div>
				<DialogFooter className="mt-4">
					<Button variant="outline" onClick={onClose}>
						キャンセル
					</Button>
					<Button onClick={handleSave}>保存</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
