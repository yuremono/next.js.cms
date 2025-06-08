import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

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
			<body>
				{children}
				<Toaster
					position="top-right"
					toastOptions={{ style: { marginTop: "72px" } }}
				/>
			</body>
		</html>
	);
}
 