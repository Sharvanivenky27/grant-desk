import Link from 'next/link';
import {
  BookOpen,
  MapPin,
  TrendingUp,
  ArrowRight,
  Clock,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const GRANT_GUIDES = [
  {
    icon: BookOpen,
    title: 'The Complete Guide to Canadian Federal Grants',
    description:
      'A step-by-step walkthrough of how to find, evaluate, and apply for federal grant programs including IRAP, CDAP, and SR&ED.',
    tag: 'Federal',
  },
  {
    icon: MapPin,
    title: 'Provincial Grants: What’s Available in Your Province',
    description:
      "Province-by-province breakdown of the most valuable grant programs, from Ontario’s digital adoption fund to BC’s tech IP grant.",
    tag: 'Provincial',
  },
  {
    icon: TrendingUp,
    title: 'SR&ED Tax Credits: The Basics for Tech Companies',
    description:
      'Scientific Research & Experimental Development tax credits can mean significant refunds. Learn who qualifies and how to claim.',
    tag: 'Tax Credits',
  },
];

const UPCOMING_DEADLINES = [
  {
    name: 'Canada Digital Adoption Program',
    agency: 'Innovation, Science and Economic Development Canada',
    deadline: 'Rolling deadline',
    detail: 'Applications accepted year-round',
  },
  {
    name: 'CanExport',
    agency: 'Trade Commissioner Service',
    deadline: 'Next deadline: Aug 31, 2026',
    detail: 'Export market development funding',
  },
  {
    name: 'BC Tech/IP Grant',
    agency: 'BC Ministry of Jobs, Economic Development and Innovation',
    deadline: 'Next deadline: Sep 30, 2026',
    detail: 'Technology and intellectual property support',
  },
];

const QUICK_TIPS = [
  {
    title: 'Start with your profile',
    description:
      'A complete business profile increases match quality. Fill in your sector, stage, and province first.',
  },
  {
    title: 'Apply early',
    description:
      "Most grant programs evaluate applications as they come in. Don’t wait until the deadline — apply as soon as your business qualifies.",
  },
  {
    title: 'Track your applications',
    description:
      'Use the pipeline to move grants from Saved → Applied → Submitted. Add notes at each stage to track your progress.',
  },
];

export default function ResourcesPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground leading-[1.1]">
              Grant Resources for Canadian Businesses
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Practical guides, templates, and tools to help you find and win government funding.
            </p>
          </div>
        </div>
      </section>

      {/* Grant Guides */}
      <section className="py-16 sm:py-24 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
            Grant Guides
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {GRANT_GUIDES.map((guide) => (
              <Card key={guide.title} className="border-border bg-card flex flex-col">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <guide.icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {guide.tag}
                    </Badge>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground leading-snug">
                    {guide.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                    {guide.description}
                  </p>
                  <Link
                    href="#"
                    className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Read Guide
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Deadlines */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              Upcoming Deadlines
            </h2>
            <p className="text-sm text-muted-foreground">
              Deadlines are approximate — always verify on the official source.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {UPCOMING_DEADLINES.map((item) => (
              <Card key={item.name} className="border-border bg-card">
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold text-foreground leading-snug">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{item.agency}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-amber-600">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">{item.deadline}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                  <Link
                    href="/grants"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    View Grant
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="py-16 sm:py-24 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
            Quick Tips
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {QUICK_TIPS.map((tip) => (
              <Card key={tip.title} className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {tip.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {tip.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-border bg-card">
            <CardContent className="p-12 sm:p-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                Start discovering grants today
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Search 3,500+ Canadian grants and get matched to programs your business qualifies for.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/grants">
                  <Button size="lg" className="w-full sm:w-auto">
                    Browse All Grants
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Create Free Account
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
