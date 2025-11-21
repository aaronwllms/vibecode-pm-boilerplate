'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/tailwind'

interface NavLink {
  href: string
  label: string
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Docs' },
  { href: '/users', label: 'Users' },
  { href: '/', label: 'Features' },
  { href: '/', label: 'Pricing' },
]

interface NavLinksProps {
  className?: string
  onLinkClick?: () => void
}

export function NavLinks({ className, onLinkClick }: NavLinksProps) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex items-center gap-6', className)}>
      {navLinks.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.label}
            href={link.href}
            onClick={onLinkClick}
            className={cn(
              'relative text-sm font-medium transition-all duration-200 hover:text-foreground',
              'after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-foreground',
              'after:transition-all after:duration-200 hover:after:w-full',
              isActive ? 'text-foreground after:w-full' : 'text-foreground/60',
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
