import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Footer from '@/components/footer'
import { BookOpen, Rocket, FileText, Code, Database, Users } from 'lucide-react'

const documentationSections = [
  {
    title: 'Getting Started Guides',
    description: 'Essential guides to get up and running',
    docs: [
      {
        title: 'Quick Start for PMs',
        description:
          'Complete guide for Product Managers working with AI development tools. Learn how to use Cursor effectively, validate code, and build features with confidence.',
        href: 'https://github.com/aaronwllms/vibecode-pm-boilerplate/blob/main/docs/QUICK_START_FOR_PMS.md',
        icon: Rocket,
        featured: true,
        external: true,
      },
    ],
  },
  {
    title: 'Project Documentation',
    description: 'Additional resources and reference materials',
    docs: [
      {
        title: 'Documentation Index',
        description: 'Browse all project documentation organized by category.',
        href: 'https://github.com/aaronwllms/vibecode-pm-boilerplate/blob/main/docs/README.md',
        icon: BookOpen,
        external: true,
      },
      {
        title: 'Feature Documentation',
        description:
          'Architectural documentation for major features with visual diagrams.',
        href: 'https://github.com/aaronwllms/vibecode-pm-boilerplate/tree/main/docs/features',
        icon: FileText,
        external: true,
      },
      {
        title: 'Project Overview',
        description:
          'Complete project documentation including setup, structure, and conventions.',
        href: 'https://github.com/aaronwllms/vibecode-pm-boilerplate/blob/main/AGENTS.md',
        icon: BookOpen,
        external: true,
      },
    ],
  },
]

export default function DocsPage() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Documentation
          </h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to build with AI-powered development tools and
            ship production-ready applications.
          </p>
        </div>

        {documentationSections.map((section, sectionIndex) => (
          <div key={section.title} className={sectionIndex > 0 ? 'mt-12' : ''}>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {section.description}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {section.docs.map((doc) => {
                const Icon = doc.icon
                return (
                  <Card
                    key={doc.title}
                    className={`group transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      'featured' in doc && doc.featured
                        ? 'border-primary/50 bg-primary/5 sm:col-span-2 lg:col-span-3'
                        : ''
                    }`}
                  >
                    <CardHeader>
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                          <Icon className="h-5 w-5" />
                        </div>
                        {'featured' in doc && doc.featured && (
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            Featured
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-xl">{doc.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {doc.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {doc.external ? (
                        <Button
                          asChild
                          variant={
                            'featured' in doc && doc.featured
                              ? 'default'
                              : 'outline'
                          }
                          className="w-full"
                        >
                          <Link
                            href={doc.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View on GitHub
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          asChild
                          variant={
                            'featured' in doc && doc.featured
                              ? 'default'
                              : 'outline'
                          }
                          className="w-full"
                        >
                          <Link href={doc.href}>Read Guide</Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}

        <div className="mt-12 rounded-lg border border-border bg-muted/50 p-6">
          <div className="flex items-start gap-4">
            <Users className="mt-1 h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="mb-2 font-semibold">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                If you can&apos;t find what you&apos;re looking for, check out
                the{' '}
                <Link
                  href="https://github.com/aaronwllms/vibecode-pm-boilerplate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  project repository
                </Link>{' '}
                or review the{' '}
                <Link
                  href="https://github.com/aaronwllms/vibecode-pm-boilerplate/blob/main/AGENTS.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  project overview
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
