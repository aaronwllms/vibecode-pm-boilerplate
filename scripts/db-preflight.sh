#!/bin/bash

# =====================================================================================
# Supabase Preflight Check Script
# =====================================================================================
# This script verifies your current Supabase project linkage before performing
# database operations to prevent accidental changes to the wrong environment.
#
# Usage:
#   ./scripts/db-preflight.sh           # Info only (shows status)
#   ./scripts/db-preflight.sh --confirm # Requires user confirmation to proceed
#
# Exit Codes:
#   0 - Success (safe to proceed)
#   1 - Error or user cancelled
# =====================================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
REQUIRE_CONFIRM=false
if [[ "$1" == "--confirm" ]]; then
    REQUIRE_CONFIRM=true
fi

# Verify we're in project root
if [[ ! -f "package.json" ]] || [[ ! -d "supabase" ]]; then
    echo -e "${RED}❌ Must be run from project root${NC}"
    echo "   Navigate to your project directory first"
    exit 1
fi

echo -e "${BLUE}🔍 Supabase Preflight Check${NC}"
echo "=============================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI not found${NC}"
    echo "   Install with: npm install -g supabase"
    exit 1
fi

# Get Supabase status
echo "Checking Supabase status..."
STATUS_OUTPUT=$(supabase status 2>&1 || true)

# Check if local Supabase is running
if echo "$STATUS_OUTPUT" | grep -q "No local Supabase containers running"; then
    echo -e "${YELLOW}📦 Local Supabase not running${NC}"
    echo ""
    echo "   To work locally:"
    echo "   1. Start local Supabase: ${GREEN}pnpm supabase:start${NC}"
    echo "   2. Apply migrations: ${GREEN}pnpm db:reset${NC}"
    echo ""
    echo "   Or link to remote project:"
    echo "   1. Link project: ${GREEN}supabase link --project-ref YOUR_REF${NC}"
    echo "   2. Push migrations: ${GREEN}pnpm db:push${NC}"
    echo ""
    
    if [[ "$REQUIRE_CONFIRM" == true ]]; then
        exit 1
    fi
    exit 0
fi

# Extract project ref
PROJECT_REF=$(echo "$STATUS_OUTPUT" | grep -i "project ref" | awk '{print $3}' || echo "")

# Check if linked to remote project
if [[ -z "$PROJECT_REF" ]] || [[ "$PROJECT_REF" == "<none>" ]] || [[ "$PROJECT_REF" == "Not" ]]; then
    echo -e "${GREEN}✅ LOCAL ONLY MODE${NC}"
    echo "=============================="
    echo ""
    echo "   Status: Not linked to remote project"
    echo "   Database: Local Supabase instance"
    echo ""
    echo "   ${GREEN}Safe commands (local only):${NC}"
    echo "   • pnpm db:reset        - Reset local database"
    echo "   • pnpm db:seed         - Seed local database"
    echo "   • pnpm db:types        - Generate TypeScript types"
    echo "   • pnpm supabase:stop   - Stop local Supabase"
    echo ""
    echo "   ${BLUE}To link to remote project:${NC}"
    echo "   • supabase link --project-ref YOUR_REF"
    echo ""
    
    if [[ "$REQUIRE_CONFIRM" == true ]]; then
        echo -e "${GREEN}✓ Safe to proceed with local operations${NC}"
    fi
    exit 0
else
    echo -e "${YELLOW}⚠️  REMOTE LINKED MODE${NC}"
    echo "=============================="
    echo ""
    echo "   Status: Linked to remote project"
    echo "   Project Ref: ${YELLOW}${PROJECT_REF}${NC}"
    echo ""
    
    # Try to get project name from local config
    if [[ -f "supabase/config.toml" ]]; then
        PROJECT_NAME=$(grep -A 5 'project_id' supabase/config.toml 2>/dev/null | grep 'name' | cut -d'"' -f2 || echo "")
        if [[ -n "$PROJECT_NAME" ]]; then
            echo "   Project Name: ${YELLOW}${PROJECT_NAME}${NC}"
            echo ""
        fi
    fi
    
    # Show recent migrations
    MIGRATION_COUNT=$(ls -1 supabase/migrations/*.sql 2>/dev/null | wc -l || echo "0")
    echo "   Local Migrations: ${MIGRATION_COUNT} files"
    
    if [[ $MIGRATION_COUNT -gt 0 ]]; then
        echo "   Last 3 migrations:"
        ls -1t supabase/migrations/*.sql 2>/dev/null | head -3 | while read migration; do
            basename "$migration" | sed 's/^/     - /'
        done
    fi
    
    # Check for pending migrations (migrations not yet applied to remote)
    PENDING_CHECK=$(supabase migration list 2>&1 || true)
    if echo "$PENDING_CHECK" | grep -q "pending"; then
        echo ""
        echo -e "   ${YELLOW}⚠️  Pending migrations detected${NC}"
        echo "   Some migrations have not been pushed to remote"
        echo "   Run 'supabase migration list' for details"
    fi
    echo ""
    
    echo -e "${GREEN}   Safe commands (local only):${NC}"
    echo "   • pnpm db:reset        - Reset LOCAL database only"
    echo "   • pnpm db:types        - Generate types from current DB"
    echo ""
    echo -e "${RED}   Dangerous commands (affects REMOTE):${NC}"
    echo "   • pnpm db:push         - Pushes migrations to ${YELLOW}${PROJECT_REF}${NC}"
    echo "   • supabase db push     - Same as above"
    echo "   • supabase link        - Changes target project"
    echo ""
    
    if [[ "$REQUIRE_CONFIRM" == true ]]; then
        echo -e "${YELLOW}⚠️  You are about to perform an operation that may affect the remote project!${NC}"
        echo ""
        read -p "   Continue with remote operation? (y/n) " -n 1 -r
        echo ""
        
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${RED}✗ Operation cancelled${NC}"
            exit 1
        fi
        
        echo -e "${GREEN}✓ Confirmed - proceeding with operation${NC}"
    else
        echo -e "${YELLOW}💡 Tip: Use --confirm flag to require confirmation for remote operations${NC}"
    fi
    
    exit 0
fi

