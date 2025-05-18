import { MonacoEditor } from "./monaco-editor";

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
	const content = JSON.stringify(value, null, 2);
	return (
		<div className="space-y-2">
			<MonacoEditor
				content={content}
				onChange={(updatedContent: string) => {
					try {
						const parsed = JSON.parse(updatedContent);
						onChange(parsed);
					} catch (e) {
						// JSONの解析エラーは無視
						console.error("Invalid JSON:", e);
					}
				}}
				language="json"
				height={height}
				options={{
					wordWrap: "on",
					formatOnPaste: true,
					formatOnType: true,
				}}
			/>
		</div>
	);
}
