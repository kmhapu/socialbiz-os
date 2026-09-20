import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  
  // Create a supabase client just to check auth state quickly
  // Or we can rely on updateSession which might not expose the user directly easily.
  // Actually, let's implement the auth check here.
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // middleware updates are handled by updateSession
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  const protectedRoutes = ['/dashboard', '/inbox', '/products', '/orders', '/customers', '/content', '/settings'];
  const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) || request.nextUrl.pathname === '/';

  if (!user && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
