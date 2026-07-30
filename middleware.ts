import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const isAdminPath = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login'

  // Proteksi khusus untuk halaman admin (selain halaman login)
  if (isAdminPath && !isLoginPage) {
    // Mengecek apakah cookie session 'admin-session' ada
    const hasSession = request.cookies.has('admin-session')
    
    if (!hasSession) {
      // Redirect kembali ke halaman login jika belum autentikasi
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Lanjutkan request untuk route lainnya
  return NextResponse.next()
}

// Konfigurasi path mana saja yang akan diproses oleh middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
