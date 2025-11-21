-- =====================================================================================
-- Drop Recursive Admin RLS Policy
-- =====================================================================================
-- This migration drops the "Admins can read all profiles" policy that causes
-- infinite recursion. The existing "Profiles are viewable by all authenticated users"
-- policy already allows all authenticated users (including admins) to read all profiles.
-- =====================================================================================

-- Drop the recursive admin policy
drop policy if exists "Admins can read all profiles" on public.profiles;

