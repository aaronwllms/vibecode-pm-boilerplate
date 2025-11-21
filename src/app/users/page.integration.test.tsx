import { render, screen } from '@/test/test-utils'
import UsersPage from './page'
import type { Profile } from '@/types/profile'

// Mock Next.js modules
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({})),
}))

// Mock Supabase client
const mockSelect = jest.fn()
const mockOrder = jest.fn()
const mockEq = jest.fn()
const mockSingle = jest.fn()
const mockFrom = jest.fn(() => ({
  select: mockSelect,
}))

const mockGetUser = jest.fn()
const mockAuth = {
  getUser: mockGetUser,
}

const mockSupabase = {
  from: mockFrom,
  auth: mockAuth,
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

describe('UsersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock auth.getUser() to return authenticated admin user
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'admin-user-id',
          email: 'admin@example.com',
        },
      },
      error: null,
    })

    // Mock profile query for admin check
    mockSelect.mockReturnValue({
      eq: mockEq,
      order: mockOrder,
    })
    mockEq.mockReturnValue({
      single: mockSingle,
    })
    mockSingle.mockResolvedValue({
      data: {
        id: 'admin-user-id',
        role: 'admin',
      },
      error: null,
    })

    // Mock users query
    mockOrder.mockResolvedValue({
      data: null,
      error: null,
    })
  })

  describe('Happy Path', () => {
    it('should render users table with data', async () => {
      const mockUsers: Profile[] = [
        {
          id: '1',
          email: 'user1@example.com',
          full_name: 'User One',
          avatar_url: null,
          bio: null,
          role: 'user',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          email: 'user2@example.com',
          full_name: 'User Two',
          avatar_url: null,
          bio: null,
          role: 'user',
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      ]

      mockOrder.mockResolvedValue({
        data: mockUsers,
        error: null,
      })

      const page = await UsersPage()
      render(page)

      expect(screen.getByText('Users')).toBeInTheDocument()
      expect(screen.getByText('user1@example.com')).toBeInTheDocument()
      expect(screen.getByText('User One')).toBeInTheDocument()
      expect(screen.getByText('user2@example.com')).toBeInTheDocument()
      expect(screen.getByText('User Two')).toBeInTheDocument()
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    it('should render empty state when no users', async () => {
      // Mock users query
      mockSelect.mockReturnValueOnce({
        eq: mockEq,
        order: mockOrder,
      })
      mockEq.mockReturnValueOnce({
        single: mockSingle,
      })
      mockSingle.mockResolvedValueOnce({
        data: {
          id: 'admin-user-id',
          role: 'admin',
        },
        error: null,
      })

      // Mock users list query
      mockSelect.mockReturnValueOnce({
        order: mockOrder,
      })
      mockOrder.mockResolvedValue({
        data: [],
        error: null,
      })

      const page = await UsersPage()
      render(page)

      expect(screen.getByText('Users')).toBeInTheDocument()
      expect(screen.getByText('No users found.')).toBeInTheDocument()
    })

    it('should handle null full_name gracefully', async () => {
      const mockUsers: Profile[] = [
        {
          id: '1',
          email: 'user1@example.com',
          full_name: null,
          avatar_url: null,
          bio: null,
          role: 'user',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ]

      // Mock users query
      mockSelect.mockReturnValueOnce({
        eq: mockEq,
        order: mockOrder,
      })
      mockEq.mockReturnValueOnce({
        single: mockSingle,
      })
      mockSingle.mockResolvedValueOnce({
        data: {
          id: 'admin-user-id',
          role: 'admin',
        },
        error: null,
      })

      // Mock users list query
      mockSelect.mockReturnValueOnce({
        order: mockOrder,
      })
      mockOrder.mockResolvedValue({
        data: mockUsers,
        error: null,
      })

      const page = await UsersPage()
      render(page)

      expect(screen.getByText('user1@example.com')).toBeInTheDocument()
      // Should show the dash for null full_name
      const cells = screen.getAllByRole('cell')
      expect(cells.some((cell) => cell.textContent === '—')).toBe(true)
    })
  })

  describe('Invalid Input / Error Handling', () => {
    it('should handle database error', async () => {
      // Mock admin check
      mockSelect.mockReturnValueOnce({
        eq: mockEq,
        order: mockOrder,
      })
      mockEq.mockReturnValueOnce({
        single: mockSingle,
      })
      mockSingle.mockResolvedValueOnce({
        data: {
          id: 'admin-user-id',
          role: 'admin',
        },
        error: null,
      })

      // Mock users query error
      mockSelect.mockReturnValueOnce({
        order: mockOrder,
      })
      mockOrder.mockResolvedValue({
        data: null,
        error: {
          code: 'PGRST116',
          message: 'Row not found',
        },
      })

      const page = await UsersPage()
      render(page)

      expect(screen.getByText('Users')).toBeInTheDocument()
      expect(screen.getByText(/No users found/i)).toBeInTheDocument()
    })

    it('should handle RLS error', async () => {
      // Mock admin check
      mockSelect.mockReturnValueOnce({
        eq: mockEq,
        order: mockOrder,
      })
      mockEq.mockReturnValueOnce({
        single: mockSingle,
      })
      mockSingle.mockResolvedValueOnce({
        data: {
          id: 'admin-user-id',
          role: 'admin',
        },
        error: null,
      })

      // Mock users query error
      mockSelect.mockReturnValueOnce({
        order: mockOrder,
      })
      mockOrder.mockResolvedValue({
        data: null,
        error: {
          code: '42501',
          message: 'Permission denied',
        },
      })

      const page = await UsersPage()
      render(page)

      expect(screen.getByText('Users')).toBeInTheDocument()
      expect(
        screen.getByText(/You do not have permission to view users/i),
      ).toBeInTheDocument()
    })

    it('should handle generic database error', async () => {
      // Mock admin check
      mockSelect.mockReturnValueOnce({
        eq: mockEq,
        order: mockOrder,
      })
      mockEq.mockReturnValueOnce({
        single: mockSingle,
      })
      mockSingle.mockResolvedValueOnce({
        data: {
          id: 'admin-user-id',
          role: 'admin',
        },
        error: null,
      })

      // Mock users query error
      mockSelect.mockReturnValueOnce({
        order: mockOrder,
      })
      mockOrder.mockResolvedValue({
        data: null,
        error: {
          code: 'PGRST301',
          message: 'Database connection error',
        },
      })

      const page = await UsersPage()
      render(page)

      expect(screen.getByText('Users')).toBeInTheDocument()
      expect(screen.getByText(/Failed to load users/i)).toBeInTheDocument()
    })

    it('should handle unexpected errors', async () => {
      // Mock admin check
      mockSelect.mockReturnValueOnce({
        eq: mockEq,
        order: mockOrder,
      })
      mockEq.mockReturnValueOnce({
        single: mockSingle,
      })
      mockSingle.mockResolvedValueOnce({
        data: {
          id: 'admin-user-id',
          role: 'admin',
        },
        error: null,
      })

      // Mock users query to throw error
      mockSelect.mockReturnValueOnce({
        order: mockOrder,
      })
      mockOrder.mockRejectedValue(new Error('Unexpected error'))

      const page = await UsersPage()
      render(page)

      expect(screen.getByText('Users')).toBeInTheDocument()
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    })
  })

  describe('Boundary Cases', () => {
    it('should handle null data response', async () => {
      // Mock admin check
      mockSelect.mockReturnValueOnce({
        eq: mockEq,
        order: mockOrder,
      })
      mockEq.mockReturnValueOnce({
        single: mockSingle,
      })
      mockSingle.mockResolvedValueOnce({
        data: {
          id: 'admin-user-id',
          role: 'admin',
        },
        error: null,
      })

      // Mock users query
      mockSelect.mockReturnValueOnce({
        order: mockOrder,
      })
      mockOrder.mockResolvedValue({
        data: null,
        error: null,
      })

      const page = await UsersPage()
      render(page)

      expect(screen.getByText('Users')).toBeInTheDocument()
      expect(screen.getByText('No users found.')).toBeInTheDocument()
    })

    it('should format dates correctly', async () => {
      const mockUsers: Profile[] = [
        {
          id: '1',
          email: 'user1@example.com',
          full_name: 'User One',
          avatar_url: null,
          bio: null,
          role: 'user',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z',
        },
      ]

      // Mock admin check
      mockSelect.mockReturnValueOnce({
        eq: mockEq,
        order: mockOrder,
      })
      mockEq.mockReturnValueOnce({
        single: mockSingle,
      })
      mockSingle.mockResolvedValueOnce({
        data: {
          id: 'admin-user-id',
          role: 'admin',
        },
        error: null,
      })

      // Mock users list query
      mockSelect.mockReturnValueOnce({
        order: mockOrder,
      })
      mockOrder.mockResolvedValue({
        data: mockUsers,
        error: null,
      })

      const page = await UsersPage()
      render(page)

      // Check that date is formatted (should contain month abbreviation)
      const cells = screen.getAllByRole('cell')
      const dateCell = cells.find((cell) => cell.textContent?.includes('Jan'))
      expect(dateCell).toBeInTheDocument()
    })
  })

  describe('Data Fetching', () => {
    it('should call Supabase with correct query', async () => {
      // Mock users query
      mockSelect.mockReturnValueOnce({
        eq: mockEq,
        order: mockOrder,
      })
      mockEq.mockReturnValueOnce({
        single: mockSingle,
      })
      mockSingle.mockResolvedValueOnce({
        data: {
          id: 'admin-user-id',
          role: 'admin',
        },
        error: null,
      })

      // Mock users list query
      mockSelect.mockReturnValueOnce({
        order: mockOrder,
      })
      mockOrder.mockResolvedValue({
        data: [],
        error: null,
      })

      await UsersPage()

      expect(mockFrom).toHaveBeenCalledWith('profiles')
      expect(mockSelect).toHaveBeenCalledWith('role')
      expect(mockSelect).toHaveBeenCalledWith(
        'id, email, full_name, created_at',
      )
      expect(mockOrder).toHaveBeenCalledWith('created_at', {
        ascending: false,
      })
    })
  })
})
