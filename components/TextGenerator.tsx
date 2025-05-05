"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { EnhancedTextarea } from "./ui/enhanced-textarea";
import { Label } from "./ui/label";
import { Card } from "./ui/card";

interface TextGeneratorProps {
	onSelect: (text: string) => void;
}

export function TextGenerator({ onSelect }: TextGeneratorProps) {
	const [prompt, setPrompt] = useState("");
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
			const response = await fetch("/api/ai/generate-text", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ prompt }),
			});

			if (!response.ok) {
				throw new Error("テキスト生成に失敗しました");
			}

			const data = await response.json();
			setGeneratedText(data.text);
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
		<div className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="prompt">AIテキスト生成プロンプト</Label>
				<EnhancedTextarea
					id="prompt"
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					placeholder="生成したいテキストの内容を具体的に指示してください"
					rows={4}
				/>
			</div>

			<Button onClick={generateText} disabled={loading || !prompt.trim()}>
				{loading ? "生成中..." : "テキストを生成"}
			</Button>

			{error && <p className="text-red-500">{error}</p>}

			{generatedText && (
				<Card className="p-4">
					<div className="space-y-4">
						<div className="max-h-96 overflow-y-auto">
							<p className="whitespace-pre-wrap">
								{generatedText}
							</p>
						</div>
						<Button onClick={handleSelect}>
							このテキストを使用
						</Button>
					</div>
				</Card>
			)}
		</div>
	);
}
