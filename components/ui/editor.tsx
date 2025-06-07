"use client";

import { MonacoEditor } from "./monaco-editor";
import { cn } from "@/lib/utils";
import { EnhancedTextarea } from "./enhanced-textarea";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  language?: string;
}

export function RichTextEditor({
  content,
  onChange,
  language = "html",
  useMonaco = false,
  placeholder,
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
    <EnhancedTextarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
 