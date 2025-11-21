'use client'

import useGetMessage from '@/hooks/useGetMessage'
import { ErrorDisplay } from '@/components/error-display'
import { logger } from '@/utils/logger'

const ReactQueryExample = () => {
  const { isLoading, data, error } = useGetMessage()

  if (error) {
    logger.error({
      source: 'components/ReactQueryExample.tsx',
      message: 'Failed to fetch message',
      code: 'EXTERNAL_API_ERROR',
      error,
    })

    return (
      <ErrorDisplay
        message="Failed to load message. Please try again."
        code="EXTERNAL_API_ERROR"
      />
    )
  }

  if (isLoading) return <div>Loading...</div>

  return <div>{data?.message}</div>
}

export default ReactQueryExample
