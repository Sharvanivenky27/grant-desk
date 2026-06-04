'use client';

import { Suspense } from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  X,
  ExternalLink,
  Calendar,
  MapPin,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useGrants, type Grant } from '@/lib/hooks/useGrants';
import { useSavedGrants } from '@/lib/hooks/useSavedGrants';
import { useProfile } from '@/lib/hooks/useProfile';
import { formatAmount, formatDeadline } from '@/lib/mock-data';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const SECTORS = ['IT', 'Agriculture', 'Biotech', 'Clean Tech', 'Manufacturing', 'Retail', 'Services', 'Food & Beverage'];
const PROVINCES = ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL'];
const LEVELS: { value: string; label: string }[] = [
  { value: 'federal', label: 'Federal' },
  { value: 'provincial', label: 'Provincial' },
  { value: 'municipal', label: 'Municipal' },
  { value: 'private', label: 'Private' },
];

const LEVEL_COLORS: Record<string, string> = {
  federal: 'bg-blue-50 text-blue-700 border-blue-200',
  provincial: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  municipal: 'bg-purple-50 text-purple-700 border-purple-200',
  private: 'bg-slate-50 text-slate-700 border-slate-200',
};

const STAGE_COLORS: Record<string, string> = {
  startup: 'bg-amber-50 text-amber-700 border-amber-200',
  'pre-revenue': 'bg-orange-50 text-orange-700 border-orange-200',
  revenue: 'bg-green-50 text-green-700 border-green-200',
  established: 'bg-teal-50 text-teal-700 border-teal-200',
};

interface GrantCardProps {
  grant: Grant;
  onSelect: (grant: Grant) => void;
  onSave: (grantId: string) => void;
  isSaved: boolean;
  userSector?: string;
}

function GrantCard({ grant, onSelect, onSave, isSaved, userSector }: GrantCardProps) {
  const daysUntilDeadline = grant.deadline
    ? Math.ceil((new Date(grant.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const isUrgent = daysUntilDeadline !== null && daysUntilDeadline > 0 && daysUntilDeadline <= 7;

  return (
    <div className="group relative rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200">
      {/* Left accent border */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-colors",
        grant.level === 'federal' && "bg-blue-500",
        grant.level === 'provincial' && "bg-emerald-500",
        grant.level === 'municipal' && "bg-purple-500",
        grant.level === 'private' && "bg-slate-400",
      )} />

      <div className="pl-4 pr-5 py-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Level badge and agency */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge
                variant="outline"
                className={cn("text-xs font-medium capitalize", LEVEL_COLORS[grant.level])}
              >
                {grant.level}
              </Badge>
              {userSector && grant.eligibleSectors.includes(userSector) && (
                <Badge variant="outline" className="text-xs font-medium bg-emerald-50 text-emerald-700 border-emerald-200">
                  Matches your profile
                </Badge>
              )}
              {isUrgent && (
                <Badge variant="outline" className="text-xs font-medium bg-orange-50 text-orange-700 border-orange-200">
                  Closes in {daysUntilDeadline}d
                </Badge>
              )}
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                {grant.agency.length > 45 ? grant.agency.slice(0, 45) + '...' : grant.agency}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors">
              {grant.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {grant.description}
            </p>
          </div>

          {/* Save button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(grant.id);
            }}
            className={cn(
              "flex-shrink-0 rounded-lg p-2 transition-all",
              isSaved
                ? "text-primary bg-primary/10 hover:bg-primary/15"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            aria-label={isSaved ? "Remove from saved" : "Save grant"}
          >
            {isSaved ? (
              <BookmarkCheck className="h-5 w-5" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Meta info row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
          {/* Amount */}
          <div className="flex items-center gap-1.5 text-sm text-foreground">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatAmount(grant.minAmount, grant.maxAmount)}</span>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-1.5 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className={cn(
              "font-medium",
              grant.deadline && new Date(grant.deadline) < new Date() ? "text-destructive" : "text-foreground"
            )}>
              {formatDeadline(grant.deadline, grant.deadlineType)}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {grant.eligibleProvinces.length === 13
                ? 'All Canada'
                : grant.eligibleProvinces.length > 3
                  ? `${grant.eligibleProvinces.slice(0, 2).join(', ')} +${grant.eligibleProvinces.length - 2}`
                  : grant.eligibleProvinces.join(', ')}
            </span>
          </div>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          {/* Sector tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {grant.eligibleSectors.slice(0, 3).map((sector) => (
              <span
                key={sector}
                className="inline-flex items-center rounded-md bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground font-medium"
              >
                {sector}
              </span>
            ))}
            {grant.eligibleSectors.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{grant.eligibleSectors.length - 3}
              </span>
            )}
          </div>

          {/* View details link */}
          <button
            onClick={() => onSelect(grant)}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View Details
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface DetailDrawerProps {
  grant: Grant | null;
  open: boolean;
  onClose: () => void;
  onSave: (grantId: string) => void;
  isSaved: boolean;
}

function DetailDrawer({ grant, open, onClose, onSave, isSaved }: DetailDrawerProps) {
  if (!grant) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-lg bg-background shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={cn("text-xs font-medium capitalize", LEVEL_COLORS[grant.level])}
            >
              {grant.level}
            </Badge>
            <span className="text-sm text-muted-foreground capitalize">
              {grant.grantType.replace('_', ' ')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-73px)] p-6">
          {/* Title & Agency */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              {grant.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{grant.agency}</p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">Funding Amount</p>
              <p className="text-lg font-semibold text-foreground">
                {formatAmount(grant.minAmount, grant.maxAmount)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">Deadline</p>
              <p className="text-lg font-semibold text-foreground">
                {formatDeadline(grant.deadline, grant.deadlineType)}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {grant.description}
            </p>
          </div>

          {/* Eligibility */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Eligibility</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-2">Sectors</p>
                <div className="flex flex-wrap gap-1.5">
                  {grant.eligibleSectors.map((sector) => (
                    <span
                      key={sector}
                      className="inline-flex items-center rounded-md bg-muted/70 px-2.5 py-1 text-xs text-muted-foreground font-medium"
                    >
                      {sector}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-medium mb-2">Stages</p>
                <div className="flex flex-wrap gap-1.5">
                  {grant.eligibleStages.map((stage) => (
                    <Badge
                      key={stage}
                      variant="outline"
                      className={cn("text-xs font-medium capitalize", STAGE_COLORS[stage])}
                    >
                      {stage.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-medium mb-2">Provinces</p>
                <p className="text-sm text-foreground">
                  {grant.eligibleProvinces.length === 13
                    ? 'All Canadian provinces and territories'
                    : grant.eligibleProvinces.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Required Documents</h3>
            <ul className="space-y-2">
              {grant.requiredDocs.map((doc) => (
                <li key={doc} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions - sticky footer */}
          <div className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border pt-6 pb-2 -mx-6 px-6 mt-6">
            <div className="flex gap-3">
              <Button
                variant={isSaved ? "secondary" : "default"}
                size="lg"
                className="flex-1"
                onClick={() => onSave(grant.id)}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    Save Grant
                  </>
                )}
              </Button>
              <Button
                asChild
                size="lg"
                className="flex-1"
              >
                <a
                  href={grant.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply Now
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function GrantsPage() {
  return (
    <Suspense fallback={<div className="p-6 lg:p-8 space-y-4">{Array.from({length:3}).map((_,i)=><div key={i} className="h-32 rounded-xl bg-muted animate-pulse"/>)}</div>}>
      <GrantsPageContent />
    </Suspense>
  );
}

function GrantsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL params
  const getInitialFilters = () => ({
    q: searchParams.get('q') || '',
    sector: searchParams.get('sector')?.split(',').filter(Boolean) || [],
    province: searchParams.get('province')?.split(',').filter(Boolean) || [],
    level: searchParams.get('level')?.split(',').filter(Boolean) || [],
  });

  const [searchQuery, setSearchQuery] = useState(getInitialFilters().q);
  const [selectedSectors, setSelectedSectors] = useState<string[]>(getInitialFilters().sector);
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>(getInitialFilters().province);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(getInitialFilters().level);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { grants, loading, error, refetch } = useGrants();
  const { savedGrants, saveGrant, removeGrant } = useSavedGrants();
  const { profile } = useProfile();

  const isProfileComplete = !!(profile?.companyName && profile?.sector && profile?.province && profile?.stage);

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedSectors.length > 0) params.set('sector', selectedSectors.join(','));
    if (selectedProvinces.length > 0) params.set('province', selectedProvinces.join(','));
    if (selectedLevels.length > 0) params.set('level', selectedLevels.join(','));

    const newUrl = params.toString() ? `/grants?${params.toString()}` : '/grants';
    router.replace(newUrl, { scroll: false });
  }, [searchQuery, selectedSectors, selectedProvinces, selectedLevels, router]);

  const savedGrantIds = useMemo(() => {
    return new Set(savedGrants.map(sg => sg.grantId));
  }, [savedGrants]);

  const filteredGrants = useMemo(() => {
    return grants.filter((grant) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          grant.title.toLowerCase().includes(query) ||
          grant.description.toLowerCase().includes(query) ||
          grant.agency.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (selectedSectors.length > 0) {
        const hasMatchingSector = grant.eligibleSectors.some((s) =>
          selectedSectors.includes(s)
        );
        if (!hasMatchingSector) return false;
      }
      if (selectedProvinces.length > 0) {
        const hasMatchingProvince = grant.eligibleProvinces.some((p) =>
          selectedProvinces.includes(p)
        );
        if (!hasMatchingProvince) return false;
      }
      if (selectedLevels.length > 0) {
        if (!selectedLevels.includes(grant.level)) return false;
      }
      return true;
    });
  }, [grants, searchQuery, selectedSectors, selectedProvinces, selectedLevels]);

  const handleSelectGrant = (grant: Grant) => {
    setSelectedGrant(grant);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleSaveGrant = async (grantId: string) => {
    if (savedGrantIds.has(grantId)) {
      await removeGrant(grantId);
    } else {
      await saveGrant(grantId);
    }
  };

  const toggleSector = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
  };

  const toggleProvince = (province: string) => {
    setSelectedProvinces((prev) =>
      prev.includes(province) ? prev.filter((p) => p !== province) : [...prev, province]
    );
  };

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const clearFilters = () => {
    setSelectedSectors([]);
    setSelectedProvinces([]);
    setSelectedLevels([]);
  };

  const hasActiveFilters = selectedSectors.length > 0 || selectedProvinces.length > 0 || selectedLevels.length > 0;
  const activeFilterCount = selectedSectors.length + selectedProvinces.length + selectedLevels.length;

  return (
    <>
      {/* Profile Completion Banner */}
      {!loading && !isProfileComplete && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-amber-100 p-1.5">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                </div>
                <p className="text-sm text-amber-800">
                  <span className="font-medium">Complete your profile</span>
                  <span className="hidden sm:inline"> to see grants matched to your business</span>
                </p>
              </div>
              <Button asChild size="sm" variant="secondary" className="border-amber-300 text-amber-800 hover:bg-amber-100">
                <Link href="/profile">Complete Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Browse Grants</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? (
              'Loading grants...'
            ) : (
              <>
                {filteredGrants.length} grant{filteredGrants.length !== 1 ? 's' : ''} found
                {hasActiveFilters && ' (filtered)'}
                {savedGrantIds.size > 0 && ` · ${savedGrantIds.size} saved`}
              </>
            )}
          </p>
        </div>

        {/* Unified Filter Toolbar */}
        <div className="mb-6 space-y-3">
          {/* Search & Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search grants by name, description, or agency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-muted/40 border-input focus:bg-background transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <Button
              variant={showFilters ? "default" : "secondary"}
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "gap-2 h-11",
                showFilters && "bg-primary text-primary-foreground"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Expandable Filter Panel */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-200 ease-out",
              showFilters ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Sectors */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">Sector</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {SECTORS.map((sector) => (
                      <button
                        key={sector}
                        onClick={() => toggleSector(sector)}
                        className={cn(
                          "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                          selectedSectors.includes(sector)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {sector}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Provinces */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">Province</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {PROVINCES.map((province) => (
                      <button
                        key={province}
                        onClick={() => toggleProvince(province)}
                        className={cn(
                          "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                          selectedProvinces.includes(province)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {province}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level */}
                <div className={cn("sm:col-span-2 lg:col-span-1")}>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">Level</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => toggleLevel(level.value)}
                        className={cn(
                          "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                          selectedLevels.includes(level.value)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
                  </p>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && !showFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedSectors.map((sector) => (
                <Badge
                  key={sector}
                  variant="secondary"
                  className="gap-1.5 h-7 pl-2.5 pr-2"
                >
                  {sector}
                  <button
                    onClick={() => toggleSector(sector)}
                    className="ml-0.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedProvinces.map((province) => (
                <Badge
                  key={province}
                  variant="secondary"
                  className="gap-1.5 h-7 pl-2.5 pr-2"
                >
                  {province}
                  <button
                    onClick={() => toggleProvince(province)}
                    className="ml-0.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedLevels.map((level) => (
                <Badge
                  key={level}
                  variant="secondary"
                  className="gap-1.5 h-7 pl-2.5 pr-2 capitalize"
                >
                  {level}
                  <button
                    onClick={() => toggleLevel(level)}
                    className="ml-0.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Grants List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : filteredGrants.length === 0 ? (
          <EmptyState
            title="No grants found"
            description="Try adjusting your search or filters."
            actionLabel="Clear filters"
            onAction={clearFilters}
          />
        ) : (
          <div className="space-y-4">
            {filteredGrants.map((grant) => (
              <GrantCard
                key={grant.id}
                grant={grant}
                onSelect={handleSelectGrant}
                onSave={handleSaveGrant}
                isSaved={savedGrantIds.has(grant.id)}
                userSector={profile?.sector ?? undefined}
              />
            ))}
          </div>
        )}
      </main>

      {/* Detail Drawer */}
      <DetailDrawer
        grant={selectedGrant}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onSave={handleSaveGrant}
        isSaved={selectedGrant ? savedGrantIds.has(selectedGrant.id) : false}
      />
    </>
  );
}
