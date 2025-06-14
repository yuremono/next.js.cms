"use client";

import React, { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // カスタムエラーハンドラーがあれば呼び出し
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // カスタムfallbackがあれば使用
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // デフォルトのエラーUI
      return (
        <div className="border-destructive/20 bg-destructive/5 flex min-h-[400px] flex-col items-center justify-center rounded-lg border p-8 text-center">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-destructive">
              コンポーネントエラー
            </h2>
            <p className="text-muted-foreground">
              このセクションの読み込み中にエラーが発生しました。
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="bg-destructive/10 mt-4 rounded-md p-3 text-left">
                <p className="font-mono text-xs text-destructive">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <Button
              onClick={() =>
                this.setState({ hasError: false, error: undefined })
              }
              variant="outline"
              size="sm"
              className="mt-4"
            >
              再試行
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for easier usage
interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryWrapperProps, "children">
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
