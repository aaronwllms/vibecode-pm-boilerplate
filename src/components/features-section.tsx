import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Bot, ShieldCheck, FileText, Rocket, BookOpen } from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Development',
    description:
      'Cursor rules and AGENTS.md guide AI to follow best practices, ensuring consistent, high-quality code generation.',
  },
  {
    icon: ShieldCheck,
    title: 'Built-in Guardrails',
    description:
      'TypeScript strict mode, ESLint, Prettier, and testing enforce quality so you can ship with confidence.',
  },
  {
    icon: FileText,
    title: 'PM-Friendly Structure',
    description:
      'Clear conventions and documentation for non-developers, making it easy to understand and collaborate.',
  },
  {
    icon: Rocket,
    title: 'Production-Ready',
    description:
      'Next.js 14, Supabase, authentication, and deployment configs included. Start building, not configuring.',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full py-20 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center duration-700 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Built for AI-powered development
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Everything you need to build with AI assistants while maintaining
            code quality and best practices.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="group transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 hover:scale-105 hover:shadow-lg"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both',
                }}
              >
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        {/* Quick Start for PMs Callout */}
        <div className="mt-12 duration-700 animate-in fade-in slide-in-from-bottom-4">
          <Card className="border-primary/50 bg-gradient-to-br from-primary/5 via-primary/5 to-transparent">
            <CardHeader>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    New to AI Development?
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Product Managers: Start here
                  </CardDescription>
                </div>
              </div>
              <p className="text-muted-foreground">
                Learn how to use Cursor effectively, validate AI-generated code,
                and build features with confidence. Our comprehensive guide
                covers everything from getting started to best practices.
              </p>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/docs">Read Quick Start for PMs</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
