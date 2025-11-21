import { UseQueryResult, useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { logger } from '@/utils/logger'

interface MessageResponse {
  success: boolean
  data?: { message: string }
  error?: {
    message: string
    code: string
  }
}

// Creating a reusable hook to get messages, need to use axios here since Next patches fetch
// and causes issues with msw
const useGetMessage = (): UseQueryResult<{ message: string }, Error> =>
  useQuery({
    queryKey: ['/api/message'],
    queryFn: async () => {
      const { data } = await axios.get<MessageResponse>('/api/message')

      if (!data.success || !data.data) {
        const errorMessage = data.error?.message || 'Failed to fetch message'
        const errorCode = data.error?.code || 'EXTERNAL_API_ERROR'

        logger.error({
          source: 'hooks/useGetMessage.ts',
          message: errorMessage,
          code: errorCode,
          context: { responseData: data },
        })

        throw new Error(errorMessage)
      }

      return data.data
    },
    // Only set retry in production, let QueryClient defaults apply in tests
    ...(process.env.NODE_ENV !== 'test' && {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    }),
  })

export default useGetMessage
