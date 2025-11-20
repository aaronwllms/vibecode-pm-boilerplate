![image](https://github.com/michaeltroya/supa-next-starter/assets/38507347/2ea40874-98de-49ec-ab6a-74c816e6ca22)

<h1 align="center">⚡ SupaNext Starter Kit ⚡</h1>

<p align="center">
 The Last Next.js and Supabase Starter You Will Ever Need
</p>

<div align="center">

<img alt="GitHub License" src="https://img.shields.io/github/license/michaeltroya/supa-next-starter">

  <a href="https://twitter.com/intent/follow?screen_name=michaeltroya_">
   <img alt="X (formerly Twitter) Follow" src="https://img.shields.io/twitter/follow/michaeltroya_">
  </a>
</div>

<div align="center">
  <sub>Created by <a href="https://twitter.com/michaeltroya_">Michael Troya</a>
</div>

<br/>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#quick-start"><strong>Quick Start</strong></a> ·
  <a href="#documentation"><strong>Documentation</strong></a> ·
  <a href="#deployment"><strong>Deploy</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback</strong></a>
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/michaeltroya/supa-next-starter&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase%20credentials%20for%20your%20project&envLink=https://app.supabase.com/project/_/settings/api&project-name=my-supanext-app&repository-name=my-supanext-app">
    <img src="https://vercel.com/button" alt="Deploy with Vercel"/>
  </a>
</p>
<br/>

## Features

- ⚡️ Next.js 14 (App Router)
- 💚 Supabase w/ supabase-ssr - Works across the entire [Next.js](https://nextjs.org) stack (App Router, Pages Router, Client, Server, Middleware, It just works!)
- ⚛️ React 18
- ⛑ TypeScript
- 📦 [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- 🎨 [Tailwind](https://tailwindcss.com/)
- 🔌 [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components that you can copy and paste into your apps.
- 🧪 Jest w/SWC + React Testing Library - Unit tests for all of your code.
- 🎛️ [MSW](https://mswjs.io/)v2 - Intercept requests inside your tests (set up for testing only)
- 🪝[TanStackQuery](https://tanstack.com/query/v5)v5 - The best way to fetch data on the client
- 📏 ESLint — To find and fix problems in your code
- 💖 Prettier — Code Formatter for consistent style
- 🐶 Husky — For running scripts before committing
- 🚫 lint-staged — Run ESLint and Prettier against staged Git files
- 👷 Github Actions — Run Type Checks, Tests, and Linters on Pull Requests
- 🗂 Path Mapping — Import components or images using the `@` prefix
- ⚪⚫ Dark mode - Toggle theme modes with [next-themes](https://github.com/pacocoursey/next-themes)
- ✨ Next Top Loader - Render a pleasent top loader on navigation with [nextjs-toploader](https://github.com/TheSGJ/nextjs-toploader)
- 🔋 Lots Extras - Next Bundle Analyzer, Vercel Analytics, Vercel Geist Font

## Quick Start

### Option 1: Automated Setup (Recommended)

1. **Use this template** (click "Use this template" button on GitHub) or clone:
   ```bash
   git clone https://github.com/michaeltroya/supa-next-starter.git my-project
   cd my-project
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Run setup wizard:**
   ```bash
   pnpm run setup-project
   ```
   
   This will guide you through:
   - Customizing project details
   - Creating `.env.local`
   - Setting up Supabase

4. **Start developing:**
   ```bash
   pnpm dev
   ```
   
   Visit [localhost:3000](http://localhost:3000/) 🎉

> 📖 For detailed template usage instructions, see [TEMPLATE.md](TEMPLATE.md)

### Option 2: Manual Setup

1. **Clone and install:**
   ```bash
   git clone https://github.com/michaeltroya/supa-next-starter.git my-project
   cd my-project
   pnpm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   
   Get these from [Supabase Dashboard](https://app.supabase.com) → Project Settings → API

3. **Set up database:**
   ```bash
   # Install Supabase CLI (if not installed)
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Push migrations
   pnpm db:push
   ```

4. **Run dev server:**
   ```bash
   pnpm dev
   ```

### Option 3: One-Click Deploy

Deploy directly to Vercel with environment variable prompts:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/michaeltroya/supa-next-starter&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY)

After deployment:
1. Create a [Supabase project](https://app.supabase.com)
2. Add environment variables in Vercel project settings
3. Redeploy

> 💡 **Local Supabase Development**: Check out [the docs](https://supabase.com/docs/guides/getting-started/local-development) to run Supabase locally with Docker.

## Showcase

Websites started using this template:

- [mainspring.pro](https://www.mainspring.pro/)
- [Add yours](https://github.com/michaeltroya/supa-next-starter/edit/main/README.md)

# Documentation

> **For AI Coding Agents**: See [AGENTS.md](AGENTS.md) for detailed setup instructions, code conventions, testing guidelines, and project structure information.

> **Using as a Template**: See [TEMPLATE.md](TEMPLATE.md) for complete guide on customizing this starter for your project.

### Requirements

- Node.js >= 18.17.0
- pnpm 8 or higher

### Development Scripts

**Core Commands:**
- `pnpm dev` — Start development server at `http://localhost:3000`
- `pnpm build` — Create optimized production build
- `pnpm start` — Start production server
- `pnpm setup-project` — Interactive project setup wizard

**Code Quality:**
- `pnpm type-check` — Validate TypeScript code
- `pnpm lint` — Run ESLint on all files
- `pnpm format` — Format code with Prettier
- `pnpm format-check` — Check code formatting
- `pnpm test` — Run all tests
- `pnpm test:ci` — Run tests in CI mode

**Database (Supabase):**
- `pnpm db:types` — Generate TypeScript types from database schema
- `pnpm db:push` — Push migrations to linked Supabase project
- `pnpm db:reset` — Reset local database and apply all migrations
- `pnpm db:seed` — Seed database with test data
- `pnpm supabase:start` — Start local Supabase stack
- `pnpm supabase:stop` — Stop local Supabase stack
- `pnpm supabase:status` — Check local Supabase status

**Analysis:**
- `pnpm analyze` — Build and open bundle analyzer

### Paths

TypeScript is pre-configured with custom path mappings. To import components or files, use the `@` prefix.

```tsx
import { Button } from '@/components/ui/Button'

// To import images or other files from the public folder
import avatar from '@/public/avatar.png'
```

## Deployment

### Vercel (Recommended)

This starter is optimized for [Vercel](https://vercel.com):

1. **One-Click Deploy:**
   
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/michaeltroya/supa-next-starter)

2. **Manual Deploy:**
   - Push your code to GitHub
   - Import project in Vercel
   - Add environment variables
   - Deploy!

Vercel automatically:
- ✅ Detects Next.js configuration
- ✅ Sets up preview deployments for PRs
- ✅ Configures production deployments on `main`
- ✅ Optimizes performance

### Environment Variables in Vercel

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Add these in: **Vercel Project Settings → Environment Variables**

### Other Platforms

While optimized for Vercel, this starter works on any platform supporting Next.js 14:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

## Database Setup

This starter includes an example database schema in `supabase/migrations/`:

### Initial Schema Features:
- ✅ User profiles table with RLS
- ✅ Automatic profile creation on signup
- ✅ Updated_at timestamp triggers
- ✅ Security policies
- ✅ TypeScript type generation

### Customizing Schema:

1. **Create new migration:**
   ```bash
   supabase migration new add_my_table
   ```

2. **Edit SQL file:**
   ```bash
   # Edit: supabase/migrations/[timestamp]_add_my_table.sql
   ```

3. **Apply locally:**
   ```bash
   pnpm db:reset
   ```

4. **Generate types:**
   ```bash
   pnpm db:types
   ```

5. **Push to production:**
   ```bash
   pnpm db:push
   ```

See [TEMPLATE.md](TEMPLATE.md#database-setup) for detailed database setup instructions.

### Switch to Yarn/npm

This starter uses pnpm by default. To switch to Yarn/npm:
1. Delete `pnpm-lock.yaml`
2. Delete `node_modules/`
3. Install with your preferred package manager
4. Update scripts in `package.json` if needed
5. Update Husky hooks in `.husky/`

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for more information.

## Feedback and issues

Please file feedback and issues [here](https://github.com/michaeltroya/supa-next-starter/issues).
