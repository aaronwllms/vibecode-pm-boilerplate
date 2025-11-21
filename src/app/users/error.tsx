'use client'

import { ErrorFallback } from '@/components/error-fallback'
import { useEffect } from 'react'
import { logger } from '@/utils/logger'

interface UsersErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function UsersError({ error, reset }: UsersErrorProps) {
  useEffect(() => {
    logger.error({
      source: 'app/users/error.tsx',
      message: 'Users page error boundary triggered',
      code: 'INTERNAL_ERROR',
      error,
    })
  }, [error])

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Users</h1>
      <ErrorFallback
        message="Failed to load users. Please try again."
        onReset={reset}
      />
    </div>
  )
}
