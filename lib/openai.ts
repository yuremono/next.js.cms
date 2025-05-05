import OpenAI from "openai";

// OpenAI APIクライアントの設定
// 実際のプロジェクトでは.envファイルに設定する必要があります
const apiKey = process.env.OPENAI_API_KEY || "";

export const openai = new OpenAI({
	apiKey: apiKey,
});
