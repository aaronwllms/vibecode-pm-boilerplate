'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProfileEditForm } from './profile-edit-form'
import type { Profile } from '@/types/profile'

interface UserMenuProps {
  user: {
    email?: string
  }
  profile: Profile | null
  onSignOut: () => void
}

function getInitials(email?: string, name?: string | null): string {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  return email ? email.slice(0, 2).toUpperCase() : 'U'
}

export function UserMenu({ user, profile, onSignOut }: UserMenuProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleClose = () => {
    setIsEditing(false)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      // Reset to menu view when dropdown closes
      setIsEditing(false)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full transition-all hover:ring-2 hover:ring-foreground/20"
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={profile?.avatar_url || undefined}
              alt={profile?.full_name || user.email || 'User avatar'}
            />
            <AvatarFallback>
              {getInitials(user.email, profile?.full_name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={isEditing ? 'w-80' : 'w-56'}
        align="end"
        forceMount
      >
        {!isEditing ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email || 'No email'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault()
                handleEditClick()
              }}
            >
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut}>Sign Out</DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>Edit Profile</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ProfileEditForm
              user={user}
              profile={profile}
              onSignOut={onSignOut}
              onClose={handleClose}
            />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function LoginButton() {
  return (
    <Button asChild variant="default" size="sm">
      <Link href="/login">Login</Link>
    </Button>
  )
}
