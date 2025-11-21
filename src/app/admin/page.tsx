import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase'
import { requireAuth, requireAdmin } from '@/utils/auth-helpers'
import { logger } from '@/utils/logger'
import type { Profile } from '@/types/profile'

export default async function AdminPage() {
  const source = 'app/admin/page.tsx'
  const cookieStore = cookies()

  try {
    const supabase = createServerClient(cookieStore)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      logger.warn({
        source,
        message: 'Unauthorized access attempt to admin page',
        code: 'UNAUTHORIZED',
      })
      redirect('/login?redirect=/admin')
    }

    requireAuth(user)

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      logger.error({
        source,
        message: 'Failed to fetch profile for admin check',
        code: 'PROFILE_FETCH_ERROR',
        error: profileError,
      })
      redirect('/')
    }

    requireAdmin(profile as Profile)

    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Admin Panel</h1>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-muted-foreground">
            Welcome to the admin panel. This page is only accessible to users
            with admin role.
          </p>
        </div>
      </div>
    )
  } catch (error) {
    // Handle auth errors (UNAUTHORIZED, FORBIDDEN)
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') {
        redirect('/login?redirect=/admin')
      }
      if (error.message === 'FORBIDDEN') {
        logger.warn({
          source,
          message: 'Forbidden access attempt to admin page',
          code: 'FORBIDDEN',
        })
        redirect('/')
      }
    }

    logger.error({
      source,
      message: 'Unexpected error in admin page',
      code: 'INTERNAL_ERROR',
      error,
    })

    redirect('/')
  }
}
