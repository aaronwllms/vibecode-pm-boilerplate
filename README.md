<h1 align="center">⚡ NextPM ⚡</h1>

<p align="center">
 Build with AI, Ship with Confidence
</p>

<p align="center">
  <em>A starter template designed for product managers who code with AI</em>
</p>

<div align="center">

<img alt="GitHub License" src="https://img.shields.io/github/license/aaronwllms/vibecode-pm-boilerplate">

</div>

<div align="center">
  <sub>NextPM created by <a href="https://github.com/aaronwllms">@aaronwllms</a> · Forked from <a href="https://github.com/michaeltroya/supa-next-starter">michaeltroya/supa-next-starter</a>
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
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/aaronwllms/vibecode-pm-boilerplate&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase%20credentials%20for%20your%20project&envLink=https://app.supabase.com/project/_/settings/api&project-name=nextpm-app&repository-name=nextpm-app">
    <img src="https://vercel.com/button" alt="Deploy with Vercel"/>
  </a>
</p>
<br/>

## Features

### AI-Powered Development
- 🤖 **Cursor Rules & AGENTS.md** - Pre-configured rules that guide AI to follow best practices, ensuring consistent, high-quality code generation
- 📚 **PM-Friendly Documentation** - Clear guides for non-developers, including [Quick Start for PMs](docs/QUICK_START_FOR_PMS.md) to help you build with confidence

### Built-in Guardrails
- ⛑ **TypeScript Strict Mode** - Catches errors before code runs. If `pnpm type-check` passes, your code is type-safe
- 📏 **ESLint** - Enforces coding standards automatically. Run `pnpm lint` before committing
- 💖 **Prettier** - Auto-formats code consistently. Run `pnpm format` to fix formatting
- 🧪 **Jest + React Testing Library** - Unit and integration tests with MSW v2 for API mocking

### Production-Ready Stack
- ⚡️ **Next.js 14 (App Router)** - Latest Next.js with Server Components
- 💚 **Supabase w/ supabase-ssr** - Works across the entire Next.js stack (App Router, Client, Server, Middleware)
- ⚛️ **React 18** - Latest React features
- 🪝 **TanStack Query v5** - The best way to fetch data on the client
- 🎨 **Tailwind CSS** - Utility-first styling
- 🔌 **shadcn/ui** - Beautifully designed components you can copy and paste

### Developer Experience
- 📦 **pnpm** - Fast, disk space efficient package manager
- 🐶 **Husky + lint-staged** - Run quality checks before committing
- 👷 **GitHub Actions** - Run Type Checks, Tests, and Linters on Pull Requests
- 🗂 **Path Mapping** - Import components using the `@` prefix
- ⚪⚫ **Dark mode** - Toggle theme modes with [next-themes](https://github.com/pacocoursey/next-themes)
- ✨ **Next Top Loader** - Progress bar during navigation
- 🔋 **Extras** - Bundle Analyzer, Vercel Analytics, Geist Font

## Quick Start

### Option 1: Automated Setup (Recommended)

1. **Use this template** (click "Use this template" button on GitHub) or clone:
   ```bash
   git clone https://github.com/aaronwllms/vibecode-pm-boilerplate.git my-project
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
   git clone https://github.com/aaronwllms/vibecode-pm-boilerplate.git my-project
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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aaronwllms/vibecode-pm-boilerplate&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY)

After deployment:
1. Create a [Supabase project](https://app.supabase.com)
2. Add environment variables in Vercel project settings
3. Redeploy


## Showcase

Projects built with NextPM:

- [Add yours](https://github.com/aaronwllms/vibecode-pm-boilerplate/edit/main/README.md)

# Documentation

> **For Product Managers**: Start with [Quick Start for PMs](docs/QUICK_START_FOR_PMS.md) to learn how to use Cursor effectively, validate AI-generated code, and build features with confidence.

> **For AI Coding Agents**: See [AGENTS.md](AGENTS.md) for detailed setup instructions, code conventions, testing guidelines, and project structure information.

> **Using as a Template**: See [TEMPLATE.md](TEMPLATE.md) for complete guide on customizing this starter for your project.

### Requirements

- Node.js >= 18.17.0
- pnpm 9.15.2 or higher

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
- `pnpm db:reset` — Reset database and apply all migrations
- `pnpm db:seed` — Seed database with test data

**Analysis:**
- `pnpm analyze` — Build and open bundle analyzer

### Paths

TypeScript is pre-configured with custom path mappings. To import components or files, use the `@` prefix.

```tsx
import { Button } from '@/components/ui/button'

// To import images or other files from the public folder
import avatar from '@/public/avatar.png'
```

## Deployment

### Vercel (Recommended)

This starter is optimized for [Vercel](https://vercel.com):

1. **One-Click Deploy:**
   
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aaronwllms/vibecode-pm-boilerplate)

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for more information.

## Feedback and issues

Please file feedback and issues [here](https://github.com/aaronwllms/vibecode-pm-boilerplate/issues).

## Credits

**NextPM** is created by [@aaronwllms](https://github.com/aaronwllms) and is a fork of [michaeltroya/supa-next-starter](https://github.com/michaeltroya/supa-next-starter) by [Michael Troya](https://twitter.com/michaeltroya_). 

NextPM extends the original starter with:
- Focus on AI-powered development for Product Managers
- Comprehensive Cursor rules and AI guidance
- PM-friendly documentation and quick start guides
- Enhanced guardrails and quality checks
- Clear mission: "Build with AI, Ship with Confidence"
