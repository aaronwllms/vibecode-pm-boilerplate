'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { NavLinks } from './nav-links'
import { UserMenu, LoginButton } from './user-menu'
import ThemeToggle from '@/components/ThemeToggle'
import type { Profile } from '@/types/profile'
import type { NavLink } from '@/utils/navigation'

interface MobileNavProps {
  user: {
    email?: string
  } | null
  profile: Profile | null
  onSignOut: () => void
  links: NavLink[]
}

export function MobileNav({ user, profile, onSignOut, links }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-6">
          <NavLinks
            links={links}
            className="flex-col items-start gap-4"
            onLinkClick={() => setOpen(false)}
          />
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theme</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Account</span>
              {user && profile ? (
                <UserMenu user={user} profile={profile} onSignOut={onSignOut} />
              ) : (
                <LoginButton />
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
