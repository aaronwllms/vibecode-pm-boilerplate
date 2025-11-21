'use server'

import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { revalidatePath } from 'next/cache'
import { logger } from '@/utils/logger'
import { validateAvatarFile } from './avatar-validation'
import type { AvatarUploadResponse } from '@/types/profile'

const SOURCE = 'app/actions/avatar-upload.ts'

async function deleteOldAvatar(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', userId)
    .single()

  if (profile?.avatar_url) {
    const oldPath = profile.avatar_url.split('/').slice(-2).join('/')
    await supabase.storage.from('avatars').remove([oldPath])
  }
}

export async function uploadAvatar(
  formData: FormData,
): Promise<AvatarUploadResponse> {
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
        message: 'Unauthenticated avatar upload attempt',
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

    const file = formData.get('avatar') as File

    // Validate file
    const validation = validateAvatarFile(file, user.id, SOURCE)
    if (!validation.valid) {
      return {
        success: false,
        error: {
          message: validation.error!,
          code: 'VALIDATION_ERROR',
        },
      }
    }

    // Delete old avatar if exists
    await deleteOldAvatar(supabase, user.id)

    // Upload new avatar
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      logger.error({
        source: SOURCE,
        message: 'Failed to upload avatar to storage',
        code: 'EXTERNAL_API_ERROR',
        context: { userId: user.id, fileName },
        error: uploadError,
      })
      return {
        success: false,
        error: {
          message: 'Failed to upload avatar',
          code: 'EXTERNAL_API_ERROR',
        },
      }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(fileName)

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)

    if (updateError) {
      logger.error({
        source: SOURCE,
        message: 'Failed to update profile with avatar URL',
        code: 'DATABASE_ERROR',
        context: { userId: user.id },
        error: updateError,
      })
      return {
        success: false,
        error: {
          message: 'Failed to update profile with avatar URL',
          code: 'DATABASE_ERROR',
        },
      }
    }

    logger.info({
      source: SOURCE,
      message: 'Avatar uploaded successfully',
      code: 'SUCCESS',
      context: { userId: user.id, fileName },
    })

    revalidatePath('/', 'layout')

    return {
      success: true,
      avatar_url: publicUrl,
    }
  } catch (error) {
    logger.error({
      source: SOURCE,
      message: 'Unexpected error uploading avatar',
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
