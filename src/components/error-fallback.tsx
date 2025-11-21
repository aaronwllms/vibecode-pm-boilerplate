'use client'

import { ErrorDisplay } from '@/components/error-display'
import { Button } from '@/components/ui/button'

interface ErrorFallbackProps {
  message?: string
  onReset?: () => void
}

/**
 * Generic fallback UI for error boundaries
 * Shows user-friendly error message with optional retry button
 */
export function ErrorFallback({
  message = 'Something went wrong. Please try again.',
  onReset,
}: ErrorFallbackProps) {
  const handleReset = () => {
    if (onReset) {
      onReset()
    } else {
      // Reload the page if no reset handler provided
      window.location.reload()
    }
  }

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
      <ErrorDisplay message={message} variant="destructive" />
      <Button onClick={handleReset} variant="outline">
        Try Again
      </Button>
    </div>
  )
}
