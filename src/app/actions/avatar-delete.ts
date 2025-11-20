'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { revalidatePath } from 'next/cache'
import { logger } from '@/utils/logger'
import type { ProfileActionResult } from '@/types/profile'

const SOURCE = 'app/actions/avatar-delete.ts'

export async function deleteAvatar(): Promise<ProfileActionResult> {
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
        message: 'Unauthenticated avatar delete attempt',
        code: 'UNAUTHORIZED',
      })
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    // Get current avatar URL
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single()

    if (!profile?.avatar_url) {
      return {
        success: false,
        error: 'No avatar to delete',
      }
    }

    // Delete from storage
    const oldPath = profile.avatar_url.split('/').slice(-2).join('/')
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove([oldPath])

    if (deleteError) {
      logger.error({
        source: SOURCE,
        message: 'Failed to delete avatar from storage',
        code: 'EXTERNAL_API_ERROR',
        context: { userId: user.id },
        error: deleteError,
      })
      return {
        success: false,
        error: 'Failed to delete avatar',
      }
    }

    // Update profile to remove avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', user.id)

    if (updateError) {
      logger.error({
        source: SOURCE,
        message: 'Failed to update profile after avatar deletion',
        code: 'DATABASE_ERROR',
        context: { userId: user.id },
        error: updateError,
      })
      return {
        success: false,
        error: 'Failed to update profile',
      }
    }

    logger.info({
      source: SOURCE,
      message: 'Avatar deleted successfully',
      code: 'SUCCESS',
      context: { userId: user.id },
    })

    revalidatePath('/', 'layout')

    return {
      success: true,
      message: 'Avatar deleted successfully',
    }
  } catch (error) {
    logger.error({
      source: SOURCE,
      message: 'Unexpected error deleting avatar',
      code: 'INTERNAL_ERROR',
      error,
    })
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

