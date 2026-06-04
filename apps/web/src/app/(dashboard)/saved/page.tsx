'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Calendar, DollarSign, MapPin, Trash2 } from 'lucide-react';
import { useSavedGrants, type PipelineStage, type SavedGrant } from '@/lib/hooks/useSavedGrants';
import { formatAmount, formatDeadline, getLevelBadgeColor } from '@/lib/mock-data';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';

const STAGES: { value: PipelineStage | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'saved', label: 'Saved' },
  { value: 'applied', label: 'Applied' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'awarded', label: 'Awarded' },
  { value: 'rejected', label: 'Rejected' },
];

const STAGE_BADGE_VARIANTS: Record<PipelineStage, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  saved: 'secondary',
  applied: 'default',
  submitted: 'outline',
  awarded: 'default',
  rejected: 'destructive',
  withdrawn: 'secondary',
};

export default function SavedPage() {
  const [filterStage, setFilterStage] = useState<PipelineStage | 'all'>('all');
  const { savedGrants, loading, error, removeGrant, updateStage, refetch } = useSavedGrants();

  const filtered = filterStage === 'all'
    ? savedGrants
    : savedGrants.filter(s => s.stage === filterStage);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Saved Grants</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {loading ? 'Loading...' : `${savedGrants.length} grants saved`}
        </p>
      </div>

      {/* Stage Filter Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-border pb-4">
        {STAGES.map((stage) => (
          <button
            key={stage.value}
            onClick={() => setFilterStage(stage.value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filterStage === stage.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {stage.label}
            {!loading && stage.value !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({savedGrants.filter(s => s.stage === stage.value).length})
              </span>
            )}
          </button>
        ))}
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
      ) : filtered.length === 0 ? (
        filterStage === 'all' ? (
          <EmptyState
            title="No saved grants yet"
            description="Browse grants and save the ones you're interested in to track them here."
            actionLabel="Browse grants"
            actionHref="/grants"
          />
        ) : (
          <EmptyState
            title={`No ${filterStage} grants`}
            description={`You don't have any grants in the "${filterStage}" stage yet.`}
            actionLabel="View all saved"
            onAction={() => setFilterStage('all')}
          />
        )
      ) : (
        <div className="space-y-4">
          {filtered.map((entry) => (
            <SavedGrantCard
              key={entry.id}
              entry={entry}
              onRemove={removeGrant}
              onUpdateStage={updateStage}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const STAGE_STEPS = [
  { key: 'saved', label: 'Saved' },
  { key: 'applied', label: 'Applied' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'outcome', label: 'Outcome' },
] as const;

function getStageIndex(stage: PipelineStage): number {
  if (stage === 'saved') return 0;
  if (stage === 'applied') return 1;
  if (stage === 'submitted') return 2;
  if (['awarded', 'rejected', 'withdrawn'].includes(stage)) return 3;
  return 0;
}

function StageProgress({
  stage,
  appliedAt,
  submittedAt,
  outcomeAt,
}: {
  stage: PipelineStage;
  appliedAt: string | null;
  submittedAt: string | null;
  outcomeAt: string | null;
}) {
  const currentIndex = getStageIndex(stage);
  const timestamps: Record<number, string | null> = {
    1: appliedAt,
    2: submittedAt,
    3: outcomeAt,
  };

  return (
    <div className="mt-4 mb-2">
      {/* Progress dots */}
      <div className="flex items-center">
        {STAGE_STEPS.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                isCurrent
                  ? 'bg-primary text-primary-foreground'
                  : isCompleted
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {isCompleted ? '✓' : i + 1}
              </div>
              {i < STAGE_STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-1 ${isCompleted ? 'bg-primary/30' : 'bg-border'}`} />
              )}
            </div>
          );
        })}
      </div>
      {/* Step labels */}
      <div className="flex mt-1">
        {STAGE_STEPS.map((step, i) => {
          const isCurrent = i === currentIndex;
          return (
            <div key={step.key} className={`flex-1 text-center text-xs ${isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'} ${i === STAGE_STEPS.length - 1 ? 'flex-none text-right' : ''}`}>
              {step.label}
            </div>
          );
        })}
      </div>
      {/* Timestamps */}
      {(appliedAt || submittedAt || outcomeAt) && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {appliedAt && (
            <span className="text-xs text-muted-foreground">
              Applied: {new Date(appliedAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
          {submittedAt && (
            <span className="text-xs text-muted-foreground">
              Submitted: {new Date(submittedAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
          {outcomeAt && stage === 'awarded' && (
            <span className="text-xs text-emerald-600 font-medium">
              Awarded: {new Date(outcomeAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
          {outcomeAt && stage === 'rejected' && (
            <span className="text-xs text-destructive">
              Rejected: {new Date(outcomeAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function NotesField({
  initialNotes,
  onSave,
}: {
  initialNotes: string;
  onSave: (notes: string) => void;
}) {
  const [value, setValue] = useState(initialNotes);
  const [saved, setSaved] = useState(false);

  const handleBlur = () => {
    if (value !== initialNotes) {
      onSave(value);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="mt-4">
      <textarea
        value={value}
        onChange={(e) => { setValue(e.target.value); setSaved(false); }}
        onBlur={handleBlur}
        placeholder="Add application notes..."
        rows={2}
        className="w-full resize-none rounded-md border border-input bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
      />
      {saved && (
        <p className="mt-1 text-xs text-emerald-600">Notes saved</p>
      )}
    </div>
  );
}

function SavedGrantCard({
  entry,
  onRemove,
  onUpdateStage,
}: {
  entry: SavedGrant;
  onRemove: (grantId: string) => void;
  onUpdateStage: (grantId: string, stage: PipelineStage, notes?: string) => void;
}) {
  const { grant, stage, savedAt, appliedAt, submittedAt, outcomeAt } = entry;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {grant.level}
              </Badge>
              <Badge variant={STAGE_BADGE_VARIANTS[stage]} className="capitalize">
                {stage}
              </Badge>
            </div>

            {/* Title & Agency */}
            <h3 className="mt-3 text-lg font-semibold text-foreground truncate">
              {grant.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground truncate">
              {grant.agency}
            </p>
          </div>

          {/* Remove Button - subtle but discoverable */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(entry.grantId)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>

        {/* Meta Info */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4" />
            {formatAmount(grant.minAmount, grant.maxAmount)}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDeadline(grant.deadline, grant.deadlineType)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {grant.eligibleProvinces.length === 13 ? 'All Canada' : grant.eligibleProvinces.join(', ')}
          </span>
        </div>

        {/* Notes */}
        <NotesField
          initialNotes={entry.notes ?? ''}
          onSave={(notes) => onUpdateStage(entry.grantId, stage, notes)}
        />

        <StageProgress stage={stage} appliedAt={appliedAt} submittedAt={submittedAt} outcomeAt={outcomeAt} />

        {/* Footer */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border pt-4">
          {/* Stage Update & Saved Date */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor={`stage-${entry.id}`} className="text-xs font-medium text-muted-foreground">
                Stage:
              </label>
              <Select
                id={`stage-${entry.id}`}
                value={stage}
                onChange={(e) => onUpdateStage(entry.grantId, e.target.value as PipelineStage)}
                className="h-8 w-auto min-w-[120px] text-xs"
              >
                <option value="saved">Saved</option>
                <option value="applied">Applied</option>
                <option value="submitted">Submitted</option>
                <option value="awarded">Awarded</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </Select>
            </div>
            <span className="text-xs text-muted-foreground/60">
              Saved {new Date(savedAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {/* Apply Now - Primary Action */}
          <Button asChild size="sm" className="gap-1.5">
            <a
              href={grant.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply Now
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
