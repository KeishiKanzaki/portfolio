import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })
  
  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  
  // リダイレクト処理
const {
  data: { session },
} = await supabase.auth.getSession()
  return response
}

export const config = {
  matcher: ["/((?!auth|_next/static|_next/image|favicon.ico).*)"],
}
