import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// クライアントサイドのSupabaseクライアント（メール確認なしの設定）
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // URL検出を無効化
    flowType: 'pkce' // PKCEフローを使用
  }
});

// ブラウザ環境用のSSRクライアント（クライアントコンポーネント用）
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    }
  );
}

// サーバーサイドでJWTを使ってSupabaseクライアントを生成
export function createSupabaseClientWithToken(access_token: string) {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    },
  });
}
