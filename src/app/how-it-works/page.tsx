import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Footer from '@/components/footer'
import {
  ShieldCheck,
  Code,
  Zap,
  Database,
  Rocket,
  FileText,
} from 'lucide-react'

const problems = [
  {
    title: "PMs Aren't Developers",
    description:
      'You understand product concepts and user needs, but may not read code fluently. You need to build features quickly without a full development team while ensuring quality.',
  },
  {
    title: 'AI Agents Can Be Unpredictable',
    description:
      "Without proper constraints, AI can generate code that doesn't follow patterns, introduce security vulnerabilities, skip error handling, or create technical debt.",
  },
]

const guardrails = [
  {
    icon: Code,
    title: 'TypeScript',
    description:
      'Catches errors before code runs. If `pnpm type-check` passes, your code is type-safe.',
  },
  {
    icon: ShieldCheck,
    title: 'ESLint',
    description:
      'Enforces coding standards automatically. Run `pnpm lint` before committing.',
  },
  {
    icon: Zap,
    title: 'Prettier',
    description:
      'Auto-formats code consistently. Run `pnpm format` to fix formatting.',
  },
  {
    icon: Rocket,
    title: 'Vercel',
    description:
      'Preview every commit before merging. Share preview URLs with stakeholders.',
  },
  {
    icon: Database,
    title: 'Supabase',
    description:
      'Backend infrastructure handled. Focus on features, not infrastructure.',
  },
  {
    icon: FileText,
    title: 'Cursor Rules',
    description:
      "AI automatically follows your project's patterns and best practices.",
  },
]

export default function HowItWorksPage() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            How It Works
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A layered defense system of guardrails that work together to ensure
            AI generates production-ready, maintainable code.
          </p>
        </div>

        {/* Problems Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            The Problems
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {problems.map((problem) => (
              <Card key={problem.title}>
                <CardHeader>
                  <CardTitle>{problem.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {problem.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Solution Section */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            The Solution: Guardrails
          </h2>
          <p className="mb-8 text-muted-foreground">
            These tools work automatically to catch issues, so you can focus on
            product requirements instead of debugging.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guardrails.map((guardrail) => {
              const Icon = guardrail.icon
              return (
                <Card key={guardrail.title}>
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{guardrail.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {guardrail.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
