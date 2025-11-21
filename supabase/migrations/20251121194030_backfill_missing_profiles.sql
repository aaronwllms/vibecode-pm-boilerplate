-- =====================================================================================
-- Backfill Missing Profiles
-- =====================================================================================
-- This migration creates profiles for any existing auth.users that don't have
-- a corresponding profile record. This handles cases where users were created
-- before the profile trigger existed or if the trigger failed.
-- =====================================================================================

-- Insert profiles for auth.users that don't have a profile
-- Use the service role to bypass RLS (this is a one-time data fix)
insert into public.profiles (id, email, full_name, role)
select 
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name' as full_name,
  'user' as role
from auth.users au
left join public.profiles p on au.id = p.id
where p.id is null
on conflict (id) do nothing;

