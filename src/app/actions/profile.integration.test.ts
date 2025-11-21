import { updateProfile } from './profile-update'
import { uploadAvatar } from './avatar-upload'
import { deleteAvatar } from './avatar-delete'

// Mock Next.js modules
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({})),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(),
  storage: {
    from: jest.fn(),
  },
}

jest.mock('@/utils/supabase', () => ({
  createServerClient: jest.fn(() => mockSupabase),
}))

// Mock logger to avoid console output in tests
jest.mock('@/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}))

describe('Profile Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      // Mock user authentication
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null,
      })

      // Mock database update
      const mockUpdate = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      })
      mockSupabase.from.mockReturnValue({
        update: mockUpdate,
      })

      const formData = new FormData()
      formData.append('full_name', 'Test User')
      formData.append('bio', 'Test bio')

      const result = await updateProfile(formData)

      expect(result.success).toBe(true)
      expect(result.message).toBe('Profile updated successfully')
      expect(mockUpdate).toHaveBeenCalledWith({
        full_name: 'Test User',
        bio: 'Test bio',
      })
    })

    it('should handle unauthenticated user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Not authenticated'),
      })

      const formData = new FormData()
      formData.append('full_name', 'Test User')

      const result = await updateProfile(formData)

      expect(result.success).toBe(false)
      expect(result.error).toEqual({
        message: 'Not authenticated',
        code: 'UNAUTHORIZED',
      })
    })

    it('should validate name length', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null,
      })

      const formData = new FormData()
      formData.append('full_name', 'A'.repeat(101)) // Too long

      const result = await updateProfile(formData)

      expect(result.success).toBe(false)
      expect(result.error).toEqual({
        message: 'Name must be 100 characters or less',
        code: 'VALIDATION_ERROR',
      })
    })

    it('should validate bio length', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null,
      })

      const formData = new FormData()
      formData.append('bio', 'A'.repeat(501)) // Too long

      const result = await updateProfile(formData)

      expect(result.success).toBe(false)
      expect(result.error).toEqual({
        message: 'Bio must be 500 characters or less',
        code: 'VALIDATION_ERROR',
      })
    })
  })

  describe('uploadAvatar', () => {
    it('should handle unauthenticated user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Not authenticated'),
      })

      const formData = new FormData()
      const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
      formData.append('avatar', file)

      const result = await uploadAvatar(formData)

      expect(result.success).toBe(false)
      expect(result.error).toEqual({
        message: 'Not authenticated',
        code: 'UNAUTHORIZED',
      })
    })

    it('should handle missing file', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null,
      })

      const formData = new FormData()

      const result = await uploadAvatar(formData)

      expect(result.success).toBe(false)
      expect(result.error).toEqual({
        message: 'No file provided',
        code: 'VALIDATION_ERROR',
      })
    })

    it('should validate file type', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null,
      })

      const formData = new FormData()
      const file = new File(['test'], 'avatar.txt', { type: 'text/plain' })
      formData.append('avatar', file)

      const result = await uploadAvatar(formData)

      expect(result.success).toBe(false)
      expect(result.error?.message).toContain('Invalid file type')
      expect(result.error?.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('deleteAvatar', () => {
    it('should handle unauthenticated user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Not authenticated'),
      })

      const result = await deleteAvatar()

      expect(result.success).toBe(false)
      expect(result.error).toEqual({
        message: 'Not authenticated',
        code: 'UNAUTHORIZED',
      })
    })

    it('should handle missing avatar', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null,
      })

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { avatar_url: null },
            }),
          }),
        }),
      })

      const result = await deleteAvatar()

      expect(result.success).toBe(false)
      expect(result.error).toEqual({
        message: 'No avatar to delete',
        code: 'NOT_FOUND',
      })
    })
  })
})
