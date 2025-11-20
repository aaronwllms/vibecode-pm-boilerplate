import { NextResponse } from 'next/server'
import { logger } from '@/utils/logger'

export async function GET() {
  const source = 'api/message/route.ts'

  try {
    // Simulating successful operation
    const message = 'Hello from the API!'

    logger.info({
      source,
      message: 'Message retrieved successfully',
      code: 'SUCCESS',
    })

    return NextResponse.json(
      { success: true, data: { message } },
      { status: 200 }
    )
  } catch (error) {
    logger.error({
      source,
      message: 'Failed to retrieve message',
      code: 'INTERNAL_ERROR',
      error,
    })

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to retrieve message',
          code: 'INTERNAL_ERROR',
        },
      },
      { status: 500 }
    )
  }
}
