import { createClient } from "@supabase/supabase-js";

// 環境変数を使用してSupabaseクライアントを作成
// 実際のプロジェクトでは.envファイルに設定する必要があります
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// 必要な環境変数がない場合はモックのSupabaseクライアントを作成
export const supabase =
	supabaseUrl && supabaseAnonKey
		? createClient(supabaseUrl, supabaseAnonKey)
		: createClient("https://example.supabase.co", "dummy-key", {
				auth: {
					persistSession: false,
				},
		  });
