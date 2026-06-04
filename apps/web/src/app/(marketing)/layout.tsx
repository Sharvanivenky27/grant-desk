'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xl font-semibold tracking-tight">GrantDesk</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/grants" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Browse Grants
              </Link>
              <Link href="/resources" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Resources
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              {session ? (
                <Link href="/dashboard">
                  <Button size="sm">
                    Dashboard
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">
                      Get Started
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-lg font-semibold tracking-tight">GrantDesk</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Canada&apos;s leading grant discovery platform. Find government funding for your business growth.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground">Product</h4>
              <ul className="mt-4 space-y-3">
                <li><Link href="/grants" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Grants</Link></li>
                <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground">Resources</h4>
              <ul className="mt-4 space-y-3">
                <li><Link href="/resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Grant Guides</Link></li>
                <li><Link href="/resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Grant Calendar</Link></li>
                <li><Link href="/resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Tips &amp; Tools</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground">Company</h4>
              <ul className="mt-4 space-y-3">
                <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2026 GrantDesk. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
