"use client";

import { useState, useEffect } from "react";
import { useAccessibility } from "@/hooks/useAccessibility";
import { AccessibilityGuide } from "@/components/AccessibilityGuide";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Scan,
  ExternalLink,
  HelpCircle,
} from "lucide-react";

export function AccessibilityPanel() {
  const {
    results,
    isRunning,
    runAccessibilityTest,
    hasViolations,
    violationCount,
    passCount,
  } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // キーボードショートカット（Ctrl+Shift+A）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // エディタなどの入力フィールドがフォーカスされている場合は無視
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === "TEXTAREA" ||
          activeElement.tagName === "INPUT" ||
          activeElement.contentEditable === "true" ||
          activeElement.closest(".SimpleHtmlEditor") ||
          activeElement.closest(".monaco-editor") ||
          activeElement.closest("[data-keybinding-context]") ||
          activeElement.classList.contains("monaco-editor") ||
          activeElement.classList.contains("view-line"))
      ) {
        return;
      }

      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        if (process.env.NODE_ENV === "development") {
          runAccessibilityTest();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [runAccessibilityTest]);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <aside
      className="fixed bottom-4 right-4 z-50"
      aria-label="アクセシビリティテストツール"
    >
      {/* フローティングボタン */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-12 w-12 rounded-full shadow-lg ${
          hasViolations
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        title="アクセシビリティテスト (Ctrl+Shift+A)"
      >
        <Scan className="h-5 w-5" />
      </Button>

      {/* テストパネル */}
      {isOpen && (
        <Card className="absolute bottom-16 right-0 max-h-96 w-96 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between  ">
              <span>アクセシビリティテスト</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowGuide(true)}
                  aria-label="使用方法ガイドを表示"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground">
                  Ctrl+Shift+A
                </span>
                <Button
                  size="sm"
                  onClick={runAccessibilityTest}
                  disabled={isRunning}
                >
                  {isRunning ? "実行中..." : "テスト実行"}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            {results && (
              <div className="space-y-3">
                {/* サマリー */}
                <div className="flex gap-2">
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    <CheckCircle className="mr-1 h-3 w-3" />
                    合格 {passCount}
                  </Badge>
                  {violationCount > 0 && (
                    <Badge variant="destructive">
                      <XCircle className="mr-1 h-3 w-3" />
                      違反 {violationCount}
                    </Badge>
                  )}
                </div>

                {/* 違反事項 */}
                {results.violations.length > 0 && (
                  <div className="h-48 overflow-y-auto">
                    <div className="space-y-2">
                      {results.violations.map((violation, index) => (
                        <ViolationItem key={index} violation={violation} />
                      ))}
                    </div>
                  </div>
                )}

                {violationCount === 0 && (
                  <div className="py-4 text-center text-green-600">
                    <CheckCircle className="mx-auto mb-2 h-8 w-8" />
                    <p className=" ">
                      アクセシビリティ違反は見つかりませんでした！
                    </p>
                  </div>
                )}
              </div>
            )}

            {!results && (
              <div className="py-4 text-center text-muted-foreground">
                <p className=" ">
                  テストを実行してアクセシビリティをチェックしましょう
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  ショートカット: Ctrl+Shift+A
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 使用方法ガイド */}
      <AccessibilityGuide
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </aside>
  );
}

interface ViolationItemProps {
  violation: {
    id: string;
    impact?: "minor" | "moderate" | "serious" | "critical";
    description: string;
    help: string;
    helpUrl: string;
    nodes: Array<{
      html: string;
      target: string[];
    }>;
  };
}

function ViolationItem({ violation }: ViolationItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getImpactColor = (impact?: string) => {
    switch (impact) {
      case "critical":
        return "bg-red-500";
      case "serious":
        return "bg-orange-500";
      case "moderate":
        return "bg-yellow-500";
      case "minor":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="border border-red-200">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-start gap-2 p-3 text-left">
            <div
              className={`mt-2 h-2 w-2 rounded-full ${getImpactColor(violation.impact)}`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-gray-800">
                  {violation.id}
                </span>
                <Badge variant="outline" className="text-xs">
                  {violation.impact || "unknown"}
                </Badge>
              </div>
              <p className="mt-1   text-foreground">{violation.help}</p>
            </div>
            {isExpanded ? (
              <ChevronDown className="mt-1 h-4 w-4" />
            ) : (
              <ChevronRight className="mt-1 h-4 w-4" />
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t px-3 pb-3">
            <div className="mt-2 space-y-2">
              <p className="text-xs text-gray-600">{violation.description}</p>

              <div className="space-y-1">
                <p className="text-xs font-medium">影響を受ける要素:</p>
                {violation.nodes.map((node, nodeIndex) => (
                  <div
                    key={nodeIndex}
                    className="rounded bg-gray-50 p-2 text-xs"
                  >
                    <code className="text-gray-800">
                      {node.target.join(" > ")}
                    </code>
                  </div>
                ))}
              </div>

              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs"
                onClick={() => window.open(violation.helpUrl, "_blank")}
              >
                <ExternalLink className="mr-1 h-3 w-3" />
                詳細を確認
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
 