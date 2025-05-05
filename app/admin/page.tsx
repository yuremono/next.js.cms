import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FileText, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">ダッシュボード</h1>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<FileText className="h-6 w-6 text-blue-500" />
							<h2 className="text-xl font-medium">ページ管理</h2>
						</div>
					</div>
					<p className="mt-2 text-gray-500 dark:text-gray-400">
						Webサイトのページを作成・編集・管理します。
					</p>
					<div className="mt-4 flex space-x-2">
						<Button asChild>
							<Link href="/admin/pages">ページ一覧</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/admin/pages/new">
								<Plus className="h-4 w-4 mr-1" />
								新規作成
							</Link>
						</Button>
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center space-x-2">
						<Settings className="h-6 w-6 text-blue-500" />
						<h2 className="text-xl font-medium">設定</h2>
					</div>
					<p className="mt-2 text-gray-500 dark:text-gray-400">
						サイト全体の設定やAPIキーの管理を行います。
					</p>
					<div className="mt-4">
						<Button asChild>
							<Link href="/admin/settings">設定を開く</Link>
						</Button>
					</div>
				</Card>
			</div>

			<div className="mt-8">
				<h2 className="text-xl font-medium mb-4">クイックガイド</h2>
				<Card className="p-6">
					<div className="prose dark:prose-invert max-w-none">
						<h3>使い方</h3>
						<ol>
							<li>
								「ページ管理」からWebサイトのページを作成・編集できます。
							</li>
							<li>
								テンプレートを使うことで、簡単にコンテンツを作成できます。
							</li>
							<li>
								AIテキスト生成機能を使って、コンテンツの作成を効率化できます。
							</li>
							<li>
								「設定」からAPIキーや基本設定を管理できます。
							</li>
						</ol>
					</div>
				</Card>
			</div>
		</div>
	);
}
