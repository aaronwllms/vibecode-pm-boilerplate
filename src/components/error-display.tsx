import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface ErrorDisplayProps {
  message: string
  code?: string
  variant?: 'default' | 'destructive'
  title?: string
}

/**
 * Displays error messages using shadcn Alert component
 * Provides consistent error UI across the application
 */
export function ErrorDisplay({
  message,
  code,
  variant = 'destructive',
  title,
}: ErrorDisplayProps) {
  const displayTitle = title || (variant === 'destructive' ? 'Error' : 'Notice')

  return (
    <Alert variant={variant}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{displayTitle}</AlertTitle>
      <AlertDescription>
        {message}
        {code && (
          <span className="ml-2 text-xs opacity-70">(Code: {code})</span>
        )}
      </AlertDescription>
    </Alert>
  )
}

