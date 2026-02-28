import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  // Protect /dashboard routes - redirect to /login if not authenticated
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Redirect to /dashboard if already authenticated and trying to access /login or /signup
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') {
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * 明确指定只拦截需要鉴权的路由，避免全局拦截
     * 这样首页 '/' 或其他公开页面就不会触发耗时的 Supabase 验证
     */
    '/dashboard/:path*', 
    '/login',
    '/signup'
  ],
};