"use client";

import { useState, useEffect } from "react";
import { MonacoEditor } from "./monaco-editor";
import { Alert, AlertDescription } from "./alert";
import { AlertCircle } from "lucide-react";

interface JsonEditorProps {
	value: object;
	onChange: (value: object) => void;
	height?: string;
}

export function JsonEditor({
	value,
	onChange,
	height = "300px",
}: JsonEditorProps) {
	const [content, setContent] = useState<string>(
		JSON.stringify(value, null, 2)
	);
	const [error, setError] = useState<string | null>(null);

	// 値が外部から変更された場合に対応
	useEffect(() => {
		const stringified = JSON.stringify(value, null, 2);
		if (stringified !== content) {
			setContent(stringified);
		}
	}, [value]);

	const handleChange = (newContent: string) => {
		setContent(newContent);
		try {
			const parsed = JSON.parse(newContent);
			onChange(parsed);
			setError(null);
		} catch (e) {
			setError((e as Error).message);
		}
	};

	return (
		<div className="space-y-2">
			<MonacoEditor
				content={content}
				onChange={handleChange}
				language="json"
				height={height}
				options={{
					wordWrap: "on",
					formatOnPaste: true,
					formatOnType: true,
				}}
			/>
			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
