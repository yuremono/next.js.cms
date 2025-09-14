"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "./button";
import { Textarea } from "./textarea";

interface SimpleHtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  compact?: boolean;
  autoConvertLineBreaks?: boolean;
  commentStyle?: "html" | "css";
}

export function SimpleHtmlEditor({
  value,
  onChange,
  placeholder = "内容を入力してください...",
  className = "",
  style = {},
  compact = false,
  autoConvertLineBreaks = false,
  commentStyle = "html",
}: SimpleHtmlEditorProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // アンドゥ・リドゥ履歴管理
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isUndoRedoOperation, setIsUndoRedoOperation] = useState(false);

  const convertLineBreaksToHtml = useCallback((text: string): string => {
    return text.replace(/\r?\n/g, "<br>");
  }, []);

  const convertHtmlToLineBreaks = useCallback((html: string): string => {
    return html.replace(/<br\s*\/?>/gi, "\n");
  }, []);

  // 履歴に新しい値を追加
  const addToHistory = useCallback(
    (newValue: string) => {
      if (isUndoRedoOperation) return;

      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newValue);
        // 履歴の上限を50に制限
        if (newHistory.length > 50) {
          newHistory.shift();
          return newHistory;
        }
        return newHistory;
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex, isUndoRedoOperation]
  );

  // アンドゥ実行
  const performUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousValue = history[newIndex];
      setHistoryIndex(newIndex);
      setIsUndoRedoOperation(true);
      onChange(previousValue);

      // 次のフレームでフラグをリセット
      requestAnimationFrame(() => {
        setIsUndoRedoOperation(false);
      });
    }
  }, [history, historyIndex, onChange]);

  // リドゥ実行
  const performRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextValue = history[newIndex];
      setHistoryIndex(newIndex);
      setIsUndoRedoOperation(true);
      onChange(nextValue);

      // 次のフレームでフラグをリセット
      requestAnimationFrame(() => {
        setIsUndoRedoOperation(false);
      });
    }
  }, [history, historyIndex, onChange]);

  // プロパティのvalueが外部から変更された時に履歴を更新
  useEffect(() => {
    if (!isUndoRedoOperation && value !== history[historyIndex]) {
      addToHistory(value);
    }
  }, [value, history, historyIndex, isUndoRedoOperation, addToHistory]);

  const getDisplayValue = useCallback((): string => {
    if (autoConvertLineBreaks) {
      return convertHtmlToLineBreaks(value);
    }
    return value;
  }, [value, autoConvertLineBreaks, convertHtmlToLineBreaks]);

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const textarea = e.target;
      const newValue = textarea.value;

      // カーソル位置を保存
      const cursorStart = textarea.selectionStart;
      const cursorEnd = textarea.selectionEnd;

      let finalValue: string;
      if (autoConvertLineBreaks) {
        finalValue = convertLineBreaksToHtml(newValue);
      } else {
        finalValue = newValue;
      }

      // 履歴に追加
      addToHistory(finalValue);
      onChange(finalValue);

      // React再レンダリング後にカーソル位置を復元
      requestAnimationFrame(() => {
        if (textarea && document.activeElement === textarea) {
          textarea.setSelectionRange(cursorStart, cursorEnd);
        }
      });
    },
    [autoConvertLineBreaks, convertLineBreaksToHtml, onChange, addToHistory]
  );

  // カーソル位置を安全に設定するヘルパー関数
  const setCursorPosition = useCallback(
    (textarea: HTMLTextAreaElement, start: number, end: number) => {
      // React の再レンダリング後にカーソル位置を設定
      requestAnimationFrame(() => {
        if (textarea && document.activeElement === textarea) {
          textarea.setSelectionRange(start, end);
        }
      });
    },
    []
  );

  // 行移動・行複製の実装
  const moveLines = useCallback(
    (direction: number, duplicate: boolean = false) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const text = getDisplayValue();
      const lines = text.split("\n");
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // 選択範囲の行番号を取得
      const beforeText = text.substring(0, start);
      const selectedText = text.substring(start, end);
      const startLine = beforeText.split("\n").length - 1;
      const endLine = startLine + selectedText.split("\n").length - 1;

      if (duplicate) {
        // 行複製
        const selectedLines = lines.slice(startLine, endLine + 1);
        const newLines = [...lines];

        if (direction === -1) {
          // 上に複製
          newLines.splice(startLine, 0, ...selectedLines);
        } else {
          // 下に複製
          newLines.splice(endLine + 1, 0, ...selectedLines);
        }

        const newText = newLines.join("\n");
        const newValue = autoConvertLineBreaks
          ? convertLineBreaksToHtml(newText)
          : newText;

        // 履歴に追加
        addToHistory(newValue);
        onChange(newValue);

        // カーソル位置を調整
        if (direction === -1) {
          setCursorPosition(textarea, start, end);
        } else {
          const offset = selectedLines.join("\n").length + 1;
          setCursorPosition(textarea, start + offset, end + offset);
        }
      } else {
        // 行移動
        if (
          (direction === -1 && startLine === 0) ||
          (direction === 1 && endLine === lines.length - 1)
        ) {
          return; // 移動できない
        }

        const selectedLines = lines.slice(startLine, endLine + 1);
        const newLines = [...lines];

        // 選択行を削除
        newLines.splice(startLine, selectedLines.length);

        // 新しい位置に挿入
        const newStartLine = startLine + direction;
        newLines.splice(newStartLine, 0, ...selectedLines);

        const newText = newLines.join("\n");
        const newValue = autoConvertLineBreaks
          ? convertLineBreaksToHtml(newText)
          : newText;

        // 履歴に追加
        addToHistory(newValue);
        onChange(newValue);

        // カーソル位置を調整
        const beforeNewStart = newLines.slice(0, newStartLine).join("\n");
        const newStart =
          beforeNewStart.length + (beforeNewStart.length > 0 ? 1 : 0);
        const newEnd = newStart + selectedLines.join("\n").length;
        setCursorPosition(textarea, newStart, newEnd);
      }
    },
    [
      getDisplayValue,
      onChange,
      autoConvertLineBreaks,
      convertLineBreaksToHtml,
      setCursorPosition,
      addToHistory,
    ]
  );

  // コメント切り替えの実装（改善版）
  const toggleComment = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const text = getDisplayValue();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);

    let newText: string;
    let newStart: number;
    let newEnd: number;

    if (commentStyle === "css") {
      // CSSスタイルのコメント /* */
      if (selectedText.startsWith("/* ") && selectedText.endsWith(" */")) {
        // コメントを解除
        const uncommented = selectedText.slice(3, -3);
        newText = text.substring(0, start) + uncommented + text.substring(end);
        newStart = start;
        newEnd = start + uncommented.length;
      } else {
        // コメントを追加
        const commented = `/* ${selectedText} */`;
        newText = text.substring(0, start) + commented + text.substring(end);
        newStart = start;
        newEnd = start + commented.length;
      }
    } else {
      // HTMLスタイルのコメント <!-- -->
      if (selectedText.startsWith("<!-- ") && selectedText.endsWith(" -->")) {
        // コメントを解除
        const uncommented = selectedText.slice(5, -4);
        newText = text.substring(0, start) + uncommented + text.substring(end);
        newStart = start;
        newEnd = start + uncommented.length;
      } else {
        // コメントを追加
        const commented = `<!-- ${selectedText} -->`;
        newText = text.substring(0, start) + commented + text.substring(end);
        newStart = start;
        newEnd = start + commented.length;
      }
    }

    const newValue = autoConvertLineBreaks
      ? convertLineBreaksToHtml(newText)
      : newText;

    // 履歴に追加
    addToHistory(newValue);
    onChange(newValue);

    setCursorPosition(textarea, newStart, newEnd);
  }, [
    getDisplayValue,
    onChange,
    autoConvertLineBreaks,
    convertLineBreaksToHtml,
    commentStyle,
    setCursorPosition,
    addToHistory,
  ]);

  // インデントの実装（改善版）
  const handleIndent = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const text = getDisplayValue();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      // カーソル位置にタブ（4スペース）を挿入
      const newText = text.substring(0, start) + "    " + text.substring(end);
      const newValue = autoConvertLineBreaks
        ? convertLineBreaksToHtml(newText)
        : newText;

      // 履歴に追加
      addToHistory(newValue);
      onChange(newValue);

      setCursorPosition(textarea, start + 4, start + 4);
    } else {
      // 選択範囲の各行をインデント
      const beforeText = text.substring(0, start);
      const selectedText = text.substring(start, end);
      const afterText = text.substring(end);

      const lines = selectedText.split("\n");
      const indentedLines = lines.map((line) => "    " + line);
      const indentedText = indentedLines.join("\n");

      const newText = beforeText + indentedText + afterText;
      const newValue = autoConvertLineBreaks
        ? convertLineBreaksToHtml(newText)
        : newText;

      // 履歴に追加
      addToHistory(newValue);
      onChange(newValue);

      setCursorPosition(textarea, start, start + indentedText.length);
    }
  }, [
    getDisplayValue,
    onChange,
    autoConvertLineBreaks,
    convertLineBreaksToHtml,
    setCursorPosition,
    addToHistory,
  ]);

  // アンインデントの実装（改善版）
  const handleUnindent = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const text = getDisplayValue();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      // カーソル位置から4スペースまたはタブを削除
      const beforeCursor = text.substring(0, start);
      const afterCursor = text.substring(start);

      if (beforeCursor.endsWith("    ")) {
        const newText = beforeCursor.slice(0, -4) + afterCursor;
        const newValue = autoConvertLineBreaks
          ? convertLineBreaksToHtml(newText)
          : newText;

        // 履歴に追加
        addToHistory(newValue);
        onChange(newValue);

        setCursorPosition(textarea, start - 4, start - 4);
      } else if (beforeCursor.endsWith("\t")) {
        const newText = beforeCursor.slice(0, -1) + afterCursor;
        const newValue = autoConvertLineBreaks
          ? convertLineBreaksToHtml(newText)
          : newText;

        // 履歴に追加
        addToHistory(newValue);
        onChange(newValue);

        setCursorPosition(textarea, start - 1, start - 1);
      }
    } else {
      // 選択範囲の各行をアンインデント
      const beforeText = text.substring(0, start);
      const selectedText = text.substring(start, end);
      const afterText = text.substring(end);

      const lines = selectedText.split("\n");
      const unindentedLines = lines.map((line) => {
        if (line.startsWith("    ")) {
          return line.substring(4);
        } else if (line.startsWith("\t")) {
          return line.substring(1);
        }
        return line;
      });
      const unindentedText = unindentedLines.join("\n");

      const newText = beforeText + unindentedText + afterText;
      const newValue = autoConvertLineBreaks
        ? convertLineBreaksToHtml(newText)
        : newText;

      // 履歴に追加
      addToHistory(newValue);
      onChange(newValue);

      setCursorPosition(textarea, start, start + unindentedText.length);
    }
  }, [
    getDisplayValue,
    onChange,
    autoConvertLineBreaks,
    convertLineBreaksToHtml,
    setCursorPosition,
    addToHistory,
  ]);

  // キーボードショートカットのハンドラー
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const isMac =
        typeof navigator !== "undefined" &&
        navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;
      const altKey = e.altKey;

      // 行移動: Alt+↑/↓ (Windows/Linux) - macOSのCmd+↑/↓はコメントアウト
      if (
        altKey &&
        !ctrlKey &&
        (e.key === "ArrowUp" || e.key === "ArrowDown")
      ) {
        e.preventDefault();
        moveLines(e.key === "ArrowUp" ? -1 : 1, e.shiftKey);
        return;
      }

      // macOSのCmd+↑/↓ と Cmd+Shift+↑/↓ はコメントアウト（Optionが使えるため）
      // if (
      //   ctrlKey && !altKey &&
      //   (e.key === "ArrowUp" || e.key === "ArrowDown")
      // ) {
      //   e.preventDefault();
      //   moveLines(e.key === "ArrowUp" ? -1 : 1, e.shiftKey);
      //   return;
      // }

      // コメント切り替え: Cmd+/ (macOS) または Ctrl+/ (Windows/Linux)
      if (ctrlKey && e.key === "/") {
        e.preventDefault();
        toggleComment();
        return;
      }

      // Undo: Cmd+Z (macOS) または Ctrl+Z (Windows/Linux)
      if (ctrlKey && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        performUndo();
        return;
      }

      // Redo: Cmd+Shift+Z (macOS) または Ctrl+Shift+Z (Windows/Linux)
      if (ctrlKey && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        performRedo();
        return;
      }

      // Redo: Cmd+Y (macOS) または Ctrl+Y (Windows/Linux) - 代替ショートカット
      if (ctrlKey && e.key === "y") {
        e.preventDefault();
        performRedo();
        return;
      }

      // Tabでインデント、Shift+Tabでアンインデント
      if (e.key === "Tab") {
        e.preventDefault();
        if (e.shiftKey) {
          handleUnindent();
        } else {
          handleIndent();
        }
        return;
      }
    },
    [
      moveLines,
      toggleComment,
      handleIndent,
      handleUnindent,
      performUndo,
      performRedo,
    ]
  );

  const insertTag = useCallback(
    (tag: string) => {
      if (!textareaRef.current) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = getDisplayValue().substring(start, end);

      let insertText = "";
      let cursorOffset = 0;

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
          insertText = `<b>${selectedText || "テキスト"}</b>`;
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
          cursorOffset = insertText.length - 1;
          break;
        case "style":
          insertText = ` style=""`;
          cursorOffset = insertText.length - 1;
          break;
      }

      // 安定したテキスト挿入処理（document.execCommandを使用しない）
      const currentDisplayValue = getDisplayValue();
      const newDisplayValue =
        currentDisplayValue.substring(0, start) +
        insertText +
        currentDisplayValue.substring(end);

      let finalValue: string;
      if (autoConvertLineBreaks) {
        finalValue = convertLineBreaksToHtml(newDisplayValue);
      } else {
        finalValue = newDisplayValue;
      }

      // 履歴に追加
      addToHistory(finalValue);
      onChange(finalValue);

      // カーソル位置を設定
      setCursorPosition(textarea, start + cursorOffset, start + cursorOffset);
    },
    [
      getDisplayValue,
      onChange,
      autoConvertLineBreaks,
      convertLineBreaksToHtml,
      setCursorPosition,
      addToHistory,
    ]
  );

  return (
    <div
      className={`SimpleHtmlEditor ${className} flex flex-1 flex-col`}
      style={style}
    >
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

      <div
        className="flex min-h-32 flex-1 flex-col rounded-b-md border"
        style={{ minHeight: "8rem" }}
      >
        {!compact && previewMode ? (
          <div
            className="prose prose-sm max-w-none p-3"
            dangerouslySetInnerHTML={{ __html: value }}
            style={{
              minHeight: "6rem",
              backgroundColor: "#fafafa",
              fontSize: "16px",
              lineHeight: "1.5",
            }}
          />
        ) : (
          <Textarea
            ref={textareaRef}
            value={getDisplayValue()}
            onChange={handleTextareaChange}
            placeholder={placeholder}
            className="flex-1 resize-none rounded-b-md border-0 focus:ring-0"
            style={{
              minHeight: "6rem",
              fontSize: "16px",
              lineHeight: "1.5",
            }}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        )}
      </div>

      {autoConvertLineBreaks && (
        <div className="mt-2 text-xs text-muted-foreground">
          改行は&lt;br&gt;タグに変換されます
        </div>
      )}
    </div>
  );
}
