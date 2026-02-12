import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Fix 404s when the client requests /next/static/... instead of /_next/static/...
 * (e.g. Cursor embedded browser or other clients that strip the leading underscore)
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl
  if (url.pathname.startsWith('/next/static/')) {
    const rewritten = new URL(request.url)
    rewritten.pathname = url.pathname.replace(/^\/next\/static/, '/_next/static')
    return NextResponse.rewrite(rewritten)
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/next/static/:path*',
}
