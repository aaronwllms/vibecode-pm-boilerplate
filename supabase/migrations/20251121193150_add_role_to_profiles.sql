-- =====================================================================================
-- Add Role Column to Profiles
-- =====================================================================================
-- This migration adds a role column to the profiles table to support role-based
-- access control (admin, user).
-- =====================================================================================

-- Add role column with CHECK constraint
alter table public.profiles
add column if not exists role text
  check (role in ('admin', 'user'))
  default 'user'
  not null;

-- Update existing profiles to have 'user' role (in case any are null)
update public.profiles
set role = 'user'
where role is null;

-- Add comment for documentation
comment on column public.profiles.role is 'User role: admin or user (default: user)';

