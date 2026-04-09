'use client'

import { SignIn } from '@clerk/nextjs'

export default function SignInForm() {
  return (
    <SignIn
      routing="hash"
      appearance={{
        elements: {
          card: 'shadow-lg rounded-2xl border-0',
          headerTitle: 'hidden',
          headerSubtitle: 'hidden',
          formButtonPrimary: 'hover:opacity-90 rounded-xl font-semibold',
          formFieldInput: 'rounded-xl border-gray-200',
        },
        variables: {
          colorPrimary: 'var(--color-primary)',
          colorBackground: '#ffffff',
          borderRadius: '0.75rem',
        }
      }}
    />
  )
}