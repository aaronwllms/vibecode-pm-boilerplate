import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { logger } from '@/utils/logger'

export async function GET(request: Request) {
  const source = 'api/auth/callback/route.ts'

  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the Auth Helpers package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-sign-in-with-code-exchange
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    try {
      const cookieStore = cookies()
      const supabase = createServerClient(cookieStore)
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        logger.error({
          source,
          message: 'Failed to exchange code for session',
          code: 'SUPABASE_AUTH_ERROR',
          context: {
            error: error.message,
            path: requestUrl.pathname,
          },
          error,
        })

        // Redirect to login with error message
        return NextResponse.redirect(
          `${requestUrl.origin}/login?message=Authentication failed`,
        )
      }
    } catch (error) {
      logger.error({
        source,
        message: 'Unexpected error during auth callback',
        code: 'INTERNAL_ERROR',
        context: {
          path: requestUrl.pathname,
        },
        error,
      })

      // Redirect to login with error message
      return NextResponse.redirect(
        `${requestUrl.origin}/login?message=Authentication failed`,
      )
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
