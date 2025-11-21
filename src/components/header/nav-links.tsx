'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/tailwind'
import type { NavLink } from '@/utils/navigation'

interface NavLinksProps {
  links: NavLink[]
  className?: string
  onLinkClick?: () => void
}

export function NavLinks({ links, className, onLinkClick }: NavLinksProps) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex items-center gap-6', className)}>
      {links.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
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
