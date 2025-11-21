export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface ProfileUpdateInput {
  full_name?: string
  bio?: string
}

export interface AvatarUploadResponse {
  success: boolean
  avatar_url?: string
  error?: {
    message: string
    code: string
  }
}

export interface ProfileActionResult {
  success: boolean
  message?: string
  error?: {
    message: string
    code: string
  }
}

