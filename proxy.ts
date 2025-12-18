import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Proxy processing: ${request.nextUrl.pathname}
  const { pathname } = request.nextUrl;

  // ローカル画像URLを処理
  if (pathname.startsWith("/_local/images/")) {
    // ファイル名を抽出
    const imageId = pathname.replace("/_local/images/", "");
    // Redirecting local image: ${imageId}

    // APIルートにリダイレクト
    return NextResponse.rewrite(
      new URL(`/api/local-images/${imageId}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
	matcher: ["/_local/images/:path*"],
};
