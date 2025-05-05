import * as React from "react";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { cn } from "@/lib/utils";

interface EnhancedTextareaProps extends React.ComponentProps<"textarea"> {
	onTagInsert?: (taggedText: string) => void;
}

const tagOptions = [
	{ label: "見出し1", openTag: "<h1>", closeTag: "</h1>" },
	{ label: "見出し2", openTag: "<h2>", closeTag: "</h2>" },
	{ label: "見出し3", openTag: "<h3>", closeTag: "</h3>" },
	{ label: "段落", openTag: "<p>", closeTag: "</p>" },
	{ label: "太字", openTag: "<b>", closeTag: "</b>" },
	{ label: "下線", openTag: "<u>", closeTag: "</u>" },
	{ label: "マーク", openTag: "<mark>", closeTag: "</mark>" },
	{ label: "小文字", openTag: "<small>", closeTag: "</small>" },
	{ label: "インライン", openTag: "<span>", closeTag: "</span>" },
];

function EnhancedTextarea({
	className,
	onTagInsert,
	...props
}: EnhancedTextareaProps) {
	const textareaRef = React.useRef<HTMLTextAreaElement>(null);

	const insertTag = (openTag: string, closeTag: string) => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selectedText = textarea.value.substring(start, end);
		const taggedText = openTag + selectedText + closeTag;

		const newValue =
			textarea.value.substring(0, start) +
			taggedText +
			textarea.value.substring(end);

		// テキストエリアの値を更新
		if (props.onChange) {
			const event = {
				target: {
					...textarea,
					value: newValue,
				},
			} as React.ChangeEvent<HTMLTextAreaElement>;
			props.onChange(event);
		}

		// カスタムハンドラがあれば呼び出す
		if (onTagInsert) {
			onTagInsert(taggedText);
		}

		// フォーカスを戻す
		textarea.focus();

		// カーソル位置を調整（選択テキストの後ろに配置）
		const newCursorPos = start + taggedText.length;
		textarea.setSelectionRange(newCursorPos, newCursorPos);
	};

	return (
		<div className="space-y-2">
			<div className="flex flex-wrap gap-2 mb-2">
				{tagOptions.map((tag) => (
					<Button
						key={tag.label}
						type="button"
						variant="outline"
						size="sm"
						onClick={() => insertTag(tag.openTag, tag.closeTag)}
					>
						{tag.label}
					</Button>
				))}
			</div>
			<Textarea
				ref={textareaRef}
				className={cn("min-h-16", className)}
				{...props}
			/>
		</div>
	);
}

export { EnhancedTextarea };
