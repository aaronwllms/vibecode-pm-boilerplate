'use client'

import { useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { uploadAvatar, deleteAvatar } from '@/app/actions/profile'
import { useError } from '@/providers/error-provider'
import type { Profile } from '@/types/profile'

interface AvatarUploadSectionProps {
  user: {
    email?: string
  }
  profile: Profile | null
  getInitials: (email?: string, name?: string | null) => string
  onMessage: (message: string) => void
}

export function AvatarUploadSection({
  user,
  profile,
  getInitials,
  onMessage,
}: AvatarUploadSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setError } = useError()

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) return

    setIsLoading(true)
    onMessage('')

    const formData = new FormData()
    formData.append('avatar', fileInputRef.current.files[0])

    const result = await uploadAvatar(formData)

    if (result.success) {
      onMessage('Avatar updated successfully')
      setAvatarPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } else if (result.error) {
      setError(result.error)
    }

    setIsLoading(false)
  }

  const handleDeleteAvatar = async () => {
    setIsLoading(true)
    onMessage('')

    const result = await deleteAvatar()

    if (result.success) {
      onMessage('Avatar deleted successfully')
    } else if (result.error) {
      setError(result.error)
    }

    setIsLoading(false)
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <Avatar className="h-20 w-20">
        <AvatarImage
          src={avatarPreview || profile?.avatar_url || undefined}
          alt={profile?.full_name || user.email || 'User avatar'}
        />
        <AvatarFallback className="text-2xl">
          {getInitials(user.email, profile?.full_name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          Choose File
        </Button>
        {avatarPreview && (
          <Button
            type="button"
            size="sm"
            onClick={handleAvatarUpload}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            Upload
          </Button>
        )}
        {profile?.avatar_url && !avatarPreview && (
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={handleDeleteAvatar}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            Delete
          </Button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
        aria-label="Upload profile picture"
      />
    </div>
  )
}

