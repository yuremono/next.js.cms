import * as React from "react";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { cn } from "@/lib/utils";

interface EnhancedTextareaProps extends React.ComponentProps<"textarea"> {
  onTagInsert?: (taggedText: string) => void;
  processNewlines?: boolean; // 改行処理オプションを追加
}

const tagOptions = [
  { label: "h1", openTag: "<h1>", closeTag: "</h1>" },
  { label: "h2", openTag: "<h2>", closeTag: "</h2>" },
  { label: "h3", openTag: "<h3>", closeTag: "</h3>" },
  { label: "p", openTag: "<p>", closeTag: "</p>" },
  { label: "b", openTag: "<b>", closeTag: "</b>" },
  { label: "u", openTag: "<u>", closeTag: "</u>" },
  { label: "mark", openTag: "<mark>", closeTag: "</mark>" },
  { label: "small", openTag: "<small>", closeTag: "</small>" },
  { label: "span", openTag: "<span>", closeTag: "</span>" },
];

function EnhancedTextarea({
  className,
  onTagInsert,
  processNewlines = false,
  ...props
}: EnhancedTextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [wrapEnabled, setWrapEnabled] = React.useState(true);

  // processNewlinesを除外したpropsを作成
  const { processNewlines: _, ...textareaProps } = {
    processNewlines,
    ...props,
  };

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

  const toggleWrap = () => {
    setWrapEnabled(!wrapEnabled);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const originalValue = e.target.value;
    console.log("=== EnhancedTextarea Change Event ===");
    console.log("Original textarea value:", originalValue);
    console.log("Contains newlines:", originalValue.includes("\n"));
    console.log("processNewlines:", processNewlines);
    console.log("wrapEnabled:", wrapEnabled);

    if (props.onChange) {
      if (processNewlines) {
        if (wrapEnabled) {
          // 改行ONの場合：改行文字を<br>に変換
          const processedValue = originalValue.replace(/\n/g, "<br>");
          console.log("Processed value (newlines → <br>):", processedValue);

          // 変換された値でonChangeを呼び出す
          const newEvent = {
            ...e,
            target: { ...e.target, value: processedValue },
          } as React.ChangeEvent<HTMLTextAreaElement>;
          props.onChange(newEvent);
        } else {
          // 改行OFFの場合：改行文字を削除
          const processedValue = originalValue.replace(/\n/g, "");
          console.log("Processed value (newlines removed):", processedValue);

          const newEvent = {
            ...e,
            target: { ...e.target, value: processedValue },
          } as React.ChangeEvent<HTMLTextAreaElement>;
          props.onChange(newEvent);
        }
      } else {
        // processNewlinesがfalseの場合は通常処理
        console.log("No processing - passing original value");
        props.onChange(e);
      }
    }
  };

  return (
    <div className="flex flex-1 flex-col space-y-2">
      <div className="mb-2 flex flex-wrap gap-2">
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
        <Button
          type="button"
          variant={wrapEnabled ? "default" : "outline"}
          size="sm"
          onClick={toggleWrap}
          title={wrapEnabled ? "改行無効にする" : "改行有効にする"}
        >
          {wrapEnabled ? "改行ON" : "改行OFF"}
        </Button>
        {processNewlines && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled
            title="改行処理が有効です"
          >
            改行処理ON
          </Button>
        )}
      </div>
      <Textarea
        onChange={handleChange}
        ref={textareaRef}
        className={cn("min-h-32 flex-1", className)}
        {...textareaProps}
      />
      {processNewlines && (
        <div className="mt-2 rounded bg-gray-50 p-2 text-xs text-gray-500">
          <div>
            <strong>デバッグ情報:</strong>
          </div>
          <div>
            改行モード:{" "}
            <span className="font-mono">{wrapEnabled ? "ON" : "OFF"}</span>
          </div>
          <div>
            現在の値: <span className="font-mono">{props.value}</span>
          </div>
          <div>
            改行数:{" "}
            <span className="font-mono">
              {String(props.value || "").split("<br>").length - 1}
            </span>
          </div>
          <div>
            改行文字数:{" "}
            <span className="font-mono">
              {String(props.value || "").split("\n").length - 1}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export { EnhancedTextarea };
