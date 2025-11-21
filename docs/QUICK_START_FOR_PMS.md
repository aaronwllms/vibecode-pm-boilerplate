# Quick Start for PMs

A guide for Product Managers working with AI development tools to build production-ready applications.

## Table of Contents

1. [The Problems](#the-problems)
2. [The Solution: Guardrails](#the-solution-guardrails)
3. [Getting Started with Cursor](#getting-started-with-cursor)
4. [How to Use Cursor Rules Effectively](#how-to-use-cursor-rules-effectively)
5. [What to Tell AI When Starting a Feature](#what-to-tell-ai-when-starting-a-feature)
6. [How to Validate AI-Generated Code](#how-to-validate-ai-generated-code)
7. [Common Patterns and When to Use Them](#common-patterns-and-when-to-use-them)
8. [Best Practices for Building with AI](#best-practices-for-building-with-ai)

---

## The Problems

### Problem 1: PMs Aren't Developers

As a Product Manager, you understand product concepts, user needs, and business requirements—but you may not read code fluently. This creates a challenge when you need to:

- Build features quickly without a full development team
- Validate that code matches your product vision
- Ensure quality and maintainability without deep technical expertise
- Iterate on features based on user feedback

Traditional development requires years of experience to write production-quality code. You need a way to bridge this gap.

### Problem 2: AI Agents Can Be a Wild Horse

AI coding assistants are powerful but unpredictable. Without proper constraints, they can:

- Generate code that doesn't follow your project's patterns
- Introduce security vulnerabilities
- Create inconsistent styling and architecture
- Skip important error handling or testing
- Use outdated patterns or anti-patterns
- Produce code that works but is hard to maintain

Left unchecked, AI-generated code can create technical debt faster than it solves problems.

---

## The Solution: Guardrails

This project uses a **layered defense system** of guardrails that work together to ensure AI generates production-ready, maintainable code:

### 1. TypeScript (Type Safety)

**What it does:** Catches errors before code runs by checking that data types match expectations.

**Why it matters:** Prevents entire classes of bugs (wrong data types, missing properties, null/undefined errors) that would otherwise require manual testing or cause runtime failures.

**How it helps PMs:** You don't need to understand TypeScript deeply—just know that if the project builds (`pnpm type-check` passes), the code is type-safe.

### 2. ESLint (Code Quality)

**What it does:** Enforces coding standards and catches common mistakes automatically.

**Why it matters:** Ensures consistency across the codebase and prevents bugs from patterns like unused variables, missing dependencies, or incorrect API usage.

**How it helps PMs:** Run `pnpm lint` before committing. If it passes, the code follows project standards.

### 3. Prettier (Code Formatting)

**What it does:** Automatically formats code to a consistent style.

**Why it matters:** Eliminates style debates and makes code reviews focus on logic, not formatting.

**How it helps PMs:** Run `pnpm format` to auto-fix formatting. No manual formatting needed.

### 4. Vercel (Deployment Platform)

**What it does:** Provides hosting, automatic deployments, and preview environments.

**Why it matters:** Every commit can be previewed before merging. Production deployments are automatic and safe.

**How it helps PMs:** See changes in a real environment before they go live. Share preview URLs with stakeholders.

### 5. Supabase (Backend as a Service)

**What it does:** Provides database, authentication, and API infrastructure out of the box.

**Why it matters:** No need to build backend infrastructure from scratch. Security, scaling, and data management are handled.

**How it helps PMs:** Focus on product features, not infrastructure. Database changes are versioned through migrations.

### 6. Cursor Rules and Prompts (AI Guidance)

**What it does:** Provides context-aware instructions to AI about how to write code for this specific project.

**Why it matters:** Ensures AI follows your project's patterns, conventions, and best practices automatically.

**How it helps PMs:** The AI "knows" your project's standards without you having to explain them every time.

---

## Getting Started with Cursor

### Download Cursor

Cursor is the AI-powered code editor we use for this project. It's built on VS Code but enhanced with AI capabilities.

**Download:** [https://cursor.com/download](https://cursor.com/download)

Available for:
- **macOS** (ARM64, x64, Universal)
- **Windows** (x64, ARM64 - System or User install)
- **Linux** (.deb, RPM, AppImage)

### First Steps

1. **Install Cursor** from the link above
2. **Open this project** in Cursor (File → Open Folder)
3. **Verify setup:**
   ```bash
   pnpm install
   pnpm type-check
   pnpm lint
   ```
4. **Start the dev server:**
   ```bash
   pnpm dev
   ```

### Understanding Cursor's AI Features

- **Chat (Cmd/Ctrl + L):** Ask questions about code or request changes
- **Composer (Cmd/Ctrl + I):** Multi-file editing for larger features
- **Inline Edit (Cmd/Ctrl + K):** Quick edits in the current file
- **Rules:** Automatically applied based on file patterns (see next section)

---

## How to Use Cursor Rules Effectively

### What Are Cursor Rules?

Cursor rules are instructions stored in `.cursor/rules/*.mdc` files that guide AI behavior. They're automatically applied based on what files you're editing.

### How Rules Work

1. **Context-Aware:** Rules activate based on file patterns (e.g., TypeScript files get TypeScript rules)
2. **Modular:** Each rule file covers one concern (security, styling, testing, etc.)
3. **Always Applied:** Some rules (like `pm-collaboration.mdc`) apply to all conversations
4. **Project-Specific:** Rules encode this project's patterns, not generic advice

### Key Rule Files in This Project

| Rule File | What It Covers | When It Applies |
|-----------|---------------|-----------------|
| `pm-collaboration.mdc` | How AI should communicate with you | Always |
| `typescript.mdc` | TypeScript patterns and conventions | All `.ts`/`.tsx` files |
| `nextjs.mdc` | Next.js App Router patterns | App Router files |
| `supabase.mdc` | Supabase integration patterns | All source files |
| `security.mdc` | Security best practices | API routes, auth flows |
| `testing.mdc` | Testing patterns and conventions | Test files |
| `ui-shadcn.mdc` | UI component patterns | Component files |
| `error-handling.mdc` | Error handling standards | All source files |

### Tips for Working with Rules

✅ **Do:**
- Trust that rules are working—you don't need to mention them in every prompt
- Update rules when project patterns change (they're version-controlled)
- Reference specific rules if AI isn't following them: "Follow the security.mdc rules"

❌ **Don't:**
- Repeat rule content in your prompts (rules already cover it)
- Worry about which rules apply (Cursor handles this automatically)
- Edit rules unless you understand the impact (ask a developer first)

### When to Update Rules

Update rules when:
- Project patterns change (new library, new architecture)
- You discover AI consistently making the same mistake
- Team agrees on a new convention

Don't update rules for:
- One-off exceptions (handle in the prompt instead)
- Temporary changes (use prompts, not rules)
- Personal preferences (discuss with team first)

---

## What to Tell AI When Starting a Feature

### The Formula: Context + Requirements + Constraints

Effective prompts combine three elements:

1. **Context:** What exists and what you're building on
2. **Requirements:** What the feature should do (user story format works well)
3. **Constraints:** Any limitations or preferences

### Good Prompt Structure

```
I need to build [feature name].

Context:
- [What exists today]
- [Related features/components]

Requirements:
- As a [user type], I want [goal] so that [benefit]
- [Acceptance criteria 1]
- [Acceptance criteria 2]

Constraints:
- [Technical constraint]
- [Design constraint]
- [Timeline constraint]
```

### Example: Building a User Profile Page

**Good Prompt:**
```
I need to build a user profile page.

Context:
- Users can already log in (auth is working)
- We have a user table in Supabase with name, email, avatar_url
- The app uses shadcn/ui components

Requirements:
- As a logged-in user, I want to view and edit my profile so that I can keep my information up to date
- Display current user info (name, email, avatar)
- Allow editing name and avatar
- Show success message after saving
- Validate email format

Constraints:
- Use existing shadcn/ui components (no custom styling)
- Follow the project's error handling patterns
- Include unit tests for the component
```

**Why This Works:**
- ✅ Provides context (what exists)
- ✅ Clear requirements (user story + AC)
- ✅ Specific constraints (use existing patterns)
- ✅ Mentions testing (important for quality)

### What NOT to Say

❌ **Too Vague:**
```
Build a profile page
```
(No context, no requirements, no constraints)

❌ **Too Technical:**
```
Create a React component using useState hooks that fetches from /api/user endpoint and renders a form with validation using Zod schemas...
```
(You're dictating implementation instead of requirements)

❌ **Missing Context:**
```
Add a button that saves user data
```
(What data? Where? What happens after saving?)

### Prompt Patterns by Feature Type

#### New Page/Route
```
I need a new [page name] page at /[route].

User Story: [story]
Requirements: [list]
Design: [reference existing page or describe]
```

#### New Component
```
I need a [component name] component.

Purpose: [what it does]
Props: [what data it receives]
Behavior: [how it should work]
Where used: [where it will be used]
```

#### API Endpoint
```
I need an API endpoint for [action].

Endpoint: /api/[path]
Method: [GET/POST/etc]
Input: [what data it receives]
Output: [what it returns]
Auth: [who can access it]
```

#### Database Change
```
I need to [add/modify] the database schema for [purpose].

Changes: [what needs to change]
Migration: [create new migration]
Types: [regenerate TypeScript types]
```

---

## How to Validate AI-Generated Code

### Validation Checklist

Before accepting AI-generated code, verify these items:

#### 1. Type Safety ✅
```bash
pnpm type-check
```
**What it checks:** TypeScript compilation errors  
**If it fails:** AI may have used wrong types or missed required properties  
**Fix:** Ask AI to fix type errors

#### 2. Code Quality ✅
```bash
pnpm lint
```
**What it checks:** ESLint rules violations  
**If it fails:** Code may not follow project standards  
**Fix:** Run `pnpm lint --fix` or ask AI to fix issues

#### 3. Formatting ✅
```bash
pnpm format-check
```
**What it checks:** Code formatting consistency  
**If it fails:** Run `pnpm format` to auto-fix

#### 4. Tests Pass ✅
```bash
pnpm test
```
**What it checks:** All tests (unit + integration)  
**If it fails:** Review test failures, ask AI to fix

#### 5. Builds Successfully ✅
```bash
pnpm build
```
**What it checks:** Production build works  
**If it fails:** May indicate runtime issues not caught by type checking

#### 6. Manual Testing ✅
- **Happy path:** Does the feature work as expected?
- **Error cases:** What happens with invalid input?
- **Edge cases:** Empty states, loading states, etc.
- **Responsive:** Does it work on mobile/tablet/desktop?

### Red Flags to Watch For

🚩 **Security Issues:**
- API endpoints without authentication checks
- User input not validated
- Sensitive data in logs or error messages
- SQL injection risks (if using raw queries)

🚩 **Performance Issues:**
- Loading all data instead of pagination
- No loading states for async operations
- Missing error boundaries
- Large bundle sizes

🚩 **Maintainability Issues:**
- Code duplicated instead of reused
- Magic numbers/strings (should be constants)
- No comments for complex logic
- Files over 150 lines (should be split)

🚩 **Testing Issues:**
- No tests for new logic
- Tests that don't actually test behavior
- Skipped tests without explanation

### When to Ask for Help

Ask a developer to review if:
- Type checking passes but behavior seems wrong
- You're unsure about security implications
- Performance seems slow
- Code structure feels complex
- Tests are failing and you can't figure out why

### Validation Workflow

**Recommended workflow for each feature:**

1. **AI generates code** → Review the changes
2. **Run quality checks:**
   ```bash
   pnpm type-check && pnpm lint && pnpm format-check
   ```
3. **Run tests:**
   ```bash
   pnpm test
   ```
4. **Manual test in browser:**
   ```bash
   pnpm dev
   ```
5. **If all pass:** Commit and create PR
6. **If anything fails:** Ask AI to fix, repeat from step 2

---

## Common Patterns and When to Use Them

### Pattern 1: Server vs Client Components

**When to use Server Components (default):**
- Displaying data from database
- Static content
- No user interactions
- SEO-critical content

**When to use Client Components (`'use client'`):**
- User interactions (clicks, form inputs)
- Browser APIs (localStorage, window)
- State management (useState, useEffect)
- Third-party libraries that need browser

**Example Decision Tree:**
```
Does it need user interaction? → Yes → Client Component
Does it need browser APIs? → Yes → Client Component
Is it just displaying data? → Yes → Server Component
```

### Pattern 2: Data Fetching

**Server Components (recommended):**
- Fetch directly in component
- No loading states needed (handled by Suspense)
- Automatic caching

**Client Components:**
- Use TanStack Query hooks
- Handle loading/error states
- For real-time or frequently changing data

**When to use each:**
- **Server:** Initial page load, SEO content, static data
- **Client:** User-triggered actions, real-time updates, pagination

### Pattern 3: Forms

**Always use:**
- Client Component (user interaction)
- Form validation (Zod schemas)
- Error handling (show user-friendly messages)
- Loading states (disable during submission)

**Pattern:**
1. Define Zod schema for validation
2. Use React Hook Form (if complex) or controlled inputs
3. Validate on submit
4. Show errors inline
5. Handle success/error states

### Pattern 4: API Routes

**Structure:**
- Validate input with Zod
- Check authentication
- Handle errors gracefully
- Return consistent response format

**Security checklist:**
- ✅ Input validation
- ✅ Auth check
- ✅ Rate limiting (if needed)
- ✅ Error messages don't leak info

### Pattern 5: Error Handling

**Three levels:**
1. **User-facing:** Clear, actionable messages
2. **Developer:** Detailed logs (not shown to users)
3. **UI:** Error boundaries for React errors

**Pattern:**
- Try/catch for async operations
- Error boundaries for component errors
- Consistent error response format from APIs

### Pattern 6: Testing

**Unit tests (`.unit.test.tsx`):**
- Pure functions
- Component logic (no external dependencies)
- Utilities and helpers

**Integration tests (`.integration.test.tsx`):**
- API routes
- Components with external dependencies
- Auth flows
- Database operations

**Test coverage:**
- Happy path (works as expected)
- Invalid input (error handling)
- Boundary cases (empty states, edge values)

---

## Best Practices for Building with AI

### 1. Start with Requirements, Not Implementation

**❌ Bad:**
```
Use useState and create a form with email and password fields that validates on submit
```

**✅ Good:**
```
I need a login form. Users enter email and password. Validate that email is a valid format and password is at least 8 characters. Show errors if validation fails.
```

**Why:** AI can choose the best implementation. You focus on what, not how.

### 2. Iterate in Small Steps

**❌ Bad:**
```
Build the entire user dashboard with profile, settings, notifications, and analytics
```

**✅ Good:**
```
First, build the profile section of the dashboard. Once that's working, we'll add settings.
```

**Why:** Easier to validate, debug, and adjust. AI works better with focused tasks.

### 3. Reference Existing Patterns

**✅ Good:**
```
Build a settings page similar to the profile page we just created, but for app preferences instead of user info.
```

**Why:** AI will follow existing patterns, keeping code consistent.

### 4. Specify Edge Cases

**✅ Good:**
```
Build a user list. Handle empty state (no users), loading state, and error state. Show 10 users per page with pagination.
```

**Why:** AI will handle these cases proactively instead of you finding them later.

### 5. Ask for Tests

**✅ Good:**
```
Build the login form and include unit tests covering valid login, invalid email, short password, and network errors.
```

**Why:** Tests catch bugs early and document expected behavior.

### 6. Validate After Each Step

**Workflow:**
1. AI generates code
2. Run quality checks (`pnpm type-check && pnpm lint`)
3. Test manually
4. If issues, ask AI to fix before moving on

**Why:** Fixing issues early is faster than debugging later.

### 7. Use Cursor's Planning Feature for Big Features

**For large features:**
1. Use Cursor's planning feature (Cmd/Ctrl + Shift + P → "Create Plan")
2. Break into milestones
3. Check in at each milestone
4. Adjust plan as needed

**Why:** Keeps big features organized and trackable.

### 8. Communicate Your Role

**At the start of conversations:**
```
I'm a PM, not a developer. Explain technical decisions in product terms. Focus on what we're building and why, not implementation details unless I ask.
```

**Why:** AI will adjust communication style (this is already in `pm-collaboration.mdc` rule).

### 9. Ask "Why" When Unsure

**If AI suggests something you don't understand:**
```
Why did you choose this approach? What are the trade-offs?
```

**Why:** Helps you learn and make informed decisions.

### 10. Review Before Committing

**Before committing code:**
- ✅ Quality checks pass
- ✅ Tests pass
- ✅ Manual testing done
- ✅ Code review (if team has process)

**Why:** Prevents bad code from entering the codebase.

---

## Quick Reference

### Essential Commands

```bash
# Quality checks
pnpm type-check    # TypeScript validation
pnpm lint         # Code quality
pnpm format       # Auto-format code
pnpm test         # Run all tests

# Development
pnpm dev          # Start dev server
pnpm build        # Production build

# Database
pnpm db:types        # Generate TypeScript types
```

### Validation Workflow

```bash
# Before committing
pnpm type-check && pnpm lint && pnpm format-check && pnpm test
```

### Getting Help

- **Project docs:** See [docs/README.md](./README.md)
- **Cursor rules:** See [.cursor/rules/README.md](../.cursor/rules/README.md)
- **Project overview:** See [AGENTS.md](../AGENTS.md)

---

## Summary

**The Problems:**
- PMs need to build features without deep coding knowledge
- AI can generate inconsistent or unsafe code without guardrails

**The Solution:**
- TypeScript, ESLint, Prettier, Vercel, Supabase, and Cursor rules work together as guardrails
- These tools catch issues automatically, so you can focus on product requirements

**The Process:**
1. **Download Cursor** and open this project
2. **Use effective prompts:** Context + Requirements + Constraints
3. **Validate code:** Run quality checks and tests
4. **Iterate:** Small steps, validate often, reference existing patterns
5. **Trust the guardrails:** If checks pass, code is likely good

**Remember:** You're the product expert. AI is the coding expert. Together, you build great products.

---

*Last updated: 2025-01-27*

