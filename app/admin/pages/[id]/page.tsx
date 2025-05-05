"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TemplateForm } from "@/components/sections/TemplateForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextGenerator } from "@/components/sections/TextGenerator";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { PageTemplate } from "@/types";

export default function EditPagePage({ params }: { params: { id: string } }) {
	const router = useRouter();
	const { id } = params;

	const [page, setPage] = useState<PageTemplate | null>(null);
	const [loading, setLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState("editor");

	// ページデータを取得
	useEffect(() => {
		const fetchPage = async () => {
			try {
				const response = await fetch(`/api/page?id=${id}`);
				if (!response.ok) {
					throw new Error("ページの取得に失敗しました");
				}

				const data = await response.json();
				if (!data.page) {
					throw new Error("ページが見つかりませんでした");
				}

				setPage(data.page);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "エラーが発生しました"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchPage();
	}, [id]);

	// ページを更新
	const handleSubmit = async (data: any) => {
		setIsSubmitting(true);
		setError(null);

		try {
			const response = await fetch(`/api/page?id=${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message || "ページの更新に失敗しました"
				);
			}

			// 成功したらページ一覧に戻る
			router.push("/admin/pages");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "エラーが発生しました"
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	// 生成されたテキストを適用
	const handleGeneratedText = (text: string) => {
		if (page) {
			setPage({
				...page,
				content: text,
			});
		}
		setActiveTab("editor");
	};

	// ローディング表示
	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
			</div>
		);
	}

	// エラー表示
	if (error || !page) {
		return (
			<div className="space-y-4">
				<Button variant="outline" size="icon" asChild>
					<Link href="/admin/pages">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-600">
					{error || "ページが見つかりませんでした"}
				</div>
				<Button onClick={() => router.push("/admin/pages")}>
					ページ一覧に戻る
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="outline" size="icon" asChild>
					<Link href="/admin/pages">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<h1 className="text-2xl font-bold">
					ページを編集: {page.title}
				</h1>
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
						initialData={page}
						onSubmit={handleSubmit}
						isSubmitting={isSubmitting}
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
