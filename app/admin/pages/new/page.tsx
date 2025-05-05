"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TemplateForm } from "@/components/sections/TemplateForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextGenerator } from "@/components/sections/TextGenerator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewPagePage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState("editor");
	const [editorContent, setEditorContent] = useState("");

	const handleSubmit = async (data: any) => {
		setIsSubmitting(true);
		setError(null);

		try {
			const response = await fetch("/api/page", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message || "ページの作成に失敗しました"
				);
			}

			// 成功したらページ一覧に戻る
			router.push("/admin/pages");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "エラーが発生しました"
			);
			setIsSubmitting(false);
		}
	};

	const handleGeneratedText = (text: string) => {
		setEditorContent(text);
		setActiveTab("editor");
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="outline" size="icon" asChild>
					<Link href="/admin/pages">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<h1 className="text-2xl font-bold">新しいページを作成</h1>
			</div>

			{error && (
				<div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-600">
					{error}
				</div>
			)}

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="editor">エディタ</TabsTrigger>
					<TabsTrigger value="ai-generator">
						AIコンテンツ生成
					</TabsTrigger>
				</TabsList>
				<TabsContent value="editor" className="p-4 border rounded-md">
					<TemplateForm
						onSubmit={handleSubmit}
						isSubmitting={isSubmitting}
						initialData={
							editorContent
								? { content: editorContent }
								: undefined
						}
					/>
				</TabsContent>
				<TabsContent
					value="ai-generator"
					className="p-4 border rounded-md"
				>
					<TextGenerator onSelect={handleGeneratedText} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
