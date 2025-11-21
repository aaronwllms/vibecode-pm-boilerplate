import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CTASection() {
  return (
    <section className="w-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent py-20 md:py-24">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <div className="flex flex-col gap-6 duration-700 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Ready to start building with AI?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Join product managers who are building faster with AI-powered
            development. Get started today with NextPM.
          </p>
          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="w-full transition-transform duration-300 hover:scale-105 sm:w-auto"
            >
              <Link href="/login">Start Building</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full transition-transform duration-300 hover:scale-105 sm:w-auto"
            >
              <Link href="/docs">Read the Guide</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="w-full transition-transform duration-300 hover:scale-105 sm:w-auto"
            >
              <Link
                href="https://github.com/aaronwllms/vibecode-pm-boilerplate"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
