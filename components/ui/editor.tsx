"use client";

import { MonacoEditor } from "./monaco-editor";
import { SimpleHtmlEditor } from "./simple-html-editor";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  language?: string;
  compact?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  language = "html",
  useMonaco = false,
  placeholder,
  compact,
}: EditorProps & { useMonaco?: boolean }) {
  if (useMonaco) {
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

  return (
    <SimpleHtmlEditor
      value={content}
      onChange={onChange}
      placeholder={placeholder}
      compact={compact}
      className="flex-1"
      style={{
        minHeight: "8rem",
        maxHeight: "50vh",
      }}
    />
  );
} 