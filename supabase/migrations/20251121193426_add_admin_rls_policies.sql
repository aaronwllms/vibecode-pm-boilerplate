-- =====================================================================================
-- Admin RLS Policies
-- =====================================================================================
-- This migration adds Row Level Security policies that allow admin users
-- to read all profiles (for admin user management pages).
-- =====================================================================================

-- Policy: Admins can read all profiles
-- This allows admin users to view all user profiles in the admin panel
create policy "Admins can read all profiles"
  on public.profiles
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- Note: The existing policy "Profiles are viewable by all authenticated users"
-- already allows all authenticated users to read profiles, but this policy
-- specifically ensures admins have explicit access for admin operations.

