// Supabaseを使用する場合は、最新のssrパッケージを使用
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create a Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );
  
  // セッションがあるかチェック
  const { data: { session }, error } = await supabase.auth.getSession();
  
  // デバッグログ
  console.log('Middleware - Session check:', {
    hasSession: !!session,
    pathname: req.nextUrl.pathname,
    sessionError: error?.message,
    userEmail: session?.user?.email
  });
  
  // ログイン済みユーザーの場合
  if (session) {
    // ログイン/サインアップページにアクセスしようとしているなら、ダッシュボードにリダイレクト
    if (req.nextUrl.pathname.startsWith('/auth/login') || req.nextUrl.pathname.startsWith('/sign-up')) {
      console.log("認証済みユーザーがログインページにアクセス - ダッシュボードにリダイレクト");
      console.log("Redirect: " + req.nextUrl.pathname + " -> /dashboard");
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    // ルートパス("/")にアクセスした場合もダッシュボードにリダイレクト
    if (req.nextUrl.pathname === '/') {
      console.log("認証済みユーザーがルートにアクセス - ダッシュボードにリダイレクト");
      console.log("Redirect: / -> /dashboard");
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    // ログインページから移動しようとしている場合
    if (req.nextUrl.pathname.startsWith('/auth/login')) {
      console.log("認証済みユーザーがログインページにアクセス - ダッシュボードにリダイレクト");
      console.log("Redirect: " + req.nextUrl.pathname + " -> /dashboard");
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    // ログインページから移動しようとしている場合
    if (req.nextUrl.pathname.startsWith('/auth/login')) {
      console.log("認証済みユーザーがログインページにアクセス - ダッシュボードにリダイレクト");
      console.log("Redirect: " + req.nextUrl.pathname + " -> /dashboard");
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } else {
    // 未ログインでダッシュボードにアクセスしようとしている場合の処理を緩和
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      // メール確認なしでログイン可能にするため、一時的にログインページに移動させる
      console.log("未認証ユーザーのダッシュボードアクセス - ログインページに誘導");
      console.log("Redirect: /dashboard -> /auth/login");
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }
  
  return res;
}

export const config = {
  matcher: [
    // 「_next」や「静的ファイル」に加えて、「api」を除外する
    "/((?!_next|api|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
