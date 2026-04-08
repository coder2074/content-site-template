// components/AccessControlGate.tsx
// Server component — runs on the server, reads access-control.json from S3
// and enforces protection based on the configured mode.
//
// Only runs in server-rendered mode (NEXT_PUBLIC_SERVER_RENDERED=true).
// Static export sites never use this.

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchAccessControl } from '@/lib/s3'
import { AccessControlConfig } from '@/lib/types'

interface AccessControlGateProps {
  children: React.ReactNode
  pathname: string
}

export default async function AccessControlGate({
  children,
  pathname,
}: AccessControlGateProps) {
  const accessControl = await fetchAccessControl()

  // Not configured or disabled — fully public
  if (!accessControl?.enabled) {
    return <>{children}</>
  }

  const requiresAuth = checkRequiresAuth(accessControl, pathname)

  if (requiresAuth) {
    const { userId } = await auth()
    if (!userId) {
      redirect('/sign-in')
    }
  }

  return <>{children}</>
}

function checkRequiresAuth(
  accessControl: AccessControlConfig,
  pathname: string
): boolean {
  const mode = accessControl.mode || 'full'

  if (mode === 'full') {
    return true
  }

  if (mode === 'protected_routes') {
    const protectedRoutes = accessControl.protected_routes || []
    return protectedRoutes.some(pattern => matchRoute(pathname, pattern))
  }

  if (mode === 'public_routes') {
    const publicRoutes = accessControl.public_routes || []
    const isPublic = publicRoutes.some(pattern => matchRoute(pathname, pattern))
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
