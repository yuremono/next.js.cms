import OpenAI from "openai";

// OpenAI APIクライアントの設定
// 実際のプロジェクトでは.envファイルに設定する必要があります
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-initialization",
});
