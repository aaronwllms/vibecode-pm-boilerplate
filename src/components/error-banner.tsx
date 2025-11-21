'use client'

import { useError } from '@/providers/error-provider'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, X } from 'lucide-react'

export function ErrorBanner() {
  const { error, clearError } = useError()

  if (!error) return null

  return (
    <div className="sticky top-0 z-50 w-full">
      <Alert variant="destructive" className="rounded-none border-x-0 border-t-0">
        <AlertCircle className="h-5 w-5" />
        <div className="flex items-start justify-between gap-4 w-full">
          <div className="flex flex-col gap-1 flex-1">
            <AlertTitle className="text-base font-semibold">Error</AlertTitle>
            <AlertDescription className="text-sm">
              {error.message}
            </AlertDescription>
            <code className="text-xs bg-destructive/10 px-2 py-1 rounded mt-1 inline-block self-start">
              {error.code}
            </code>
          </div>
          <Button
            onClick={clearError}
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 hover:bg-destructive/20"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </div>
  )
}

