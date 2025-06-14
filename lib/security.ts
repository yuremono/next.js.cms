import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";

// CSRF Token管理
class CSRFTokenManager {
  private static tokenMap = new Map<
    string,
    { token: string; timestamp: number }
  >();
  private static readonly TOKEN_EXPIRY = 60 * 60 * 1000; // 1時間

  static generateToken(sessionId: string): string {
    const token = crypto.randomBytes(32).toString("hex");
    const timestamp = Date.now();

    // 古いトークンを削除
    this.cleanupExpiredTokens();

    this.tokenMap.set(sessionId, { token, timestamp });
    return token;
  }

  static validateToken(sessionId: string, token: string): boolean {
    const stored = this.tokenMap.get(sessionId);
    if (!stored) return false;

    const isExpired = Date.now() - stored.timestamp > this.TOKEN_EXPIRY;
    if (isExpired) {
      this.tokenMap.delete(sessionId);
      return false;
    }

    return stored.token === token;
  }

  private static cleanupExpiredTokens() {
    const now = Date.now();
    for (const [sessionId, data] of this.tokenMap.entries()) {
      if (now - data.timestamp > this.TOKEN_EXPIRY) {
        this.tokenMap.delete(sessionId);
      }
    }
  }
}

// レート制限
class RateLimiter {
  private static requests = new Map<
    string,
    { count: number; resetTime: number }
  >();

  static check(
    identifier: string,
    maxRequests: number = 100,
    windowMs: number = 60 * 1000 // 1分
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const resetTime = now + windowMs;

    const existing = this.requests.get(identifier);

    if (!existing || now > existing.resetTime) {
      // 新しいウィンドウ
      this.requests.set(identifier, { count: 1, resetTime });
      return { allowed: true, remaining: maxRequests - 1, resetTime };
    }

    if (existing.count >= maxRequests) {
      return { allowed: false, remaining: 0, resetTime: existing.resetTime };
    }

    // カウントを増加
    existing.count++;
    return {
      allowed: true,
      remaining: maxRequests - existing.count,
      resetTime: existing.resetTime,
    };
  }

  static reset(identifier: string) {
    this.requests.delete(identifier);
  }
}

// 入力値検証スキーマ
export const validationSchemas = {
  // ページデータ検証
  pageData: z.object({
    header: z.object({
      html: z.string().max(10000),
    }),
    footer: z.object({
      html: z.string().max(10000),
    }),
    sections: z
      .array(
        z.object({
          layout: z.enum([
            "mainVisual",
            "imgText",
            "cards",
            "form",
            "group-start",
            "group-end",
          ]),
          class: z.string().max(100),
          html: z.string().max(20000).optional(),
          id: z.string().max(50),
          name: z.string().max(100).optional(),
          image: z.string().max(100000).optional(), // Base64 limit
          imageClass: z.string().max(100).optional(),
          imageAspectRatio: z.string().max(20).optional(),
          textClass: z.string().max(100).optional(),
          bgImage: z.string().max(100000).optional(),
          scopeStyles: z.string().max(1000).optional(), // グループ用CSS変数
        })
      )
      .max(50),
    customCSS: z.string().max(50000).optional(),
  }),

  // 認証情報検証
  credentials: z.object({
    username: z
      .string()
      .min(3)
      .max(50)
      .regex(/^[a-zA-Z0-9_]+$/),
    password: z.string().min(8).max(128),
  }),

  // ファイルアップロード検証
  fileUpload: z.object({
    filename: z.string().max(255),
    mimetype: z.string().regex(/^image\/(jpeg|jpg|png|gif|webp)$/),
    size: z.number().max(10 * 1024 * 1024), // 10MB
  }),
};

// セキュリティヘッダー設定
export function setSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

// APIミドルウェア
export function withSecurity(handler: Function) {
  return async (request: NextRequest) => {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const path = request.nextUrl.pathname;

    // レート制限チェック
    const rateLimitResult = RateLimiter.check(ip, 100, 60 * 1000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "100",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
          },
        }
      );
    }

    // CSRF保護 (POST, PUT, DELETE)
    if (["POST", "PUT", "DELETE"].includes(request.method)) {
      const sessionId = request.cookies.get("session-id")?.value;
      const csrfToken = request.headers.get("x-csrf-token");

      if (
        !sessionId ||
        !csrfToken ||
        !CSRFTokenManager.validateToken(sessionId, csrfToken)
      ) {
        return NextResponse.json(
          { error: "CSRF token validation failed" },
          { status: 403 }
        );
      }
    }

    try {
      const response = await handler(request);

      // セキュリティヘッダーを設定
      if (response instanceof NextResponse) {
        setSecurityHeaders(response);

        // レート制限ヘッダーを追加
        response.headers.set("X-RateLimit-Limit", "100");
        response.headers.set(
          "X-RateLimit-Remaining",
          rateLimitResult.remaining.toString()
        );
        response.headers.set(
          "X-RateLimit-Reset",
          rateLimitResult.resetTime.toString()
        );
      }

      return response;
    } catch (error) {
      console.error("API Error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

// データサニタイゼーション
export function sanitizeHtml(html: string): string {
  // 基本的なHTMLサニタイゼーション
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/on\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "");
}

// パスワードハッシュ化
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(
    password + process.env.PASSWORD_SALT || "default_salt"
  );
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// パスワード検証
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const newHash = await hashPassword(password);
  return newHash === hash;
}

// CSRF Token API
export { CSRFTokenManager, RateLimiter };
