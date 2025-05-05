"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SidebarItem {
	title: string;
	href: string;
	icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
	{
		title: "ダッシュボード",
		href: "/admin",
		icon: <LayoutDashboard className="h-5 w-5" />,
	},
	{
		title: "ページ管理",
		href: "/admin/pages",
		icon: <FileText className="h-5 w-5" />,
	},
	{
		title: "設定",
		href: "/admin/settings",
		icon: <Settings className="h-5 w-5" />,
	},
];

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900">
			{/* モバイルサイドバートグルボタン */}
			<div className="md:hidden fixed top-4 left-4 z-50">
				<Button
					variant="outline"
					size="icon"
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className="bg-white dark:bg-gray-800"
				>
					{sidebarOpen ? (
						<X className="h-5 w-5" />
					) : (
						<Menu className="h-5 w-5" />
					)}
				</Button>
			</div>

			{/* サイドバー */}
			<div
				className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-200 ease-in-out ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				} md:translate-x-0 md:static md:h-screen flex flex-col border-r dark:border-gray-700`}
			>
				{/* サイドバーヘッダー */}
				<div className="p-4 border-b dark:border-gray-700">
					<h1 className="text-xl font-bold">CMS管理画面</h1>
				</div>

				{/* サイドバーナビゲーション */}
				<nav className="flex-1 p-4 space-y-2">
					{sidebarItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={`flex items-center p-2 rounded-md transition-colors ${
								pathname === item.href
									? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
									: "hover:bg-gray-100 dark:hover:bg-gray-700"
							}`}
						>
							{item.icon}
							<span className="ml-3">{item.title}</span>
						</Link>
					))}
				</nav>
			</div>

			{/* メインコンテンツ */}
			<div className="md:ml-64 p-6">
				<main>{children}</main>
			</div>
		</div>
	);
}
