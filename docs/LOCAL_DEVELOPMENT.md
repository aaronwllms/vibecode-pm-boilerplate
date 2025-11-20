# Local Development with Supabase + Docker

This guide will help you set up and run Supabase locally using Docker for development.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Docker Desktop** (includes Docker & Docker Compose)
   - macOS: [Download Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
   - Windows: [Download Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
   - Linux: Install Docker Engine and Docker Compose separately

2. **Node.js** >= 18.17.0

3. **pnpm** >= 8.0.0
   ```bash
   npm install -g pnpm
   ```

4. **Supabase CLI** (already installed if you see version output from `supabase --version`)

## Quick Start

### Step 1: Install Docker Desktop

If you don't have Docker installed:

1. **macOS Users:**
   - Download from https://www.docker.com/products/docker-desktop/
   - Open the `.dmg` file and drag Docker to Applications
   - Launch Docker Desktop from Applications
   - Wait for Docker to start (you'll see the Docker icon in your menu bar)

2. **Verify Docker is running:**
   ```bash
   docker --version
   docker-compose --version
   ```

### Step 2: Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. The file already contains the default local development values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   These are the standard Supabase local development credentials and work out of the box.

### Step 3: Start Supabase

Start the local Supabase stack (this will automatically download and start Docker containers):

```bash
pnpm supabase:start
```

This command will:
- Download required Docker images (first time only, ~1-2 minutes)
- Start all Supabase services (Postgres, Auth, Storage, etc.)
- Run database migrations from `supabase/migrations/`
- Output access URLs and credentials

**Expected output:**
```
Started supabase local development setup.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Start Your Next.js App

In a new terminal window:

```bash
pnpm dev
```

Your app is now running with a local Supabase backend! 🎉

- **App**: http://localhost:3000
- **Supabase Studio**: http://127.0.0.1:54323 (Database GUI)
- **Inbucket**: http://127.0.0.1:54324 (Email testing)

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm supabase:start` | Start local Supabase (Docker containers) |
| `pnpm supabase:stop` | Stop local Supabase services |
| `pnpm supabase:status` | Check status of running services |
| `pnpm db:reset` | Reset database (drops all data, reruns migrations + seeds) |
| `pnpm db:push` | Push new migration files to local database |
| `pnpm db:types` | Generate TypeScript types from your database schema |
| `pnpm db:seed` | Run seed file (`supabase/seed.sql`) |
| `pnpm db:status` | Show migration status |

## Working with the Database

### Accessing Supabase Studio

Open http://127.0.0.1:54323 in your browser to:
- Browse tables and data
- Run SQL queries
- View logs
- Manage storage buckets
- Test authentication

### Creating Database Migrations

1. Make changes to your database schema using Studio or SQL
2. Generate a migration file:
   ```bash
   supabase db diff -f your_migration_name
   ```
3. Review the generated file in `supabase/migrations/`
4. Apply it:
   ```bash
   pnpm db:push
   ```

### Seeding Test Data

Edit `supabase/seed.sql` with your test data:

```sql
INSERT INTO public.profiles (id, email, full_name)
VALUES 
  ('uuid-here', 'test@example.com', 'Test User')
ON CONFLICT (id) DO NOTHING;
```

Run seeds:
```bash
pnpm db:seed
```

## Testing Email Flows

Supabase local includes **Inbucket** for testing emails:

1. Trigger an email in your app (e.g., signup, password reset)
2. Open http://127.0.0.1:54324
3. View the email that would have been sent

No emails are actually sent — they're all captured locally.

## Troubleshooting

### Docker not starting

**Error:** `Cannot connect to the Docker daemon`

**Solution:**
- Ensure Docker Desktop is running
- On macOS, check the menu bar for the Docker icon
- Try restarting Docker Desktop

### Port already in use

**Error:** `port is already allocated`

**Solution:**
```bash
# Stop Supabase
pnpm supabase:stop

# Check what's using the port (example for 54321)
lsof -i :54321

# Kill the process or stop Supabase and start again
pnpm supabase:start
```

### Migrations not applying

**Error:** Migration files not running

**Solution:**
```bash
# Reset the database (⚠️ deletes all local data)
pnpm db:reset
```

### Clean slate restart

If you want to start completely fresh:

```bash
# Stop all services
pnpm supabase:stop

# Remove all Docker volumes (⚠️ deletes ALL local data)
supabase stop --no-backup

# Start again
pnpm supabase:start
```

## Switching Between Local & Cloud

### Using Local Supabase

In `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Using Cloud Supabase

In `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
```

Get cloud credentials from: https://app.supabase.com/project/_/settings/api

## Best Practices

1. **Always commit migrations:** Migration files in `supabase/migrations/` should be version controlled
2. **Never commit `.env.local`:** Keep secrets out of git (already in `.gitignore`)
3. **Use seed files for test data:** Makes it easy to reset to a known state
4. **Run `db:reset` when pulling changes:** Ensures your local DB matches the latest migrations
5. **Generate TypeScript types:** Run `pnpm db:types` after schema changes

## Architecture

When you run `pnpm supabase:start`, Docker Compose starts these services:

- **Postgres Database** (port 54322)
- **PostgREST API** (port 54321) - Auto-generated REST API
- **GoTrue Auth** (port 54321/auth) - Authentication service
- **Realtime** - WebSocket subscriptions
- **Storage** - File storage service
- **Inbucket** (port 54324) - Email testing
- **Studio** (port 54323) - Database GUI
- **Edge Functions runtime** (Deno)

All services are configured in `supabase/config.toml`.

## Next Steps

- Explore [Supabase Studio](http://127.0.0.1:54323) to familiarize yourself with your database
- Read the [Supabase CLI docs](https://supabase.com/docs/guides/cli) for advanced usage
- Check out `/supabase/migrations/20251120000000_initial_schema.sql` to see example schema patterns
- Add test data in `supabase/seed.sql`

---

**Need help?** Check the [Supabase Discord](https://discord.supabase.com/) or [GitHub Discussions](https://github.com/supabase/supabase/discussions).

