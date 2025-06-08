"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "./button";
import { Textarea } from "./textarea";

interface SimpleHtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  compact?: boolean;
}

export function SimpleHtmlEditor({
  value,
  onChange,
  placeholder = "内容を入力してください...",
  className = "",
  style = {},
  compact = false,
}: SimpleHtmlEditorProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTag = useCallback(
    (tag: string) => {
      if (!textareaRef.current) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);

      let insertText = "";
      let cursorOffset = 0; // カーソルの移動位置

      switch (tag) {
        case "h1":
          insertText = `<h1>${selectedText || "ヘッダー1"}</h1>`;
          cursorOffset = insertText.length;
          break;
        case "h2":
          insertText = `<h2>${selectedText || "ヘッダー2"}</h2>`;
          cursorOffset = insertText.length;
          break;
        case "h3":
          insertText = `<h3>${selectedText || "ヘッダー3"}</h3>`;
          cursorOffset = insertText.length;
          break;
        case "p":
          insertText = `<p>${selectedText || "テキスト"}</p>`;
          cursorOffset = insertText.length;
          break;
        case "bold":
          insertText = `<strong>${selectedText || "テキスト"}</strong>`;
          cursorOffset = insertText.length;
          break;
        case "italic":
          insertText = `<em>${selectedText || "テキスト"}</em>`;
          cursorOffset = insertText.length;
          break;
        case "underline":
          insertText = `<u>${selectedText || "テキスト"}</u>`;
          cursorOffset = insertText.length;
          break;
        case "span":
          insertText = `<span>${selectedText || "テキスト"}</span>`;
          cursorOffset = insertText.length;
          break;
        case "mark":
          insertText = `<mark>${selectedText || "テキスト"}</mark>`;
          cursorOffset = insertText.length;
          break;
        case "ul":
          insertText = `<ul>\n  <li>${selectedText || "リスト項目"}</li>\n</ul>`;
          cursorOffset = insertText.length;
          break;
        case "br":
          insertText = "<br>";
          cursorOffset = insertText.length;
          break;
        case "class":
          insertText = ` class=""`;
          cursorOffset = insertText.length - 1; // ""の間にカーソル
          break;
        case "style":
          insertText = ` style=""`;
          cursorOffset = insertText.length - 1; // ""の間にカーソル
          break;
      }

      // フォーカスを確保
      textarea.focus();

      // 選択範囲を設定
      textarea.setSelectionRange(start, end);

      // document.execCommandを使ってundo/redo履歴に追加
      if (document.execCommand) {
        document.execCommand("insertText", false, insertText);
      } else {
        // フォールバック: モダンブラウザ用
        const inputEvent = new InputEvent("beforeinput", {
          bubbles: true,
          cancelable: true,
          inputType: "insertText",
          data: insertText,
        });

        if (textarea.dispatchEvent(inputEvent)) {
          const newValue =
            value.substring(0, start) + insertText + value.substring(end);
          onChange(newValue);
        }
      }

      // カーソル位置を設定
      setTimeout(() => {
        const newCursorPos = start + cursorOffset;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [value, onChange]
  );

  return (
    <div className={`simple-html-editor ${className}`} style={style}>
      {/* ツールバー */}
      <div className="flex flex-wrap gap-2 rounded-t-md border-b">
        <div className="mb-2 flex flex-wrap gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("h1")}
            className="text-xs"
          >
            H1
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("h2")}
            className="text-xs"
          >
            H2
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("h3")}
            className="text-xs"
          >
            H3
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("p")}
            className="text-xs"
          >
            P
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("bold")}
            className="text-xs"
          >
            <strong>B</strong>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("italic")}
            className="text-xs"
          >
            <em>I</em>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("underline")}
            className="text-xs"
          >
            <u>U</u>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("span")}
            className="text-xs"
          >
            span
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("mark")}
            className="text-xs"
          >
            mark
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("ul")}
            className="text-xs"
          >
            UL
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("br")}
            className="text-xs"
          >
            改行
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("class")}
            className="text-xs"
            style={{ border: "1px solid var(--primary)" }}
          >
            class
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertTag("style")}
            className="text-xs"
            style={{ border: "1px solid var(--primary)" }}
          >
            style
          </Button>
        </div>
        {!compact && (
          <div className="ml-auto flex gap-1">
            <Button
              type="button"
              variant={!previewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode(false)}
              className="text-xs"
            >
              編集
            </Button>
            <Button
              type="button"
              variant={previewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode(true)}
              className="text-xs"
            >
              プレビュー
            </Button>
          </div>
        )}
      </div>

      {/* エディタエリア */}
      <div
        className="min-h-32 rounded-b-md border"
        style={{ minHeight: "8rem" }}
      >
        {!compact && previewMode ? (
          <div
            className="prose prose-sm max-w-none p-3"
            dangerouslySetInnerHTML={{ __html: value }}
            style={{
              minHeight: "6rem",
              backgroundColor: "#fafafa",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          />
        ) : (
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="resize-none rounded-b-md border-0 focus:ring-0"
            style={{
              minHeight: "6rem",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          />
        )}
      </div>
    </div>
  );
}
