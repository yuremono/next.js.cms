/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    domains: ["localhost", "next-js-cms.vercel.app", "vercel.app"],
    unoptimized: process.env.NODE_ENV === "production",
  },
  typescript: {
    // TypeScriptエラーはチェックする（ただし、本番では無視されるよう設定済み）
    ignoreBuildErrors: false,
    tsconfigPath: "./tsconfig.json",
  },
  eslint: {
    // ESLintエラーはチェックする
    ignoreDuringBuilds: false,
    dirs: ["app", "components", "lib", "types"],
  },
  experimental: {
    esmExternals: true,
  },
  // サーバーコンポーネント外部パッケージ
  serverExternalPackages: ["jsdom", "dompurify"],
  poweredByHeader: false,
  reactStrictMode: false,
  // サーバーサイドでのfsとpathモジュールの対応
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  // 
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

// 環境変数設定は削除（正常なlint/TypeScriptチェックを有効化）

export default nextConfig;
