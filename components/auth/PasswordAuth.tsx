"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Eye, EyeOff } from "lucide-react";
import { UserRole } from "@/types";

interface PasswordAuthProps {
  onAuthenticated: (role?: UserRole) => void;
  title?: string;
  subtitle?: string;
}

export function PasswordAuth({
  onAuthenticated,
  title = "ポートフォリオCMS - 企業様向け",
  subtitle = "編集機能をご利用いただくため、パスワードを入力してください",
}: PasswordAuthProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // コンポーネント読み込み時に既に認証されているかチェック
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/check");
      if (response.ok) {
        const { authenticated, role } = await response.json();
        if (authenticated) {
          onAuthenticated(role);
        }
      }
    } catch (error) {
      console.error("認証状態の確認に失敗:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error("パスワードを入力してください");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const result = await response.json();
        const role = result.role;

        // 権限レベルに応じたメッセージ表示
        if (role === "view") {
          toast.success("閲覧権限でログインしました", {
            description:
              "このアカウントは閲覧専用のため、入力内容を保存できません",
            duration: 6000,
          });
        } else if (role === "edit") {
          toast.success("編集権限でログインしました", {
            description: "すべての機能をご利用いただけます",
            duration: 4000,
          });
        } else {
          toast.success("認証に成功しました");
        }

        onAuthenticated(role);
      } else {
        const error = await response.json();
        toast.error(error.message || "パスワードが正しくありません");
        setPassword("");
      }
    } catch (error) {
      console.error("認証エラー:", error);
      toast.error("認証処理中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-600">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              アクセスパスワード
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                className="pr-10"
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !password.trim()}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                認証中...
              </>
            ) : (
              "アクセス"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            このシステムは企業様向けのポートフォリオCMSです。
            <br />
            パスワードをお持ちでない場合は、担当者にお問い合わせください。
          </p>
        </div>
      </Card>
    </div>
  );
}
