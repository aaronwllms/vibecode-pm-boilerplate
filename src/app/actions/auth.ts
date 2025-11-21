'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase'
import { logger } from '@/utils/logger'

const SOURCE = 'app/actions/auth.ts'

function isRedirectError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof (error as { digest?: string }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  )
}

export interface AuthActionResult {
  success: boolean
  error?: {
    message: string
    code: string
  }
}

export async function signOutAction(): Promise<AuthActionResult> {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { error } = await supabase.auth.signOut()

    if (error) {
      logger.error({
        source: SOURCE,
        message: 'Sign out failed',
        code: 'SUPABASE_AUTH_ERROR',
        context: { supabaseError: error.message },
        error,
      })

      return {
        success: false,
        error: {
          message: 'Failed to sign out. Please try again.',
          code: 'SIGNOUT_FAILED',
        },
      }
    }

    logger.info({
      source: SOURCE,
      message: 'User signed out successfully',
      code: 'SUCCESS',
    })

    redirect('/login')
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    logger.error({
      source: SOURCE,
      message: 'Unexpected error during sign out',
      code: 'INTERNAL_ERROR',
      error,
    })

    return {
      success: false,
      error: {
        message: 'An unexpected error occurred. Please try again.',
        code: 'INTERNAL_ERROR',
      },
    }
  }
}
