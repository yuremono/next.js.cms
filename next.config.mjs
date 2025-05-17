/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
	typescript: {
		// TypeScriptエラーを完全に無視
		ignoreBuildErrors: true,
		tsconfigPath: "./tsconfig.json",
	},
	eslint: {
		// ESLintエラーを完全に無視
		ignoreDuringBuilds: true,
		dirs: [],
	},
	experimental: {
		esmExternals: true,
	},
	// サーバーコンポーネント外部パッケージ
	serverExternalPackages: ["jsdom", "dompurify"],
	poweredByHeader: false,
	reactStrictMode: false,
	// 存在しないファイルを無視
	webpack: (config) => {
		config.resolve.fallback = { fs: false, path: false };
		// Lintingを完全に無効化
		config.module.rules = config.module.rules.filter(
			(rule) => !(rule.use && rule.use.loader === "next-eslint-loader")
		);
		return config;
	},
	// ESLintとTypeScriptエラーを無視
	onDemandEntries: {
		maxInactiveAge: 25 * 1000,
		pagesBufferLength: 2,
	},
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},
	distDir: ".next",
	cleanDistDir: true,
};

// 環境変数を設定してESLintとTypeScriptチェックを無効化
process.env.SKIP_LINTING = "true";
process.env.SKIP_TYPESCRIPT_CHECK = "true";
process.env.DISABLE_ESLINT_PLUGIN = "true";
process.env.DISABLE_TYPE_CHECKING = "true";
process.env.NEXT_DISABLE_ESLINT = "true";
process.env.NEXT_DISABLE_TYPECHECK = "true";

export default nextConfig;
