-- =====================================================================================
-- Seed Data for Local Development
-- =====================================================================================
-- This file is automatically run when you execute `supabase db reset` or `supabase db seed`
-- Use it to populate your local database with test data for development.
-- =====================================================================================

-- Example: Insert test users into profiles
-- Note: Users must be created through auth.users first (via signup)
-- This is just an example of how you might seed data after users are created

-- Uncomment and modify as needed:
/*
-- Insert example profile data (user must exist in auth.users)
INSERT INTO public.profiles (id, email, full_name, bio)
VALUES 
  (
    'replace-with-actual-user-id',
    'test@example.com',
    'Test User',
    'This is a test user account for local development'
  )
ON CONFLICT (id) DO NOTHING;
*/

-- =====================================================================================
-- Example: Seed additional tables
-- =====================================================================================
/*
INSERT INTO public.posts (user_id, title, content, published)
VALUES 
  (
    'replace-with-actual-user-id',
    'Welcome Post',
    'This is a sample post for local development.',
    true
  )
ON CONFLICT DO NOTHING;
*/

