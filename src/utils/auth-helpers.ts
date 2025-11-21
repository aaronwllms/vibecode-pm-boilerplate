import { logger } from '@/utils/logger'
import type { Profile } from '@/types/profile'
import type { UserRole } from '@/utils/navigation'

/**
 * Determines the effective user role based on authentication and profile.
 * Returns 'public' if not authenticated, 'admin' if profile role is admin,
 * otherwise 'authenticated'.
 */
export function getUserRole(
  user: { id: string } | null,
  profile: Profile | null,
): UserRole {
  if (!user || !profile) {
    return 'public'
  }

  if (profile.role === 'admin') {
    return 'admin'
  }

  return 'authenticated'
}

/**
 * Throws an error if user is not authenticated.
 * Use this in server components and server actions to enforce authentication.
 */
export function requireAuth(user: { id: string } | null): void {
  if (!user) {
    logger.warn({
      source: 'auth-helpers.ts:requireAuth',
      message: 'Unauthorized access attempt',
      code: 'UNAUTHORIZED',
    })
    throw new Error('UNAUTHORIZED')
  }
}

/**
 * Throws an error if user is not an admin.
 * Use this in server components and server actions to enforce admin access.
 * Note: This should be called after requireAuth() to ensure user is authenticated.
 */
export function requireAdmin(profile: Profile | null): void {
  if (profile?.role !== 'admin') {
    logger.warn({
      source: 'auth-helpers.ts:requireAdmin',
      message: 'Forbidden access attempt - admin required',
      code: 'FORBIDDEN',
      context: {
        profileRole: profile?.role || null,
      },
    })
    throw new Error('FORBIDDEN')
  }
}
