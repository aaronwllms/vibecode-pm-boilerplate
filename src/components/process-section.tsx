const steps = [
  {
    number: '01',
    title: 'Clone & Install',
    description: 'Get started in minutes with a single command.',
  },
  {
    number: '02',
    title: 'Read AGENTS.md',
    description:
      'Understand the structure and conventions that guide AI development.',
  },
  {
    number: '03',
    title: 'Start Building',
    description: 'Use Cursor with built-in rules to build features faster.',
  },
  {
    number: '04',
    title: 'Ship with Confidence',
    description:
      'Quality checks and tests ensure reliability before deployment.',
  },
]

export default function ProcessSection() {
  return (
    <section className="w-full bg-muted/50 py-20 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center duration-700 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Get started in minutes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            From clone to deployment, follow these steps to start building with
            AI-powered development.
          </p>
        </div>

        <div className="relative">
          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 md:items-start md:text-left"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: 'both',
                }}
              >
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-12 hidden h-0.5 w-full -translate-x-1/2 bg-border md:block" />
                )}
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground transition-transform duration-300 hover:scale-110">
                  {step.number}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
