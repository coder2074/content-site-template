// components/AuthProvider.tsx
// Used in server-rendered mode (NEXT_PUBLIC_SERVER_RENDERED=true).
// Wraps the app with ClerkProvider only.
// Turbopack alias swaps this for AuthProviderStatic.tsx in static builds.

'use client'

import { ClerkProvider } from '@clerk/nextjs'

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return <ClerkProvider>{children}</ClerkProvider>
}
