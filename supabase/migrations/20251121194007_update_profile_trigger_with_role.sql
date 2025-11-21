-- =====================================================================================
-- Update Profile Creation Trigger to Include Role
-- =====================================================================================
-- This migration updates the handle_new_user() function to explicitly set the role
-- field when creating a new profile, ensuring compatibility with the new role column.
-- =====================================================================================

-- Update the function to explicitly set role
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'user'  -- Default role for new users
  );
  return new;
end;
$$ language plpgsql security definer;

