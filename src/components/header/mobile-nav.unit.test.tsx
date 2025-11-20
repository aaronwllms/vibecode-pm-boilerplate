import { render, screen, waitFor } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { MobileNav } from './mobile-nav'
import type { Profile } from '@/types/profile'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}))

const mockUser = {
  email: 'test@example.com',
}

const mockProfile: Profile = {
  id: '123',
  email: 'test@example.com',
  full_name: 'Test User',
  avatar_url: null,
  bio: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

const mockOnSignOut = jest.fn()

describe('MobileNav', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render mobile menu button', () => {
    render(
      <MobileNav user={mockUser} profile={mockProfile} onSignOut={mockOnSignOut} />
    )

    const menuButton = screen.getByRole('button', { name: /open menu/i })
    expect(menuButton).toBeInTheDocument()
  })

  it('should open sheet when menu button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MobileNav user={mockUser} profile={mockProfile} onSignOut={mockOnSignOut} />
    )

    const menuButton = screen.getByRole('button', { name: /open menu/i })
    await user.click(menuButton)

    await waitFor(() => {
      expect(screen.getByText('Menu')).toBeInTheDocument()
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Docs')).toBeInTheDocument()
    })
  })

  it('should show theme toggle in mobile menu', async () => {
    const user = userEvent.setup()
    render(
      <MobileNav user={mockUser} profile={mockProfile} onSignOut={mockOnSignOut} />
    )

    const menuButton = screen.getByRole('button', { name: /open menu/i })
    await user.click(menuButton)

    await waitFor(() => {
      expect(screen.getByText('Theme')).toBeInTheDocument()
    })
  })

  it('should show user menu when authenticated', async () => {
    const user = userEvent.setup()
    render(
      <MobileNav user={mockUser} profile={mockProfile} onSignOut={mockOnSignOut} />
    )

    const menuButton = screen.getByRole('button', { name: /open menu/i })
    await user.click(menuButton)

    await waitFor(() => {
      expect(screen.getByText('Account')).toBeInTheDocument()
    })
  })

  it('should show login button when not authenticated', async () => {
    const user = userEvent.setup()
    render(
      <MobileNav user={null} profile={null} onSignOut={mockOnSignOut} />
    )

    const menuButton = screen.getByRole('button', { name: /open menu/i })
    await user.click(menuButton)

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
    })
  })

  it('should close sheet when nav link is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MobileNav user={mockUser} profile={mockProfile} onSignOut={mockOnSignOut} />
    )

    const menuButton = screen.getByRole('button', { name: /open menu/i })
    await user.click(menuButton)

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Home'))

    // Sheet should close - menu content should not be visible
    await waitFor(() => {
      expect(screen.queryByText('Menu')).not.toBeInTheDocument()
    })
  })
})

