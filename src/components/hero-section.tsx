import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center gap-8 px-4 py-20 text-center md:py-24">
      <div className="flex max-w-4xl flex-col gap-6 duration-700 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Build with AI, Ship with{' '}
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Confidence
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl">
            A starter template designed for product managers who code with AI.
            Built-in guardrails, best practices, and Cursor rules so you can
            focus on building, not debugging.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/login">Start Building</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/docs">Read the Guide</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
