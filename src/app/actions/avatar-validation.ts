import { logger } from '@/utils/logger'

interface ValidationResult {
  valid: boolean
  error?: string
}

export function validateAvatarFile(
  file: File | null,
  userId: string,
  source: string,
): ValidationResult {
  if (!file || file.size === 0) {
    return {
      valid: false,
      error: 'No file provided',
    }
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!validTypes.includes(file.type)) {
    logger.warn({
      source,
      message: 'Invalid avatar file type',
      code: 'VALIDATION_ERROR',
      context: { userId, fileType: file.type },
    })
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, WebP, or GIF',
    }
  }

  // Validate file size (max 2MB)
  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    logger.warn({
      source,
      message: 'Avatar file too large',
      code: 'VALIDATION_ERROR',
      context: { userId, fileSize: file.size, maxSize },
    })
    return {
      valid: false,
      error: 'File too large. Maximum size is 2MB',
    }
  }

  return { valid: true }
}
