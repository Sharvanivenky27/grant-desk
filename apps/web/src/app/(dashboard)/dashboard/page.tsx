'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Calendar,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  DollarSign,
  Clock,
  FileText,
  Sparkles,
  CheckCircle2,
  Circle,
  ChevronRight,
} from 'lucide-react';
import { useGrants, type Grant } from '@/lib/hooks/useGrants';
import { useSavedGrants } from '@/lib/hooks/useSavedGrants';
import { useProfile } from '@/lib/hooks/useProfile';
import { formatAmount, formatDeadline, getLevelBadgeColor } from '@/lib/mock-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-6 lg:p-8 space-y-6">{Array.from({length:4}).map((_,i)=><div key={i} className="h-24 rounded-lg bg-muted animate-pulse"/>)}</div>}>
      <DashboardPageContent />
    </Suspense>
  );
}

function DashboardPageContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { grants, loading: grantsLoading, meta } = useGrants();
  const { savedGrants, loading: savedLoading, saveGrant, removeGrant } = useSavedGrants();
  const { profile } = useProfile();

  const loading = grantsLoading || savedLoading;

  const matchedGrants = (grants ?? []).slice(0, 4);
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const upcomingDeadlines = (grants ?? [])
    .filter((g) => {
      if (!g.deadline) return false;
      const d = new Date(g.deadline);
      return d > now && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .slice(0, 3);

  const totalFundingM = Math.floor(
    (grants ?? []).reduce((sum, g) => sum + (g.maxAmount ?? 0), 0) / 1_000_000
  );
  const totalFundingStr = totalFundingM > 0 ? `$${totalFundingM}M+` : '$2.4M+';

  const savedGrantIds = new Set((savedGrants ?? []).map(sg => sg.grantId));

  const handleSave = async (grantId: string) => {
    if (savedGrantIds.has(grantId)) {
      await removeGrant(grantId);
    } else {
      await saveGrant(grantId);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/grants?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/grants');
    }
  };

  const isProfileComplete = !!(profile?.companyName && profile?.sector && profile?.province && profile?.stage);

  const stats = [
    {
      label: 'Matched Grants',
      value: (meta?.total ?? 0).toString(),
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Deadlines This Month',
      value: upcomingDeadlines.length.toString(),
      icon: Calendar,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      label: 'Saved Grants',
      value: (savedGrants ?? []).length.toString(),
      icon: Bookmark,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: 'Total Funding Available',
      value: totalFundingStr,
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50',
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <span className="text-sm font-medium text-muted-foreground">
            Personalized for you
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back{profile?.companyName ? `, ${profile.companyName}` : ''}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s matching your business profile.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search grants, agencies, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 pl-10 bg-card border-input"
          />
        </form>
      </div>

      {/* Getting Started Checklist */}
      {!loading && (
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Getting Started</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">Complete these steps to find the best grants for you</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <Link href="/profile" className="group flex items-center gap-3 rounded-lg bg-background/80 p-3 hover:bg-background transition-colors">
                      <div className={`rounded-full p-1.5 ${isProfileComplete ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                        {isProfileComplete ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">Complete your profile</p>
                        <p className="text-xs text-muted-foreground truncate">{isProfileComplete ? 'Profile is set up' : 'Tell us about your business'}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </Link>
                    <Link href="/grants" className="group flex items-center gap-3 rounded-lg bg-background/80 p-3 hover:bg-background transition-colors">
                      <div className="rounded-full bg-blue-100 p-1.5 text-blue-600">
                        <Search className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">Search for grants</p>
                        <p className="text-xs text-muted-foreground truncate">Find opportunities that match</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </Link>
                    <Link href="/saved" className="group flex items-center gap-3 rounded-lg bg-background/80 p-3 hover:bg-background transition-colors">
                      <div className={`rounded-full p-1.5 ${(savedGrants ?? []).length > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-purple-600'}`}>
                        {(savedGrants ?? []).length > 0 ? <CheckCircle2 className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">Save grants you like</p>
                        <p className="text-xs text-muted-foreground truncate">{(savedGrants ?? []).length > 0 ? `${savedGrants.length} saved` : 'Start building your pipeline'}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-muted rounded" />
                      <div className="h-8 w-16 bg-muted rounded" />
                    </div>
                    <div className="h-10 w-10 bg-muted rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            ))
          : stats.map((stat) => (
              <Card
                key={stat.label}
                className="bg-card hover:shadow-md transition-shadow duration-200"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="mt-1 text-2xl font-semibold text-foreground tracking-tight">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`rounded-lg p-2.5 ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Matched Grants */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Top Matches</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/grants">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-5">
                    <div className="space-y-3">
                      <div className="h-5 w-20 bg-muted rounded-full" />
                      <div className="h-6 w-3/4 bg-muted rounded" />
                      <div className="h-4 w-1/2 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : matchedGrants.length > 0
            ? matchedGrants.map((grant) => (
                <GrantCard key={grant.id} grant={grant} showMatch isSaved={savedGrantIds.has(grant.id)} onSave={handleSave} />
              ))
            : (
              <Card className="col-span-2 bg-muted/30 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-center mb-4">
                    No grants found yet. Complete your profile to get matched with relevant opportunities.
                  </p>
                  <Button asChild size="sm">
                    <Link href="/profile">Complete Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">
              Upcoming Deadlines
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/grants">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Card className="bg-card">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted" />
                      <div className="space-y-1.5">
                        <div className="h-4 w-32 bg-muted rounded" />
                        <div className="h-3 w-24 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="space-y-1.5 text-right">
                      <div className="h-4 w-20 bg-muted rounded" />
                      <div className="h-3 w-16 bg-muted rounded" />
                    </div>
                  </div>
                  {i < 2 && <Separator />}
                </div>
              ))
            : upcomingDeadlines.length > 0
            ? upcomingDeadlines.map((grant, i) => (
                <DeadlineRow
                  key={grant.id}
                  grant={grant}
                  isLast={i === upcomingDeadlines.length - 1}
                />
              ))
            : (
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-center">
                  No upcoming deadlines. You&apos;re all caught up!
                </p>
              </CardContent>
            )}
        </Card>
      </div>
    </div>
  );
}

function GrantCard({
  grant,
  showMatch,
  isSaved,
  onSave,
}: {
  grant: Grant;
  showMatch?: boolean;
  isSaved: boolean;
  onSave: (grantId: string) => void;
}) {
  const { profile } = useProfile();
  const isMatch = profile?.sector && grant.eligibleSectors.includes(profile.sector);

  return (
    <Card className="bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-200 group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="secondary"
                className={`text-xs font-medium ${getLevelBadgeColor(grant.level)}`}
              >
                {grant.level}
              </Badge>
              {showMatch && isMatch && (
                <Badge variant="default" className="text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                  Best Match
                </Badge>
              )}
            </div>
            <h3 className="mt-2 font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {grant.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
              {grant.agency}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 shrink-0 ${isSaved ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => onSave(grant.id)}
          >
            {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </Button>
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5" />
            <span>{formatAmount(grant.minAmount, grant.maxAmount)}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDeadline(grant.deadline, grant.deadlineType)}</span>
          </span>
        </div>
        <Separator className="my-4" />
        <div className="flex gap-2">
          <Button asChild size="sm" variant="secondary" className="flex-1">
            <Link href={`/grants/${grant.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DeadlineRow({
  grant,
  isLast,
}: {
  grant: Grant;
  isLast: boolean;
}) {
  const now = new Date();
  const deadline = grant.deadline ? new Date(grant.deadline) : null;
  const daysUntil = deadline ? Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

  const urgencyClass = daysUntil !== null && daysUntil <= 7
    ? 'bg-red-50/70 border border-red-200'
    : daysUntil !== null && daysUntil <= 30
    ? 'bg-amber-50/70 border border-amber-200'
    : '';

  return (
    <>
      <div className={`flex items-center justify-between p-4 hover:bg-muted/30 transition-colors rounded-lg ${urgencyClass}`}>
        <div className="flex items-center gap-4">
          <div className={`rounded-full p-2.5 ${daysUntil !== null && daysUntil <= 7 ? 'bg-red-100' : daysUntil !== null && daysUntil <= 30 ? 'bg-amber-100' : 'bg-orange-50'}`}>
            <Calendar className={`h-4 w-4 ${daysUntil !== null && daysUntil <= 7 ? 'text-red-600' : daysUntil !== null && daysUntil <= 30 ? 'text-amber-600' : 'text-orange-600'}`} />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{grant.title}</p>
            <p className="text-sm text-muted-foreground truncate">
              {grant.agency}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0 ml-4">
          <p className={`font-medium ${daysUntil !== null && daysUntil <= 7 ? 'text-red-600' : daysUntil !== null && daysUntil <= 30 ? 'text-amber-600' : 'text-foreground'}`}>
            {formatDeadline(grant.deadline, grant.deadlineType)}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatAmount(grant.minAmount, grant.maxAmount)}
          </p>
        </div>
      </div>
      {!isLast && <Separator />}
    </>
  );
}
