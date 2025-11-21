export type UserRole = 'admin' | 'authenticated' | 'public'

export interface NavLink {
  href: string
  label: string
  access: UserRole[]
}

export const navigationConfig: NavLink[] = [
  // Public links
  { href: '/', label: 'Home', access: ['public', 'authenticated', 'admin'] },
  {
    href: '/how-it-works',
    label: 'How It Works',
    access: ['public', 'authenticated', 'admin'],
  },
  {
    href: '/docs',
    label: 'Docs',
    access: ['public', 'authenticated', 'admin'],
  },
  {
    href: '/pricing',
    label: 'Pricing',
    access: ['public', 'authenticated', 'admin'],
  },

  // Authenticated user links
  {
    href: '/dashboard',
    label: 'Dashboard',
    access: ['authenticated', 'admin'],
  },
  { href: '/profile', label: 'Profile', access: ['authenticated', 'admin'] },

  // Admin-only links
  { href: '/admin', label: 'Admin', access: ['admin'] },
  { href: '/users', label: 'User Management', access: ['admin'] },
]

/**
 * Filters navigation links based on user role.
 * Admin users see all links, authenticated users see authenticated + public,
 * public users see only public links.
 */
export function getVisibleLinks(userRole: UserRole): NavLink[] {
  return navigationConfig.filter((link) => {
    // Admin sees everything
    if (userRole === 'admin') {
      return true
    }
    // Check if user role is in the link's access array
    return link.access.includes(userRole)
  })
}
