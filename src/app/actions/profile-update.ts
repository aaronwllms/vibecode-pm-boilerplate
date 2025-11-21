'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { revalidatePath } from 'next/cache'
import { logger } from '@/utils/logger'
import type { ProfileActionResult } from '@/types/profile'

const SOURCE = 'app/actions/profile-update.ts'

export async function updateProfile(
  formData: FormData
): Promise<ProfileActionResult> {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      logger.warn({
        source: SOURCE,
        message: 'Unauthenticated profile update attempt',
        code: 'UNAUTHORIZED',
      })
      return {
        success: false,
        error: {
          message: 'Not authenticated',
          code: 'UNAUTHORIZED',
        },
      }
    }

    // Extract form data
    const full_name = formData.get('full_name') as string
    const bio = formData.get('bio') as string

    // Validate inputs
    if (full_name && full_name.length > 100) {
      logger.warn({
        source: SOURCE,
        message: 'Profile name validation failed',
        code: 'VALIDATION_ERROR',
        context: { userId: user.id, nameLength: full_name.length },
      })
      return {
        success: false,
        error: {
          message: 'Name must be 100 characters or less',
          code: 'VALIDATION_ERROR',
        },
      }
    }

    if (bio && bio.length > 500) {
      logger.warn({
        source: SOURCE,
        message: 'Profile bio validation failed',
        code: 'VALIDATION_ERROR',
        context: { userId: user.id, bioLength: bio.length },
      })
      return {
        success: false,
        error: {
          message: 'Bio must be 500 characters or less',
          code: 'VALIDATION_ERROR',
        },
      }
    }

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: full_name || null,
        bio: bio || null,
      })
      .eq('id', user.id)

    if (updateError) {
      logger.error({
        source: SOURCE,
        message: 'Failed to update profile in database',
        code: 'DATABASE_ERROR',
        context: { userId: user.id },
        error: updateError,
      })
      return {
        success: false,
        error: {
          message: 'Failed to update profile',
          code: 'DATABASE_ERROR',
        },
      }
    }

    logger.info({
      source: SOURCE,
      message: 'Profile updated successfully',
      code: 'SUCCESS',
      context: { userId: user.id },
    })

    revalidatePath('/', 'layout')

    return {
      success: true,
      message: 'Profile updated successfully',
    }
  } catch (error) {
    logger.error({
      source: SOURCE,
      message: 'Unexpected error updating profile',
      code: 'INTERNAL_ERROR',
      error,
    })
    return {
      success: false,
      error: {
        message: 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
      },
    }
  }
}

