import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FREE_FEATURES = [
  'Up to 5 saved grants',
  'Basic search',
  'Grant discovery',
  'Profile matching (limited)',
];

const PRO_FEATURES = [
  'Unlimited saved grants',
  'Advanced search & filters',
  'Full profile matching',
  'Deadline tracking & alerts',
  'Application pipeline management',
  'Notes per application',
  'Priority grant updates',
];

const ENTERPRISE_FEATURES = [
  'Everything in Pro',
  'Multi-user / team access',
  'Dedicated account manager',
  'Custom grant sourcing',
  'API access',
  'Priority support',
  'SLA guarantee',
];

const FAQS = [
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, cancel anytime with no penalties.',
  },
  {
    question: 'Is there a free trial for Pro?',
    answer: 'Yes, 14-day free trial on Pro, no credit card required.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'All major credit cards via Stripe.',
  },
  {
    question: 'Do you offer discounts for nonprofits?',
    answer: 'Yes, contact us for nonprofit and startup discounts.',
  },
];

export default function PricingPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="py-20 text-center px-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-y bg-muted/40 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-16">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">3,500+</p>
              <p className="text-sm text-muted-foreground">Grants available</p>
            </div>
            <div className="hidden sm:block h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">$4B+</p>
              <p className="text-sm text-muted-foreground">Funding tracked</p>
            </div>
            <div className="hidden sm:block h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">12,000+</p>
              <p className="text-sm text-muted-foreground">Canadian businesses</p>
            </div>
          </div>
          <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
            Canadian Businesses Trust GrantDesk
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">

            {/* Free tier */}
            <Card className="relative flex flex-col border-border">
              <CardContent className="flex flex-col flex-1 p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Free</h2>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">$0</span>
                    <span className="text-muted-foreground">/ forever</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Everything you need to get started exploring grants.
                  </p>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {FREE_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/register" className="w-full">
                  <Button variant="secondary" className="w-full">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro tier */}
            <Card className="relative flex flex-col border-primary shadow-xl bg-gradient-to-b from-primary/5 to-background">
              <CardContent className="flex flex-col flex-1 p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Pro</h2>
                    <Badge className="bg-emerald-500 text-white hover:bg-emerald-500">
                      Most Popular
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">$49</span>
                    <span className="text-muted-foreground">/ month</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Everything you need to find and win more grants.
                  </p>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {PRO_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/register" className="w-full">
                  <Button className="w-full">
                    Start Pro Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise tier */}
            <Card className="relative flex flex-col border-border">
              <CardContent className="flex flex-col flex-1 p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Enterprise</h2>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">Custom</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Tailored solutions for teams and organizations.
                  </p>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {ENTERPRISE_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="mailto:hello@grantdesk.ca" className="w-full">
                  <Button variant="secondary" className="w-full">
                    Contact Sales
                  </Button>
                </Link>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="mx-auto max-w-3xl sm:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground">
            Frequently asked questions
          </h2>
          <div className="space-y-8">
            {FAQS.map(({ question, answer }) => (
              <div key={question} className="border-b border-border pb-8 last:border-0 last:pb-0">
                <h3 className="text-base font-semibold text-foreground">{question}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
