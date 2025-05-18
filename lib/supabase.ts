import { createClient } from "@supabase/supabase-js";

// 環境変数を使用してSupabaseクライアントを作成
// 実際のプロジェクトでは.envファイルに設定する必要があります
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 接続情報があるかどうかをチェック
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Supabaseクライアントを作成
export const supabase = createClient(
	supabaseUrl || "https://example.supabase.co",
	supabaseAnonKey || "dummy-key",
	{
		auth: {
			persistSession: false,
		},
	}
);
