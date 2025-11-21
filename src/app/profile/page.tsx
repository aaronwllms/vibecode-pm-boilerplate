import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase'
import { requireAuth } from '@/utils/auth-helpers'
import { logger } from '@/utils/logger'
import type { Profile } from '@/types/profile'

export default async function ProfilePage() {
  const source = 'app/profile/page.tsx'
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
        message: 'Unauthorized access attempt to profile page',
        code: 'UNAUTHORIZED',
      })
      redirect('/login?redirect=/profile')
    }

    requireAuth(user)

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      logger.error({
        source,
        message: 'Failed to fetch profile',
        code: 'PROFILE_FETCH_ERROR',
        error: profileError,
      })
      return (
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold">Profile</h1>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-destructive">
              Failed to load profile. Please try again later.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Profile</h1>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Email
              </h2>
              <p className="mt-1 text-sm">{(profile as Profile)?.email}</p>
            </div>
            {(profile as Profile)?.full_name && (
              <div>
                <h2 className="text-sm font-medium text-muted-foreground">
                  Full Name
                </h2>
                <p className="mt-1 text-sm">
                  {(profile as Profile)?.full_name}
                </p>
              </div>
            )}
            {(profile as Profile)?.bio && (
              <div>
                <h2 className="text-sm font-medium text-muted-foreground">
                  Bio
                </h2>
                <p className="mt-1 text-sm">{(profile as Profile)?.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    // Handle auth errors
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      redirect('/login?redirect=/profile')
    }

    logger.error({
      source,
      message: 'Unexpected error in profile page',
      code: 'INTERNAL_ERROR',
      error,
    })

    redirect('/')
  }
}
