# Quick Start for PMs

A guide for Product Managers working with AI development tools to build production-ready applications.

## Table of Contents

1. [The Problems](#the-problems)
2. [The Solution: Guardrails](#the-solution-guardrails)
3. [Getting Started with Cursor](#getting-started-with-cursor)
4. [Cursor Rules](#cursor-rules)
5. [Quick Reference](#quick-reference)

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

### 4. Cursor Rules and Prompts (AI Guidance)

**What it does:** Provides context-aware instructions to AI about how to write code for this specific project.

**Why it matters:** Ensures AI follows your project's patterns, conventions, and best practices automatically.

**How it helps PMs:** The AI "knows" your project's standards without you having to explain them every time.

### 5. Vercel (Deployment Platform)

**What it does:** Provides hosting, automatic deployments, and preview environments.

**Why it matters:** Every commit can be previewed before merging. Production deployments are automatic and safe.

**How it helps PMs:** See changes in a real environment before they go live. Share preview URLs with stakeholders.

### 6. Supabase (Backend as a Service)

**What it does:** Provides database, authentication, and API infrastructure out of the box.

**Why it matters:** No need to build backend infrastructure from scratch. Security, scaling, and data management are handled.

**How it helps PMs:** Focus on product features, not infrastructure. Database changes are versioned through migrations.

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

### Modes

Cursor has three modes you can toggle between:

- **Agent Mode (Default):** AI can make changes directly to your codebase
- **Ask Mode:** AI answers questions without making changes
- **Plan Mode:** AI creates a structured plan before implementing

**How to toggle:** Press Shift + Tab in the chat window to cycle through modes

---

## Cursor Rules

### What Are Cursor Rules?

Cursor rules are instructions stored in `.cursor/rules/*.mdc` files that guide AI behavior. They're automatically applied based on what files you're editing.

### How Rules Work

1. **Context-Aware:** Rules activate based on file patterns (e.g., TypeScript files get TypeScript rules)
2. **Modular:** Each rule file covers one concern (security, styling, testing, etc.)
3. **Always Applied:** Some rules (like `pm-collaboration.mdc`) apply to all conversations
4. **Project-Specific:** Rules encode this project's patterns, not generic advice

### Key Rule Files in This Project

| Rule File              | What It Covers                      | When It Applies        |
| ---------------------- | ----------------------------------- | ---------------------- |
| `pm-collaboration.mdc` | How AI should communicate with you  | Always                 |
| `typescript.mdc`       | TypeScript patterns and conventions | All `.ts`/`.tsx` files |
| `nextjs.mdc`           | Next.js App Router patterns         | App Router files       |
| `supabase.mdc`         | Supabase integration patterns       | All source files       |
| `security.mdc`         | Security best practices             | API routes, auth flows |
| `testing.mdc`          | Testing patterns and conventions    | Test files             |
| `ui-shadcn.mdc`        | UI component patterns               | Component files        |
| `error-handling.mdc`   | Error handling standards            | All source files       |

**Why this matters:** These rules ensure AI generates code that follows your project's standards automatically. You don't need to remember or explain these patterns—the rules handle it.

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
pnpm db:types     # Generate TypeScript types
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

- TypeScript, ESLint, Prettier, Cursor rules, Vercel, and Supabase work together as guardrails
- These tools catch issues automatically, so you can focus on product requirements

**What You Need to Know:**

1. **Download Cursor** and open this project
2. **Trust the guardrails:** The tools are set up to ensure quality automatically
3. **Focus on product:** Describe what you want built, not how to build it
4. **Use the tools:** Run quality checks (`pnpm type-check`, `pnpm lint`) to verify code quality

**Remember:** You're the product expert. AI is the coding expert. The guardrails ensure quality. Together, you build great products.

---

_Last updated: 2025-01-27_
