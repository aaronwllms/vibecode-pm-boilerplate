# Quick Reference - Local Supabase Development

## First Time Setup

### 1. Install Docker Desktop
```bash
# macOS: Download from https://www.docker.com/products/docker-desktop/
# Or with Homebrew:
brew install --cask docker

# Verify installation:
docker --version
```

**Full guide:** [docs/DOCKER_SETUP.md](./DOCKER_SETUP.md)

### 2. Start Supabase
```bash
pnpm supabase:start
```

First run takes ~2 minutes (downloads Docker images).

### 3. Configure Environment
```bash
# Copy the local credentials to .env.local
echo 'NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' > .env.local
```

### 4. Start Development
```bash
pnpm dev
```

**Full guide:** [docs/LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)

---

## Daily Commands

### Start/Stop Services
```bash
# Start all Supabase services
pnpm supabase:start

# Stop all services
pnpm supabase:stop

# Check status
pnpm supabase:status

# Start Next.js dev server
pnpm dev
```

### Database Operations
```bash
# Reset database (fresh start)
pnpm db:reset

# Generate TypeScript types
pnpm db:types

# Push new migrations
pnpm db:push

# Run seed data
pnpm db:seed
```

---

## Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Next.js App** | http://localhost:3000 | Your application |
| **Supabase Studio** | http://127.0.0.1:54323 | Database GUI |
| **API** | http://127.0.0.1:54321 | REST API |
| **Inbucket** | http://127.0.0.1:54324 | Email testing |

---

## Troubleshooting

### Docker not running
```bash
# Check Docker is running (macOS: Docker icon in menu bar)
docker ps

# If not running, open Docker Desktop app
```

### Port conflicts
```bash
# Stop Supabase
pnpm supabase:stop

# Find what's using a port (example: 54321)
lsof -i :54321

# Start again
pnpm supabase:start
```

### Database issues
```bash
# Full reset (⚠️ deletes all local data)
supabase stop --no-backup
pnpm supabase:start
```

---

## File Locations

- **Migrations**: `supabase/migrations/*.sql`
- **Config**: `supabase/config.toml`
- **Seed Data**: `supabase/seed.sql`
- **Environment**: `.env.local`
- **Types**: `src/types/database.types.ts` (generated)

---

## Workflow Examples

### Creating a New Table
```bash
# 1. Make changes in Supabase Studio (http://127.0.0.1:54323)

# 2. Generate migration
supabase db diff -f add_my_table

# 3. Review the migration file in supabase/migrations/

# 4. Apply it
pnpm db:push

# 5. Generate TypeScript types
pnpm db:types
```

### Testing Email Flows
```bash
# 1. Trigger email in your app (signup, reset password, etc.)

# 2. Check Inbucket: http://127.0.0.1:54324

# 3. View the email that would have been sent
```

### Switching Between Local & Cloud
Edit `.env.local`:

**Local:**
```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Cloud:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
```

---

## Default Credentials (Local)

These work automatically with local Supabase:

- **API URL**: `http://127.0.0.1:54321`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0`
- **Database**: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

---

## Need Help?

- **Docker Setup**: [docs/DOCKER_SETUP.md](./DOCKER_SETUP.md)
- **Local Development**: [docs/LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)
- **Project Guide**: [AGENTS.md](../AGENTS.md)
- **Supabase CLI Docs**: https://supabase.com/docs/guides/cli

