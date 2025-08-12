import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - ページが見つかりません | CMS",
  description: "お探しのページは見つかりませんでした。",
  robots: "noindex",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            ページが見つかりません
          </h2>
          <p className="text-muted-foreground">
            お探しのページは存在しないか、移動された可能性があります。
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md bg-primary px-8   font-medium text-primary-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            role="button"
            aria-label="ホームページに戻る"
          >
            ホームに戻る
          </Link>
          <Link
            href="/editor"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8   font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            role="button"
            aria-label="エディターページに移動"
          >
            エディターを開く
          </Link>
        </div>

        <div className="  text-muted-foreground">
          <p>
            問題が続く場合は、
            <Link
              href="mailto:support@example.com"
              className="rounded text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="サポートメールを送信"
            >
              サポートまでお問い合わせください
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
