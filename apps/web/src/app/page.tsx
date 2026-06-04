'use client';

/**
 * GrantDesk Landing Page
 *
 * Premium B2B SaaS landing page for Canadian grant discovery.
 */

import Link from 'next/link';
import {
  Search,
  MapPin,
  DollarSign,
  Calendar,
  ArrowRight,
  CheckCircle,
  Building2,
  TrendingUp,
  Shield,
  Users,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const STATS = [
  { value: '3,500+', label: 'Grants Tracked', icon: DollarSign },
  { value: '$4B+', label: 'Funding Available', icon: TrendingUp },
  { value: '12,000+', label: 'Businesses Served', icon: Users },
];

const FEATURES = [
  {
    title: 'Smart Grant Discovery',
    description: 'Search and filter thousands of federal, provincial, and municipal grants with precision.',
    icon: Search,
  },
  {
    title: 'Eligibility Matching',
    description: 'Our algorithm matches your business profile to grants you actually qualify for.',
    icon: CheckCircle,
  },
  {
    title: 'Deadline Tracking',
    description: 'Never miss an application window with automated reminders and calendar sync.',
    icon: Calendar,
  },
  {
    title: 'Pipeline Management',
    description: 'Track applications, save favorites, and manage your funding strategy in one place.',
    icon: Building2,
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Create Your Profile',
    description: 'Tell us about your business — industry, size, location, and funding goals.',
  },
  {
    number: '02',
    title: 'Discover Matching Grants',
    description: 'Our system surfaces programs you qualify for from across Canadian governments.',
  },
  {
    number: '03',
    title: 'Apply with Confidence',
    description: 'Track deadlines, gather requirements, and submit applications with organized workflows.',
  },
];

const TRUST_SIGNALS = [
  'Trusted by 12,000+ Canadian businesses',
  'Data refreshed daily from official sources',
  'SOC 2 compliant data handling',
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xl font-semibold tracking-tight">GrantDesk</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/grants"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse Grants
              </Link>
              <Link
                href="/resources"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Resources
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Get Started
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#f8fafc_0%,transparent_50%,transparent_100%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
              <span className="text-primary font-semibold">Trusted by 12,000+ Canadian businesses</span>
            </Badge>

            {/* Heading */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-foreground leading-[1.1]">
              Find government grants for your{' '}
              <span className="text-primary">business growth</span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Stop searching across dozens of government websites. GrantDesk aggregates
              thousands of federal, provincial, and municipal grants in one place — and
              matches you to ones you qualify for.
            </p>

            {/* Search */}
            <div className="mt-10">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search grants (e.g., digital adoption, R&D, export)"
                  className="h-14 pl-12 pr-32 text-base shadow-sm"
                />
                <Link href="/grants" className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Button size="lg" className="h-10 px-6">
                    Search
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Try: <Link href="/grants?q=digital" className="text-primary hover:underline">digital adoption</Link>
                {' · '}
                <Link href="/grants?q=rd" className="text-primary hover:underline">R&D tax credits</Link>
                {' · '}
                <Link href="/grants?q=export" className="text-primary hover:underline">export funding</Link>
              </p>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Everything you need to find and apply for grants
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From discovery to application, manage your entire grant strategy in one platform.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, index) => (
              <Card
                key={feature.title}
                className="group relative overflow-hidden border-0 bg-muted/50 transition-all duration-300 hover:bg-muted/80 hover:shadow-lg hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Get matched to grants in three steps
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Simple, fast, and designed for busy business owners.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {index < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-border z-0" />
                )}

                <Card className="relative z-10 border-0 bg-background shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-mono text-lg font-bold">
                        {step.number}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* CTA under steps */}
          <div className="mt-12 text-center">
            <Link href="/register">
              <Button size="lg">
                Start Finding Grants
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 border-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
            {TRUST_SIGNALS.map((signal) => (
              <div key={signal} className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{signal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden border-0">
            {/* Background */}
            <div className="absolute inset-0 bg-primary/[0.02]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

            <CardContent className="relative z-10 p-12 sm:p-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                Ready to find your next grant?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                Join thousands of Canadian businesses using GrantDesk to discover
                and apply for government funding.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/grants">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Browse All Grants
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                No credit card required · Free plan available
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-lg font-semibold tracking-tight">GrantDesk</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Canada's leading grant discovery platform. Find government funding for your business growth.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-foreground">Product</h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link href="/grants" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Browse Grants
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-foreground">Resources</h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Grant Guides
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-foreground">Company</h4>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 GrantDesk. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
