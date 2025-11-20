-- =====================================================================================
-- Initial Schema Migration
-- =====================================================================================
-- This migration creates the example profile table and demonstrates best practices:
-- - Row Level Security (RLS) enabled
-- - Proper foreign keys to auth.users
-- - Security policies
-- - Audit timestamps
-- - Type-safe structure for TypeScript generation
-- =====================================================================================

-- Create profiles table
-- This extends the built-in auth.users table with custom user data
create table if not exists public.profiles (
  -- Primary key that matches auth.users.id
  id uuid references auth.users on delete cascade primary key,
  
  -- User email (synced from auth.users for convenience)
  email text unique not null,
  
  -- Custom profile fields
  full_name text,
  avatar_url text,
  bio text,
  
  -- Audit fields
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- =====================================================================================
-- Row Level Security (RLS)
-- =====================================================================================
-- Enable RLS to ensure users can only access their own data
alter table public.profiles enable row level security;

-- Policy: All authenticated users can view profiles
create policy "Profiles are viewable by all authenticated users"
  on public.profiles
  for select
  to authenticated
  using (true);

-- Policy: Users can update their own profile
create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Policy: Users can insert their own profile (on signup)
create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- =====================================================================================
-- Functions
-- =====================================================================================

-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call handle_updated_at on profile updates
create trigger on_profile_updated
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- =====================================================================================
-- Automatic Profile Creation
-- =====================================================================================
-- Function to create profile automatically when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- =====================================================================================
-- Indexes
-- =====================================================================================
-- Add indexes for commonly queried fields
create index if not exists profiles_email_idx on public.profiles(email);
create index if not exists profiles_created_at_idx on public.profiles(created_at desc);

-- =====================================================================================
-- Comments
-- =====================================================================================
comment on table public.profiles is 'User profiles with custom data extending auth.users';
comment on column public.profiles.id is 'References auth.users.id';
comment on column public.profiles.email is 'User email synced from auth.users';
comment on column public.profiles.full_name is 'User full name or display name';
comment on column public.profiles.avatar_url is 'URL to user avatar image';
comment on column public.profiles.bio is 'User bio or description';

-- =====================================================================================
-- Storage Setup for Avatars
-- =====================================================================================
-- Create avatars bucket for user profile pictures
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage Policy: Avatar images are publicly accessible
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

-- Storage Policy: Users can upload their own avatar
create policy "Users can upload their own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage Policy: Users can update their own avatar
create policy "Users can update their own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage Policy: Users can delete their own avatar
create policy "Users can delete their own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- =====================================================================================
-- Example: Adding More Tables
-- =====================================================================================
-- Uncomment and modify this example to add more tables to your app

/*
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text,
  published boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.posts enable row level security;

-- Policies
create policy "Anyone can view published posts"
  on public.posts
  for select
  using (published = true);

create policy "Users can manage their own posts"
  on public.posts
  for all
  using (auth.uid() = user_id);

-- Indexes
create index posts_user_id_idx on public.posts(user_id);
create index posts_published_idx on public.posts(published) where published = true;
create index posts_created_at_idx on public.posts(created_at desc);

-- Updated at trigger
create trigger on_post_updated
  before update on public.posts
  for each row
  execute function public.handle_updated_at();
*/

