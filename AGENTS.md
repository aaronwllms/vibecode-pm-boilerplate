# AGENTS.md

## Project Overview

SupaNext Starter Kit - A production-ready Next.js 14 (App Router) + Supabase starter template with TypeScript, Tailwind CSS, shadcn/ui, testing setup, and developer tooling.

## Setup Commands

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev` (runs on http://localhost:3000)
- Build for production: `pnpm build`
- Start production server: `pnpm start`
- Run all tests: `pnpm test`
- Run tests in CI mode: `pnpm test:ci`

## Environment Setup

Before running the project, you need to set up Supabase credentials:

1. Create a `.env.local` file in the root directory (if not exists)
2. Add the following required environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```
3. These values can be found in your Supabase project's API settings at https://app.supabase.com/project/_/settings/api

## Requirements

- Node.js >= 18.17.0
- pnpm 8 or higher (this project uses pnpm as the package manager)

## Project Structure

- `/src/app/` - Next.js 14 App Router pages and API routes
  - `/api/` - API routes including auth callbacks and message endpoints
  - `/login/` - Authentication page
  - `/test-examples/` - Example test files and components
- `/src/components/` - React components including auth, UI components, and examples
  - `/ui/` - shadcn/ui components (Button, DropdownMenu, etc.)
- `/src/hooks/` - Custom React hooks
- `/src/providers/` - React context providers (React Query, Theme)
- `/src/utils/` - Utility functions (Supabase client, Tailwind utilities)
- `/src/middleware.ts` - Next.js middleware for auth/routing
- `/src/mocks/` - MSW mock handlers for testing
- `/src/test/` - Test utilities and setup

## Code Style & Conventions

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier is configured with tailwindcss plugin
- **Linting**: ESLint with Next.js config
- **Import Paths**: Use `@/` prefix for imports (e.g., `import { Button } from '@/components/ui/button'`)
- **Components**: Functional components with TypeScript types
- **Git Hooks**: Husky + lint-staged run on pre-commit

## Testing Guidelines

- **Test Framework**: Jest with SWC compiler + React Testing Library
- **Mock Service Worker (MSW)**: v2 configured for API mocking (testing only)
- **Test Files**: Co-locate test files with components using `.test.tsx` or `.test.ts` extension
- **Test Utilities**: Import from `@/test/test-utils` for custom render functions
- **Running Tests**:
  - All tests: `pnpm test`
  - CI mode: `pnpm test:ci`
  - Watch mode: `pnpm test -- --watch`
- **Example Tests**: See `/src/app/test-examples/` and `/src/components/ReactQueryExample.test.tsx`

## Quality Checks

Before committing or creating PRs, run:

1. Type checking: `pnpm type-check`
2. Linting: `pnpm lint`
3. Format check: `pnpm format-check` (or auto-format with `pnpm format`)
4. Tests: `pnpm test`

GitHub Actions will automatically run type checks, tests, and linters on Pull Requests.

## Key Technologies

- **Next.js 14**: App Router with Server Components
- **Supabase**: Using `@supabase/ssr` for full-stack authentication
- **React 18**: With Server/Client Components
- **TanStack Query v5**: For client-side data fetching
- **Tailwind CSS**: With shadcn/ui component system
- **MSW v2**: API mocking in tests
- **next-themes**: Dark/light mode theming

## Supabase Integration

- Supabase client utilities are in `/src/utils/supabase.ts`
- Auth callback route: `/src/app/api/auth/callback/route.ts`
- Auth works across the entire Next.js stack (App Router, Client, Server, Middleware)
- Use the appropriate Supabase client function based on context (server component, client component, middleware, route handler)

## Adding New Components

When adding new UI components:

1. If using shadcn/ui, check `components.json` for configuration
2. Place custom components in `/src/components/`
3. Place shadcn/ui components in `/src/components/ui/`
4. Use the `@/` import alias
5. Write tests alongside components with `.test.tsx` extension

## Bundle Analysis

To analyze the production bundle size:

```bash
pnpm analyze
```

This will build the project and open the bundle analyzer in your browser.

## Notes

- This project uses pnpm workspaces (see `pnpm-lock.yaml`)
- Geist font is pre-configured from Vercel
- Vercel Analytics is included for deployment on Vercel
- Next Top Loader provides a progress bar during page navigation
- Dark mode is handled by `next-themes` with the ThemeProvider

