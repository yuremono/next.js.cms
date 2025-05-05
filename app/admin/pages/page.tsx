"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { PageTemplate } from "@/types";

export default function PagesListPage() {
	const [pages, setPages] = useState<PageTemplate[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

	// ページ一覧を取得
	useEffect(() => {
		const fetchPages = async () => {
			try {
				const response = await fetch("/api/page");
				if (!response.ok) {
					throw new Error("ページの取得に失敗しました");
				}
				const data = await response.json();
				setPages(data.pages || []);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "エラーが発生しました"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchPages();
	}, []);

	// ページを削除
	const deletePage = async (id: string) => {
		if (!id || !window.confirm("本当にこのページを削除しますか？")) {
			return;
		}

		setDeleteLoading(id);
		try {
			const response = await fetch(`/api/page?id=${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("ページの削除に失敗しました");
			}

			// 成功したらリストから削除
			setPages(pages.filter((page) => page.id !== id));
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "エラーが発生しました"
			);
		} finally {
			setDeleteLoading(null);
		}
	};

	// ページ一覧をレンダリング
	const renderPages = () => {
		if (loading) {
			return (
				<div className="flex justify-center items-center h-40">
					<Loader2 className="h-8 w-8 animate-spin text-gray-500" />
				</div>
			);
		}

		if (error) {
			return (
				<div className="text-center text-red-500 p-4">
					<p>{error}</p>
					<Button
						onClick={() => window.location.reload()}
						className="mt-2"
					>
						再読み込み
					</Button>
				</div>
			);
		}

		if (pages.length === 0) {
			return (
				<div className="text-center p-8">
					<p className="text-gray-500 mb-4">ページがまだありません</p>
					<Button asChild>
						<Link href="/admin/pages/new">
							<Plus className="h-4 w-4 mr-2" />
							新しいページを作成
						</Link>
					</Button>
				</div>
			);
		}

		return (
			<div className="grid gap-4">
				{pages.map((page) => (
					<Card key={page.id} className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="font-medium text-lg">
									{page.title}
								</h3>
								<p className="text-sm text-gray-500">
									/{page.slug}
								</p>
							</div>
							<div className="flex space-x-2">
								<Button variant="outline" size="sm" asChild>
									<Link
										href={`/${page.slug}`}
										target="_blank"
									>
										<Eye className="h-4 w-4 mr-1" />
										表示
									</Link>
								</Button>
								<Button variant="outline" size="sm" asChild>
									<Link href={`/admin/pages/${page.id}`}>
										<Edit className="h-4 w-4 mr-1" />
										編集
									</Link>
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => deletePage(page.id)}
									disabled={deleteLoading === page.id}
									className="text-red-500 hover:text-red-600"
								>
									{deleteLoading === page.id ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<>
											<Trash2 className="h-4 w-4 mr-1" />
											削除
										</>
									)}
								</Button>
							</div>
						</div>
					</Card>
				))}
			</div>
		);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">ページ管理</h1>
				<Button asChild>
					<Link href="/admin/pages/new">
						<Plus className="h-4 w-4 mr-2" />
						新規作成
					</Link>
				</Button>
			</div>

			{renderPages()}
		</div>
	);
}
