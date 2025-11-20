'use server'

import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase'
import { logger } from '@/utils/logger'

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

export type AuthActionState = {
  error?: string
  errorCode?: string
  isCritical?: boolean
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const source = 'app/login/actions.ts:signInAction'
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    // Authenticate user
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (authError) {
      const errorCode = authError.message.toLowerCase().includes('invalid')
        ? 'UNAUTHORIZED'
        : 'SUPABASE_AUTH_ERROR'

      logger.warn({
        source,
        message: 'Sign in failed',
        code: errorCode,
        context: {
          email,
          supabaseError: authError.message,
        },
      })

      return {
        error: 'Invalid credentials',
        errorCode: 'AUTH_FAILED',
      }
    }

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError || !profile) {
      logger.error({
        source,
        message: 'CRITICAL: User authenticated but profile missing',
        code: 'PROFILE_MISSING',
        context: {
          userId: authData.user.id,
          email: authData.user.email,
          error: profileError?.message,
        },
      })

      // Sign out the user since their account is in an invalid state
      await supabase.auth.signOut()

      return {
        error: 'Account setup incomplete. Please contact support.',
        errorCode: 'PROFILE_MISSING',
        isCritical: true,
      }
    }

    logger.info({
      source,
      message: 'User signed in successfully',
      code: 'SUCCESS',
      context: { email },
    })

    // Redirect to home on success
    redirect('/')
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

    return {
      error: 'An error occurred. Please try again.',
      errorCode: 'INTERNAL_ERROR',
    }
  }
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const source = 'app/login/actions.ts:signUpAction'
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

      return {
        error: 'Could not create account',
        errorCode: 'SIGNUP_FAILED',
      }
    }

    logger.info({
      source,
      message: 'User signed up successfully',
      code: 'SUCCESS',
      context: { email },
    })

    return {
      error: 'Check email to continue sign in process',
      errorCode: 'SUCCESS',
    }
  } catch (error) {
    logger.error({
      source,
      message: 'Unexpected error during sign up',
      code: 'INTERNAL_ERROR',
      context: { email },
      error,
    })

    return {
      error: 'An error occurred. Please try again.',
      errorCode: 'INTERNAL_ERROR',
    }
  }
}

