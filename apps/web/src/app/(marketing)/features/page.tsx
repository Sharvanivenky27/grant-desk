import Link from 'next/link';
import {
  Search,
  Target,
  Calendar,
  Bookmark,
  FileText,
  Building2,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CORE_FEATURES = [
  {
    icon: Search,
    title: 'Smart Grant Discovery',
    description:
      'Search across 3,500+ federal, provincial, and municipal grants with powerful filters.',
    bullets: [
      'Filter by sector, province, and grant level',
      'Full-text search by keyword or agency',
      'Sort by deadline or funding amount',
    ],
  },
  {
    icon: Target,
    title: 'Profile-Based Matching',
    description:
      'Your business profile powers intelligent grant matching — the more you fill out, the better your matches.',
    bullets: [
      'Sector and stage matching',
      'Province-specific eligibility',
      '"Best Match" badges on qualifying grants',
    ],
  },
  {
    icon: Calendar,
    title: 'Deadline Tracking',
    description:
      'Never miss a grant window with real-time deadline tracking and urgency indicators.',
    bullets: [
      'Closing-soon alerts on browse page',
      'Monthly deadline dashboard',
      'Visual urgency badges (red ≤7 days)',
    ],
  },
  {
    icon: Bookmark,
    title: 'Application Pipeline',
    description:
      'Move grants through your pipeline from saved to awarded in a structured workflow.',
    bullets: [
      'Six pipeline stages: Saved → Applied → Submitted → Awarded',
      'Per-grant application notes',
      'Timeline tracking with applied and submitted dates',
    ],
  },
  {
    icon: FileText,
    title: 'Grant Detail Pages',
    description:
      'Deep-dive into any grant with full eligibility info and application requirements.',
    bullets: [
      'Required documents checklist (interactive)',
      'Eligibility by sector, stage, and province',
      'Direct links to official application portals',
    ],
  },
  {
    icon: Building2,
    title: 'Business Profile',
    description:
      'A one-time setup that unlocks the full power of personalized matching.',
    bullets: [
      'Completion progress bar shows your match quality',
      'Industry, stage, and revenue fields',
      'Profile data synced across all features',
    ],
  },
];

const COMPARISON_ROWS = [
  {
    label: 'Time to find relevant grants',
    manual: 'Hours per week',
    grantdesk: 'Minutes',
  },
  {
    label: 'Coverage',
    manual: '2–3 government websites',
    grantdesk: '3,500+ grants from all levels',
  },
  {
    label: 'Deadline awareness',
    manual: 'Easy to miss',
    grantdesk: 'Visual alerts + dashboard tracking',
  },
  {
    label: 'Application tracking',
    manual: 'Spreadsheet or memory',
    grantdesk: 'Built-in pipeline with notes',
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
              <span className="text-primary font-semibold">Everything you need</span>
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground leading-[1.1]">
              Features built for Canadian grant seekers
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              From discovery to award — every step of your grant journey in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 sm:py-24 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {CORE_FEATURES.map((feature) => (
              <Card
                key={feature.title}
                className="border-border bg-card"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                How GrantDesk compares
              </h2>
              <p className="mt-4 text-muted-foreground">
                See why thousands of Canadian businesses choose GrantDesk over manual searching.
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-xl border border-border">
              {/* Table header */}
              <div className="grid grid-cols-3 bg-muted/50">
                <div className="px-6 py-4 text-sm font-medium text-muted-foreground" />
                <div className="border-l border-border px-6 py-4 text-sm font-semibold text-foreground text-center">
                  Manual Search
                </div>
                <div className="border-l border-border px-6 py-4 text-sm font-semibold text-primary text-center">
                  GrantDesk
                </div>
              </div>

              {/* Table rows */}
              {COMPARISON_ROWS.map((row, index) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-3 border-t border-border ${
                    index % 2 === 0 ? 'bg-background' : 'bg-muted/50'
                  }`}
                >
                  <div className="px-6 py-4 text-sm font-medium text-foreground">
                    {row.label}
                  </div>
                  <div className="border-l border-border px-6 py-4 text-sm text-muted-foreground text-center">
                    {row.manual}
                  </div>
                  <div className="border-l border-border px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                      <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                      {row.grantdesk}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-border bg-card">
            <CardContent className="p-12 sm:p-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                Ready to find your next grant?
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Join thousands of Canadian businesses discovering and winning government funding with GrantDesk.
              </p>
              <div className="mt-8">
                <Link href="/register">
                  <Button size="lg">
                    Start for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
