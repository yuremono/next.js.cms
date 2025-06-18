import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
    const formData = await req.json();

    // フォームデータの検証
    if (!formData.name || !formData.email || !formData.message) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    // プライバシーポリシー同意チェック
    if (!formData.privacyPolicy) {
      return NextResponse.json(
        { error: "プライバシーポリシーへの同意が必要です" },
        { status: 400 }
      );
    }

    // 実際のプロジェクトでは、ここでメール送信などの処理を実装
    // 例: SendGridやAmazon SESなどのサービスを利用してメール送信

    // お問い合わせフォーム送信

    // デモ用：成功レスポンス
    return NextResponse.json({
      success: true,
      message: "お問い合わせを受け付けました。",
    });
  } catch (error) {
    console.error("フォーム送信エラー:", error);
    return NextResponse.json(
      { error: "フォーム送信に失敗しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
