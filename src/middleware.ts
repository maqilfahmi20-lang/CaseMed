import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ambil token dari cookie
  const token = request.cookies.get('session')?.value;

  // Verifikasi token
  const user = token ? await verifyToken(token) : null;

  // Proteksi route /admin/*
  if (pathname.startsWith('/admin')) {
    if (!user) {
      // Belum login, redirect ke login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (user.role !== 'admin') {
      // Bukan admin, redirect ke user dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Proteksi route /dashboard (user dashboard)
  if (pathname === '/dashboard') {
    if (!user) {
      // Belum login, redirect ke login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (user.role === 'admin') {
      // Admin mencoba akses user dashboard, redirect ke admin dashboard
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // Redirect dari /login jika sudah login
  if (pathname === '/login' && user) {
    if (user.role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard', '/login'],
};
