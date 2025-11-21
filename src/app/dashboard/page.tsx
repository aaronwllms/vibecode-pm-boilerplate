import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase'
import { requireAuth } from '@/utils/auth-helpers'
import { logger } from '@/utils/logger'

export default async function DashboardPage() {
  const source = 'app/dashboard/page.tsx'
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
        message: 'Unauthorized access attempt to dashboard',
        code: 'UNAUTHORIZED',
      })
      redirect('/login?redirect=/dashboard')
    }

    requireAuth(user)

    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-muted-foreground">
            Welcome to your dashboard. This page is accessible to all
            authenticated users.
          </p>
        </div>
      </div>
    )
  } catch (error) {
    // Handle auth errors
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      redirect('/login?redirect=/dashboard')
    }

    logger.error({
      source,
      message: 'Unexpected error in dashboard page',
      code: 'INTERNAL_ERROR',
      error,
    })

    redirect('/')
  }
}
