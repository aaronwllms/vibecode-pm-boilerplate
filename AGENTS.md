# AGENTS.md

## Project Overview

pm-app - A production-ready Next.js 14 (App Router) + Supabase starter template with TypeScript, Tailwind CSS, shadcn/ui, testing setup, and developer tooling.

## Setup Commands

- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev` (runs on http://localhost:3000)
- Build for production: `pnpm build`
- Start production server: `pnpm start`
- Run all tests: `pnpm test`
- Run tests in CI mode: `pnpm test:ci`

## Environment Setup

This project uses **Supabase Cloud** for backend services.

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
- Supabase CLI (included via package scripts)

## Project Structure

- `/src/app/` - Next.js 14 App Router pages and API routes
  - `/api/` - API routes including auth callbacks
  - `/login/` - Authentication page
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
- **Test Files**: Co-locate test files with source files using naming conventions:
  - **Unit tests**: `.unit.test.tsx` or `.unit.test.ts` (isolated logic, no external dependencies)
  - **Integration tests**: `.integration.test.tsx` or `.integration.test.ts` (external dependencies, API calls, auth flows)
- **Test Utilities**: Import from `@/test/test-utils` for custom render functions
- **Running Tests**:
  - All tests: `pnpm test`
  - Unit tests only: `pnpm test:unit`
  - Integration tests only: `pnpm test:integration`
  - CI mode: `pnpm test:ci`
  - Watch mode (all): `pnpm test -- --watch`
  - Watch mode (unit): `pnpm test:unit:watch`
  - Watch mode (integration): `pnpm test:integration:watch`
- **Example Tests**: 
  - Unit: `/src/utils/logger.unit.test.ts`

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

- **Client utilities**: `/src/utils/supabase.ts`
- **Auth callback route**: `/src/app/api/auth/callback/route.ts`
- **Migrations**: `/supabase/migrations/`
- **Config**: `/supabase/config.toml`
- **Seed data**: `/supabase/seed.sql`
- Auth works across the entire Next.js stack (App Router, Client, Server, Middleware)
- Use the appropriate Supabase client function based on context (server component, client component, middleware, route handler)

### Database Commands

- `pnpm db:reset` - Reset database (reruns migrations + seeds)
- `pnpm db:push` - Push new migrations to Supabase project
- `pnpm db:types` - Generate TypeScript types from schema
- `pnpm db:seed` - Run seed file
- `pnpm db:status` - Show migration status

## Adding New Components

When adding new UI components:

1. If using shadcn/ui, check `components.json` for configuration
2. Place custom components in `/src/components/`
3. Place shadcn/ui components in `/src/components/ui/`
4. Use the `@/` import alias
5. Write tests alongside components:
   - Use `.unit.test.tsx` for isolated component tests
   - Use `.integration.test.tsx` for components with external dependencies

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

