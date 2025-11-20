'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { updateProfile } from '@/app/actions/profile'
import { AvatarUploadSection } from './avatar-upload-section'
import type { Profile } from '@/types/profile'

interface ProfileEditFormProps {
  user: {
    email?: string
  }
  profile: Profile | null
  onSignOut: () => void
  onClose: () => void
}

export function getInitials(email?: string, name?: string | null): string {
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

export function ProfileEditForm({
  user,
  profile,
  onSignOut,
  onClose,
}: ProfileEditFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string>('')

  const handleProfileUpdate = async (formData: FormData) => {
    setIsLoading(true)
    setMessage('')

    const result = await updateProfile(formData)

    if (result.success) {
      setMessage('Profile updated successfully')
    } else {
      setMessage(result.error || 'Failed to update profile')
    }

    setIsLoading(false)
  }

  return (
    <div className="p-4 space-y-4">
      <AvatarUploadSection
        user={user}
        profile={profile}
        getInitials={getInitials}
        onMessage={setMessage}
      />

      <form action={handleProfileUpdate} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Name</Label>
          <Input
            id="full_name"
            name="full_name"
            defaultValue={profile?.full_name || ''}
            placeholder="Your name"
            maxLength={100}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            defaultValue={profile?.bio || ''}
            placeholder="Tell us about yourself"
            maxLength={500}
            rows={3}
            disabled={isLoading}
          />
        </div>

        {message && (
          <p
            role="alert"
            className={`text-sm ${
              message.includes('success') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onClose()
              setMessage('')
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>

      <DropdownMenuSeparator />
      <Button
        variant="ghost"
        className="w-full"
        onClick={onSignOut}
        disabled={isLoading}
      >
        Sign Out
      </Button>
    </div>
  )
}
