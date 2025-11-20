import { render, screen } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { NavLinks } from './nav-links'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}))

describe('NavLinks', () => {
  it('should render all navigation links', () => {
    render(<NavLinks />)

    expect(screen.getByText('Docs')).toBeInTheDocument()
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
  })

  it('should highlight active link', () => {
    const { usePathname } = require('next/navigation')
    usePathname.mockReturnValue('/')

    render(<NavLinks />)

    const docsLink = screen.getByText('Docs')
    expect(docsLink).toHaveClass('text-foreground')
  })

  it('should call onLinkClick when link is clicked', async () => {
    const onLinkClick = jest.fn()
    const user = userEvent.setup()
    render(<NavLinks onLinkClick={onLinkClick} />)

    await user.click(screen.getByText('Docs'))

    expect(onLinkClick).toHaveBeenCalledTimes(1)
  })

  it('should apply custom className', () => {
    const { container } = render(<NavLinks className="custom-class" />)

    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('custom-class')
  })
})

