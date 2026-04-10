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
      <div className="w-full max-w-md flex flex-col items-center">
        <h1
          className="text-3xl font-black mb-8 text-center"
          style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
        >
          Sign In
        </h1>
        <SignInForm />
      </div>
    </div>
  )
}