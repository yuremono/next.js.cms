import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "簡易CMS - テンプレートベースのWebサイト構築",
	description:
		"AIによるテキスト生成機能を備えた簡易CMSで、簡単にWebサイトを編集できます。",
	viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja" suppressHydrationWarning>
			<body className={inter.className}>
				{children}
				<Toaster
					position="top-right"
					toastOptions={{ style: { marginTop: "72px" } }}
				/>
			</body>
		</html>
	);
}
