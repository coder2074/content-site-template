import SignInForm from '@/components/SignInForm'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return []
}

export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-black mb-2"
            style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
          >
            Sign In
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Enter your email or phone number to receive a sign-in code.
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  )
}