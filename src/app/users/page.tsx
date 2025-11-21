import type React from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase'
import { logger } from '@/utils/logger'
import { ErrorDisplay } from '@/components/error-display'
import { DataTable, type ColumnDef } from '@/components/data-table'
import { requireAuth, requireAdmin } from '@/utils/auth-helpers'
import type { Profile } from '@/types/profile'

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

const userColumns: ColumnDef<Profile>[] = [
  {
    header: 'Email',
    accessor: 'email',
  },
  {
    header: 'Full Name',
    accessor: 'full_name',
    cell: (value): React.ReactNode => {
      if (value === null || value === undefined || value === '') {
        return <span className="text-muted-foreground">—</span>
      }
      return value as React.ReactNode
    },
  },
  {
    header: 'Role',
    accessor: 'role',
    cell: (value): React.ReactNode => {
      const role = value as 'admin' | 'user' | null
      if (!role) {
        return <span className="text-muted-foreground">—</span>
      }
      return (
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium capitalize text-primary">
          {role}
        </span>
      )
    },
  },
  {
    header: 'Created',
    accessor: 'created_at',
    cell: (value): React.ReactNode => formatDate(value as string),
  },
]

export default async function UsersPage() {
  const source = 'app/users/page.tsx'
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
        message: 'Unauthorized access attempt to users page',
        code: 'UNAUTHORIZED',
      })
      redirect('/login?redirect=/users')
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

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      const errorCode =
        error.code === 'PGRST116'
          ? 'NOT_FOUND'
          : error.code === '42501'
            ? 'SUPABASE_RLS_ERROR'
            : 'DATABASE_ERROR'

      logger.error({
        source,
        message: 'Failed to fetch users',
        code: errorCode,
        context: { supabaseCode: error.code },
        error,
      })

      return (
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <h1 className="mb-6 text-3xl font-bold">Users</h1>
          <ErrorDisplay
            message={
              errorCode === 'NOT_FOUND'
                ? 'No users found.'
                : errorCode === 'SUPABASE_RLS_ERROR'
                  ? 'You do not have permission to view users.'
                  : 'Failed to load users. Please try again later.'
            }
            code={errorCode}
          />
        </div>
      )
    }

    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Users</h1>
        <DataTable
          data={(data || []) as Profile[]}
          columns={userColumns}
          emptyMessage="No users found."
        />
      </div>
    )
  } catch (error) {
    // Handle auth errors (UNAUTHORIZED, FORBIDDEN)
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') {
        redirect('/login?redirect=/users')
      }
      if (error.message === 'FORBIDDEN') {
        logger.warn({
          source,
          message: 'Forbidden access attempt to users page',
          code: 'FORBIDDEN',
        })
        redirect('/')
      }
    }

    logger.error({
      source,
      message: 'Unexpected error while fetching users',
      code: 'INTERNAL_ERROR',
      error,
    })

    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Users</h1>
        <ErrorDisplay
          message="Something went wrong. Please try again later."
          code="INTERNAL_ERROR"
        />
      </div>
    )
  }
}
