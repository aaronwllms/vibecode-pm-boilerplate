'use client'

import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, Copy, Check } from 'lucide-react'
import { logger } from '@/utils/logger'

interface CriticalErrorBannerProps {
  message: string
  errorCode?: string
}

export function CriticalErrorBanner({
  message,
  errorCode = 'SYSTEM_ERROR',
}: CriticalErrorBannerProps) {
  const [copied, setCopied] = useState(false)

  const errorDetails = `Error: ${message}\nCode: ${errorCode}\nTimestamp: ${new Date().toISOString()}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(errorDetails)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      logger.error({
        source: 'components/critical-error-banner.tsx',
        message: 'Failed to copy error details to clipboard',
        code: 'CLIPBOARD_ERROR',
        error: err,
      })
    }
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-5 w-5" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <AlertTitle className="text-lg">Critical Error</AlertTitle>
          <AlertDescription className="text-base">{message}</AlertDescription>
          <code className="mt-2 inline-block self-start rounded bg-destructive/10 px-2 py-1 text-xs">
            {errorCode}
          </code>
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="shrink-0 gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </div>
    </Alert>
  )
}
