"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  X,
} from "lucide-react";

interface AccessibilityGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessibilityGuide({
  isOpen,
  onClose,
}: AccessibilityGuideProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="max-h-[90vh] w-full max-w-4xl overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              アクセシビリティテスト使用方法ガイド
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="ガイドを閉じる"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">概要</TabsTrigger>
              <TabsTrigger value="testing">テスト実行</TabsTrigger>
              <TabsTrigger value="understanding">結果の読み方</TabsTrigger>
              <TabsTrigger value="fixing">修正方法</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">
                  アクセシビリティテストとは
                </h3>
                <p className=" text-gray-600">
                  Webサイトが障害を持つユーザーにとっても使いやすいかどうかを自動的にチェックするツールです。
                  WCAG 2.1
                  AA基準に基づいて、色のコントラスト、キーボードナビゲーション、スクリーンリーダー対応などを評価します。
                </p>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">なぜ重要なのか</h3>
                <ul className="space-y-1  text-gray-600">
                  <li>
                    • <strong>法的要件:</strong>{" "}
                    多くの国や地域でアクセシビリティ対応が法的に求められています
                  </li>
                  <li>
                    • <strong>ユーザビリティ:</strong>{" "}
                    すべてのユーザーが情報にアクセスできるようになります
                  </li>
                  <li>
                    • <strong>SEO効果:</strong>{" "}
                    検索エンジンもアクセシブルなサイトを高く評価します
                  </li>
                  <li>
                    • <strong>品質向上:</strong>{" "}
                    コードの品質とUI/UXの向上につながります
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="testing" className="mt-4 space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">テストの実行方法</h3>
                <div className="space-y-3">
                  <div className="rounded-md bg-blue-50 p-3">
                    <h4 className="font-medium text-blue-900">
                      方法1: ボタンクリック
                    </h4>
                    <p className="mt-1  text-blue-700">
                      画面右下の青い🔍ボタンをクリックして「テスト実行」を押します
                    </p>
                  </div>

                  <div className="rounded-md bg-green-50 p-3">
                    <h4 className="font-medium text-green-900">
                      方法2: キーボードショートカット
                    </h4>
                    <p className="mt-1  text-green-700">
                      <kbd className="rounded border bg-white px-2 py-1 text-xs">
                        Ctrl
                      </kbd>{" "}
                      +
                      <kbd className="mx-1 rounded border bg-white px-2 py-1 text-xs">
                        Shift
                      </kbd>{" "}
                      +
                      <kbd className="rounded border bg-white px-2 py-1 text-xs">
                        A
                      </kbd>
                      で即座にテスト実行
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">テスト範囲</h3>
                <p className=" text-gray-600">
                  現在表示されているページ全体をスキャンし、WCAG 2.1
                  AA基準に基づいて以下の項目をチェックします：
                </p>
                <ul className="ml-4 mt-2 space-y-1  text-gray-600">
                  <li>• 色のコントラスト比</li>
                  <li>• ボタンやリンクのアクセシブル名</li>
                  <li>• 画像のalt属性</li>
                  <li>• フォーム要素のラベル</li>
                  <li>• ページの構造（見出し、ランドマーク）</li>
                  <li>• キーボードナビゲーション</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="understanding" className="mt-4 space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">違反レベルの理解</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-md border p-3">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div>
                      <Badge variant="destructive" className="mb-1">
                        Critical
                      </Badge>
                      <p className="">
                        緊急修正が必要。ユーザーが全く利用できない可能性があります
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-md border p-3">
                    <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                    <div>
                      <Badge variant="outline" className="mb-1">
                        Serious
                      </Badge>
                      <p className="">
                        重要な修正が必要。多くのユーザーに影響があります
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-md border p-3">
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div>
                      <Badge variant="outline" className="mb-1">
                        Moderate
                      </Badge>
                      <p className="">
                        中程度の修正が必要。一部のユーザーに影響があります
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-md border p-3">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <div>
                      <Badge variant="outline" className="mb-1">
                        Minor
                      </Badge>
                      <p className="">軽微な修正で改善できます</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">コンソール出力の確認</h3>
                <p className="mb-2  text-gray-600">
                  開発者ツールのコンソールでも詳細な結果を確認できます：
                </p>
                <div className="rounded-md bg-gray-900 p-3 font-mono text-xs text-green-400">
                  🔍 アクセシビリティテスト結果
                  <br />
                  ✅ 合格: 45件
                  <br />
                  ❌ 違反: 3件
                  <br />
                  ⚠️ 不完全: 1件
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fixing" className="mt-4 space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">よくある違反と修正方法</h3>
                <div className="space-y-4">
                  <div className="rounded-md border p-3">
                    <h4 className="mb-2 font-medium text-red-600">
                      color-contrast
                    </h4>
                    <p className="mb-2 ">
                      <strong>問題:</strong>{" "}
                      文字色と背景色のコントラスト比が不足
                    </p>
                    <p className="mb-2 ">
                      <strong>修正:</strong>{" "}
                      より濃い色を使用するか、背景色を調整
                    </p>
                    <p className=" text-gray-600">
                      最小要件: 4.5:1（通常テキスト）、3:1（大きなテキスト）
                    </p>
                  </div>

                  <div className="rounded-md border p-3">
                    <h4 className="mb-2 font-medium text-red-600">
                      button-name
                    </h4>
                    <p className="mb-2 ">
                      <strong>問題:</strong> ボタンに識別可能なテキストがない
                    </p>
                    <p className="mb-2 ">
                      <strong>修正:</strong> aria-labelまたはテキストを追加
                    </p>
                    <code className="rounded bg-gray-100 p-1 text-xs">
                      &lt;button aria-label="メニューを開く"&gt;&lt;MenuIcon
                      /&gt;&lt;/button&gt;
                    </code>
                  </div>

                  <div className="rounded-md border p-3">
                    <h4 className="mb-2 font-medium text-red-600">image-alt</h4>
                    <p className="mb-2 ">
                      <strong>問題:</strong> 画像にalt属性がない
                    </p>
                    <p className="mb-2 ">
                      <strong>修正:</strong>{" "}
                      意味のある画像には説明を、装飾的な画像には空のaltを設定
                    </p>
                    <code className="rounded bg-gray-100 p-1 text-xs">
                      &lt;img src="chart.png" alt="2024年売上グラフ" /&gt;
                    </code>
                  </div>

                  <div className="rounded-md border p-3">
                    <h4 className="mb-2 font-medium text-orange-600">
                      landmark-one-main
                    </h4>
                    <p className="mb-2 ">
                      <strong>問題:</strong> ページにmainランドマークがない
                    </p>
                    <p className="mb-2 ">
                      <strong>修正:</strong>{" "}
                      メインコンテンツを&lt;main&gt;要素で囲む
                    </p>
                    <code className="rounded bg-gray-100 p-1 text-xs">
                      &lt;main&gt;...メインコンテンツ...&lt;/main&gt;
                    </code>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">修正の優先順位</h3>
                <ol className="space-y-1  text-gray-600">
                  <li>
                    1. <strong>Critical違反</strong>を最優先で修正
                  </li>
                  <li>
                    2. <strong>Serious違反</strong>を次に修正
                  </li>
                  <li>
                    3. <strong>Moderate・Minor違反</strong>
                    を時間のあるときに修正
                  </li>
                  <li>4. 修正後は必ず再テストして改善を確認</li>
                </ol>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
