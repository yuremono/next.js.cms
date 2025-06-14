import { useEffect, useState } from "react";

interface AccessibilityViolation {
  id: string;
  impact?: "minor" | "moderate" | "serious" | "critical";
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: any;
  }>;
}

interface AccessibilityResults {
  violations: AccessibilityViolation[];
  passes: Array<{
    id: string;
    description: string;
  }>;
  incomplete: Array<{
    id: string;
    description: string;
  }>;
}

export function useAccessibility(autoRun = false) {
  const [results, setResults] = useState<AccessibilityResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runAccessibilityTest = async () => {
    if (process.env.NODE_ENV !== "development") {
      console.warn("アクセシビリティテストは開発環境でのみ利用可能です");
      return;
    }

    setIsRunning(true);
    try {
      const axe = await import("axe-core");
      const results = await axe.run();

      setResults({
        violations: results.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          description: violation.description,
          help: violation.help,
          helpUrl: violation.helpUrl,
          nodes: violation.nodes.map((node) => ({
            html: node.html,
            target: node.target,
          })),
        })),
        passes: results.passes.map((pass) => ({
          id: pass.id,
          description: pass.description,
        })),
        incomplete: results.incomplete.map((incomplete) => ({
          id: incomplete.id,
          description: incomplete.description,
        })),
      });

      // コンソールに結果を出力
      console.group("🔍 アクセシビリティテスト結果");
      console.log(`✅ 合格: ${results.passes.length}件`);
      console.log(`❌ 違反: ${results.violations.length}件`);
      console.log(`⚠️ 不完全: ${results.incomplete.length}件`);

      if (results.violations.length > 0) {
        console.group("❌ 違反事項");
        results.violations.forEach((violation) => {
          console.error(
            `[${violation.impact?.toUpperCase()}] ${violation.id}: ${violation.description}`
          );
          console.log(`詳細: ${violation.helpUrl}`);
          violation.nodes.forEach((node) => {
            console.log(`要素: ${node.target.join(" > ")}`);
          });
        });
        console.groupEnd();
      }
      console.groupEnd();
    } catch (error) {
      console.error("アクセシビリティテスト実行エラー:", error);
    } finally {
      setIsRunning(false);
    }
  };

  // 自動実行の設定
  useEffect(() => {
    if (autoRun && process.env.NODE_ENV === "development") {
      const timer = setTimeout(() => {
        runAccessibilityTest();
      }, 2000); // ページ読み込み2秒後に実行

      return () => clearTimeout(timer);
    }
  }, [autoRun]);

  return {
    results,
    isRunning,
    runAccessibilityTest,
    hasViolations: results ? results.violations.length > 0 : false,
    violationCount: results ? results.violations.length : 0,
    passCount: results ? results.passes.length : 0,
  };
}
