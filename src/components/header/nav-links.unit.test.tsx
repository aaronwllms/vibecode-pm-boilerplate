import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { NavLinks } from './nav-links'
import type { NavLink } from '@/utils/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}))

const mockLinks: NavLink[] = [
  { href: '/', label: 'Home', access: ['public', 'authenticated', 'admin'] },
  {
    href: '/docs',
    label: 'Docs',
    access: ['public', 'authenticated', 'admin'],
  },
  { href: '/users', label: 'Users', access: ['admin'] },
  {
    href: '/pricing',
    label: 'Pricing',
    access: ['public', 'authenticated', 'admin'],
  },
]

describe('NavLinks', () => {
  it('should render all navigation links', () => {
    render(<NavLinks links={mockLinks} />)

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Docs')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
  })

  it('should highlight active link', () => {
    const { usePathname } = require('next/navigation')
    usePathname.mockReturnValue('/')

    render(<NavLinks links={mockLinks} />)

    const homeLink = screen.getByText('Home')
    expect(homeLink).toHaveClass('text-foreground')
  })

  it('should call onLinkClick when link is clicked', async () => {
    const onLinkClick = jest.fn()
    const user = userEvent.setup()
    render(<NavLinks links={mockLinks} onLinkClick={onLinkClick} />)

    await user.click(screen.getByText('Docs'))

    expect(onLinkClick).toHaveBeenCalledTimes(1)
  })

  it('should apply custom className', () => {
    const { container } = render(
      <NavLinks links={mockLinks} className="custom-class" />,
    )

    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('custom-class')
  })

  it('should have correct href for Users link', () => {
    render(<NavLinks links={mockLinks} />)

    const usersLink = screen.getByText('Users').closest('a')
    expect(usersLink).toHaveAttribute('href', '/users')
  })
})
