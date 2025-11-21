import Link from 'next/link'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { signOutAction } from '@/app/actions/auth'
import { NavLinks } from './nav-links'
import { UserMenu, LoginButton } from './user-menu'
import { MobileNav } from './mobile-nav'
import ThemeToggle from '@/components/ThemeToggle'
import type { Profile } from '@/types/profile'

export async function AppHeader() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile: Profile | null = null

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    profile = data
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
            aria-label="Home"
          >
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              SupaNext
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavLinks className="hidden md:flex" />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle - Desktop Only */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* User Menu - Desktop Only */}
          <div className="hidden md:block">
            {user && profile ? (
              <UserMenu user={user} profile={profile} onSignOut={signOutAction} />
            ) : (
              <LoginButton />
            )}
          </div>

          {/* Mobile Navigation */}
          <MobileNav
            user={user}
            profile={profile}
            onSignOut={signOutAction}
          />
        </div>
      </div>
    </header>
  )
}

