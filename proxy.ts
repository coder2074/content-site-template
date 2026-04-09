import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)'])

export default clerkMiddleware(async (auth, request) => {
  // Always allow sign-in through
  if (isPublicRoute(request)) {
    return NextResponse.next()
  }

  // Fetch access control config from S3
  const baseUrl = process.env.CONTENT_BASE_URL
  if (!baseUrl) return NextResponse.next()

  try {
    const res = await fetch(`${baseUrl}/access-control.json`, {
      next: { revalidate: 60 }
    })
    if (!res.ok) return NextResponse.next()

    const accessControl = await res.json()
    if (!accessControl?.enabled) return NextResponse.next()

    const pathname = request.nextUrl.pathname
    const requiresAuth = checkRequiresAuth(accessControl, pathname)

    if (requiresAuth) {
      const { userId } = await auth()
      if (!userId) {
        const signInUrl = new URL('/sign-in', request.url)
        return NextResponse.redirect(signInUrl)
      }
    }
  } catch {
    // If S3 fetch fails, allow through
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}

function checkRequiresAuth(accessControl: any, pathname: string): boolean {
  const mode = accessControl.mode || 'full'

  if (mode === 'full') return true

  if (mode === 'protected_routes') {
    const protectedRoutes = accessControl.protected_routes || []
    return protectedRoutes.some((pattern: string) => matchRoute(pathname, pattern))
  }

  if (mode === 'public_routes') {
    const publicRoutes = accessControl.public_routes || []
    const isPublic = publicRoutes.some((pattern: string) => matchRoute(pathname, pattern))
    return !isPublic
  }

  return false
}

function matchRoute(pathname: string, pattern: string): boolean {
  if (pattern.endsWith('(.*)')) {
    const prefix = pattern.slice(0, -4)
    return pathname === prefix || pathname.startsWith(prefix + '/')
  }
  return pathname === pattern
}