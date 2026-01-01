"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface TextGeneratorProps {
	onSelect: (text: string) => void;
}

export function TextGenerator({ onSelect }: TextGeneratorProps) {
	const [prompt, setPrompt] = useState("");
	const [topic, setTopic] = useState("");
	const [tone, setTone] = useState("親しみやすい");
	const [generatedText, setGeneratedText] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const generateText = async () => {
		if (!prompt.trim()) {
			setError("プロンプトを入力してください");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const fullPrompt = `トピック: ${topic}\nトーン: ${tone}\n\n${prompt}`;

			const response = await fetch("/api/ai/generate-text", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ prompt: fullPrompt }),
			});

			if (!response.ok) {
				throw new Error("テキスト生成に失敗しました");
			}

			const data = await response.json();
			if (data.error) {
        setError(`${data.error}${data.details ? `: ${data.details}` : ""}`);
      } else {
        setGeneratedText(data.text);
      }
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "エラーが発生しました"
			);
		} finally {
			setLoading(false);
		}
	};

	const handleSelect = () => {
		if (generatedText) {
			onSelect(generatedText);
		}
	};

	return (
    <div className="TextGenerator flex h-full flex-col space-y-6">
      <Card className="flex flex-1 flex-col rounded-sm p-4">
        <h3 className="mb-4">AIテキスト生成</h3>

        <div className="flex flex-1 flex-col space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">トピック</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例: レストラン、旅行、製品など"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">文章のトーン</Label>
            <Input
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="例: フォーマル、カジュアル、親しみやすい"
            />
          </div>

          <div className="flex flex-1 flex-col space-y-2">
            <Label htmlFor="prompt">プロンプト</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="どのようなテキストを生成するか説明してください"
              className="max-h-[50vh] min-h-32 flex-1 resize-none"
            />
          </div>

          <Button onClick={generateText} disabled={loading || !prompt.trim()}>
            {loading ? "生成中..." : "テキストを生成"}
          </Button>

          {error && <p className="text-red-500">{error}</p>}

          {generatedText && (
            <div className="space-y-4">
              <div className="max-h-96 overflow-y-auto rounded border p-4">
                <p className="whitespace-pre-wrap">{generatedText}</p>
              </div>
              <Button onClick={handleSelect}>このテキストを使用</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
 