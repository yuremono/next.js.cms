"use client";

import { MonacoEditor } from "./monaco-editor";
import { useState } from "react";

interface EditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
	language?: string;
}

export function RichTextEditor({
	content,
	onChange,
	placeholder = "ここにコンテンツを入力...",
	language = "html",
}: EditorProps) {
	return (
		<MonacoEditor
			content={content}
			onChange={onChange}
			language={language}
			options={{
				wordWrap: "on",
				lineNumbers: "off",
				glyphMargin: false,
				folding: false,
				lineDecorationsWidth: 0,
				lineNumbersMinChars: 0,
			}}
		/>
	);
}
 