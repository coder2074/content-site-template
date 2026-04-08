// proxy.ts
// Clerk middleware — only active in server-rendered mode
// (NEXT_PUBLIC_SERVER_RENDERED=true)
// Static export sites never use this file

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Sign-in is always public
const isPublicRoute = createRouteMatcher(['/sign-in(.*)'])

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) return
  // All other routes — auth enforcement happens in AccessControlGate
  // Middleware just makes Clerk session available to the app
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}