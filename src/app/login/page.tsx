import Link from 'next/link'
import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase'
import { logger } from '@/utils/logger'
import { CriticalErrorBanner } from '@/components/critical-error-banner'

// Helper to check if error is a Next.js redirect
function isRedirectError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof (error as { digest?: string }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  )
}

export default function Login({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  // Detect if this is a critical error
  const isCriticalError =
    searchParams?.message?.includes('Account setup incomplete')
  const isRegularMessage = searchParams?.message && !isCriticalError

  const signIn = async (formData: FormData) => {
    'use server'

    const source = 'app/login/page.tsx:signIn'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        const errorCode = error.message.toLowerCase().includes('invalid')
          ? 'UNAUTHORIZED'
          : 'SUPABASE_AUTH_ERROR'

        logger.warn({
          source,
          message: 'Sign in failed',
          code: errorCode,
          context: {
            email,
            supabaseError: error.message,
          },
        })

        return redirect('/login?message=Invalid credentials')
      }

      logger.info({
        source,
        message: 'User signed in successfully',
        code: 'SUCCESS',
        context: { email },
      })

      return redirect('/')
    } catch (error) {
      // Re-throw redirect errors (not actual errors, just Next.js internal flow)
      if (isRedirectError(error)) {
        throw error
      }

      logger.error({
        source,
        message: 'Unexpected error during sign in',
        code: 'INTERNAL_ERROR',
        context: { email },
        error,
      })

      return redirect('/login?message=An error occurred. Please try again.')
    }
  }

  const signUp = async (formData: FormData) => {
    'use server'

    const source = 'app/login/page.tsx:signUp'
    const origin = headers().get('origin')
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/api/auth/callback`,
        },
      })

      if (error) {
        const errorCode = error.message.toLowerCase().includes('already')
          ? 'CONFLICT'
          : 'SUPABASE_AUTH_ERROR'

        logger.warn({
          source,
          message: 'Sign up failed',
          code: errorCode,
          context: {
            email,
            supabaseError: error.message,
          },
        })

        return redirect('/login?message=Could not create account')
      }

      logger.info({
        source,
        message: 'User signed up successfully',
        code: 'SUCCESS',
        context: { email },
      })

      return redirect('/login?message=Check email to continue sign in process')
    } catch (error) {
      // Re-throw redirect errors (not actual errors, just Next.js internal flow)
      if (isRedirectError(error)) {
        throw error
      }

      logger.error({
        source,
        message: 'Unexpected error during sign up',
        code: 'INTERNAL_ERROR',
        context: { email },
        error,
      })

      return redirect('/login?message=An error occurred. Please try again.')
    }
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <Link
        href="/"
        className="bg-btn-background hover:bg-btn-background-hover group absolute left-8 top-8 flex items-center rounded-md px-4 py-2 text-sm text-foreground no-underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>

      {/* Critical Error Banner */}
      {isCriticalError && (
        <CriticalErrorBanner
          message={searchParams.message}
          errorCode="PROFILE_MISSING"
        />
      )}

      <form
        className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground animate-in"
        action={signIn}
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button className="mb-2 rounded-md bg-green-700 px-4 py-2 text-foreground">
          Sign In
        </button>
        <button
          formAction={signUp}
          className="mb-2 rounded-md border border-foreground/20 px-4 py-2 text-foreground"
        >
          Sign Up
        </button>
        {isRegularMessage && (
          <p className="mt-4 bg-foreground/10 p-4 text-center text-foreground">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
