import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: NextRequest) {
	try {
		const { prompt } = await req.json();

		if (!prompt || typeof prompt !== "string") {
			return NextResponse.json(
				{ error: "プロンプトが必要です" },
				{ status: 400 }
			);
		}

		// APIキーが設定されているか確認
		if (!process.env.OPENAI_API_KEY) {
			return NextResponse.json(
				{
					text: "<h3>APIキーが設定されていません</h3><p>環境変数 OPENAI_API_KEY を設定してください。</p>",
					error: "OpenAI APIキーが設定されていません",
				},
				{ status: 200 }
			);
		}

		// OpenAI APIにリクエスト
		const completion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: `あなたはWebサイトのコンテンツ生成を担当するAIです。
ユーザーの指示に従って、魅力的なWebサイト用のテキストを生成してください。
以下のHTMLタグを使って構造化された内容を作成してください：
- <h1>〜<h3>：見出し（階層に応じて使い分ける）
- <p>：段落
- <b>：太字
- <u>：下線
- <mark>：ハイライト
- <small>：小さい文字
- <span>：インライン要素

回答はHTML形式のみで、他の説明は不要です。ユーザーが指定した内容に合わせて、適切なHTMLタグを使用してください。`,
				},
				{
					role: "user",
					content: prompt,
				},
			],
			temperature: 0.7,
			max_tokens: 500,
		});

		const generatedText = completion.choices[0]?.message.content || "";

		// 生成されたテキストをサニタイズしてHTMLとして返す
		// サーバーサイドではDOMPurifyが使えないため、クライアントでサニタイズする

		return NextResponse.json({ text: generatedText });
	} catch (error: any) {
		console.error("AI生成エラー:", error);
		return NextResponse.json(
			{ 
				error: "テキスト生成に失敗しました",
				details: error?.message || String(error)
			},
			{ status: 500 }
		);
	}
}
 