# 📋 Using This Template

This document provides instructions for using NextPM as a template for your new projects.

## 🚀 Quick Start (5 Minutes)

### 1. Create Your Project

**Option A: Use GitHub Template**
1. Click "Use this template" button on GitHub
2. Name your new repository
3. Clone your new repo:
   ```bash
   git clone https://github.com/your-username/your-new-project.git
   cd your-new-project
   ```

**Option B: Clone Directly**
```bash
git clone https://github.com/your-username/supa-next-starter.git my-new-project
cd my-new-project
rm -rf .git
git init
git add .
git commit -m "chore: initialize project from template"
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Set Up Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials (see next step).

### 4. Set Up Supabase

#### Create Supabase Project
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: Your project name
   - Database Password: Strong password (save this!)
   - Region: Choose closest to your users
4. Wait for project to initialize (~2 minutes)

#### Get API Credentials
1. Go to **Project Settings > API**
2. Copy these values to your `.env.local`:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Apply Database Schema
```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push the initial schema
pnpm db:push
```

### 5. Run Development Server
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

### 6. Deploy to Vercel

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/supa-next-starter)

**Manual Deploy:**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

Vercel will automatically:
- Build your project
- Deploy to production
- Set up preview deployments for PRs
- Configure custom domain (if added)

---

## 🎨 Customization Checklist

After setup, customize these for your project:

### Package Information
- [ ] Update `package.json`:
  - `name`
  - `description`
  - `version`
  - `author`
  - `keywords`
  - `repository`

### Branding
- [ ] Replace `public/favicon.ico`
- [ ] Replace `src/app/opengraph-image.png` (1200x630px)
- [ ] Replace `src/app/twitter-image.png` (1200x630px)
- [ ] Update app title in `src/app/layout.tsx`
- [ ] Update app description in `src/app/layout.tsx`

### Documentation
- [ ] Update `README.md` with your project details
- [ ] Update `AGENTS.md` with project-specific context
- [ ] Remove or update `TEMPLATE.md` (this file)

### Styling
- [ ] Customize Tailwind theme in `tailwind.config.js`
- [ ] Update color scheme in `src/app/globals.css`
- [ ] Modify shadcn/ui components in `src/components/ui/` if needed

### Code
- [ ] Remove example components from `src/app/test-examples/`
- [ ] Remove example API route `src/app/api/message/route.ts`
- [ ] Remove example hook `src/hooks/useGetMessage.ts`
- [ ] Remove or update example tests

---

## 📁 Project Structure

```
supa-next-starter/
├── .cursor/rules/          # Cursor AI rules for consistent development
├── src/
│   ├── app/                # Next.js 14 App Router
│   │   ├── api/           # API routes
│   │   ├── login/         # Auth page
│   │   └── test-examples/ # Example components (remove after learning)
│   ├── components/        # React components
│   │   └── ui/           # shadcn/ui components
│   ├── hooks/            # Custom React hooks
│   ├── mocks/            # MSW mock handlers for testing
│   ├── providers/        # React context providers
│   ├── test/             # Test utilities
│   └── utils/            # Utility functions
├── supabase/
│   └── migrations/       # Database migrations
├── AGENTS.md             # Project context for AI assistants
├── TEMPLATE.md           # This file - template usage guide
└── README.md             # Project documentation
```

---

## 🗄️ Database Setup

### Understanding the Example Schema

The template includes an example `profiles` table showing best practices:
- **Row Level Security (RLS)** enabled
- **Foreign key** to `auth.users`
- **Policies** for secure data access
- **Timestamps** for audit trails

### Customizing the Schema

1. **Edit migrations:**
   ```bash
   # Create new migration
   supabase migration new your_migration_name
   
   # Edit: supabase/migrations/[timestamp]_your_migration_name.sql
   ```

2. **Apply locally:**
   ```bash
   pnpm db:reset  # Reset and apply all migrations
   ```

3. **Generate TypeScript types:**
   ```bash
   pnpm db:types
   ```

4. **Push to production:**
   ```bash
   supabase db push --linked
   ```

### Example: Adding a New Table

```sql
-- supabase/migrations/[timestamp]_add_posts.sql
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content text,
  published boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.posts enable row level security;

-- Policies
create policy "Users can view published posts"
  on public.posts for select
  using (published = true);

create policy "Users can manage their own posts"
  on public.posts for all
  using (auth.uid() = user_id);
```

---

## 🧪 Testing

The template includes a complete testing setup:

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test -- --watch

# Coverage
pnpm test -- --coverage
```

### Writing Tests
- Co-locate tests with components: `component.test.tsx`
- Use custom test utilities from `@/test/test-utils`
- Mock API calls with MSW handlers in `src/mocks/`
- See examples in `src/app/test-examples/`

---

## 🎯 Development Workflow

### Daily Development
```bash
pnpm dev          # Start dev server
pnpm lint         # Check for linting issues
pnpm type-check   # Check TypeScript
pnpm test         # Run tests
```

### Pre-Commit (Automatic)
The template uses Husky + lint-staged to automatically:
- Format code with Prettier
- Fix ESLint issues
- Run type checking

### Database Changes
```bash
pnpm db:types     # Generate TypeScript types
pnpm db:push      # Push migrations to linked project
pnpm db:reset     # Reset local database
```

---

## 🚢 Deployment

### Automatic Deployments (Recommended)

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request
- **Branch**: Optional per branch

### Manual Deployment

```bash
# Build locally first
pnpm build

# Deploy
vercel --prod
```

### Environment Variables

**Required in Vercel:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**How to add:**
1. Go to Vercel project settings
2. Navigate to Environment Variables
3. Add variables for Production, Preview, and Development
4. Redeploy if needed

---

## 📚 Stack Documentation

- **Next.js 14**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **shadcn/ui**: [ui.shadcn.com](https://ui.shadcn.com)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **TanStack Query**: [tanstack.com/query](https://tanstack.com/query)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)

---

## 🤝 Getting Help

- Check `AGENTS.md` for AI assistant context
- Review `.cursor/rules/` for coding standards
- See `README.md` for project-specific documentation
- Refer to stack documentation above

---

## 📄 License

This template is MIT licensed. You can use it for any project, commercial or personal.

---

**Happy coding! 🚀**

