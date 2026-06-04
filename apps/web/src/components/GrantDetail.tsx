'use client';

import { ExternalLink, Calendar, DollarSign, MapPin, FileText, Bookmark, BookmarkCheck } from 'lucide-react';
import type { Grant } from '@/lib/hooks/useGrants';
import { getLevelBadgeColor, formatAmount, formatDeadline } from '@/lib/mock-data';

interface GrantDetailProps {
  grant: Grant;
  isSaved?: boolean;
  onSave?: (grantId: string) => void;
}

export function GrantDetail({ grant, isSaved = false, onSave }: GrantDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getLevelBadgeColor(grant.level)}`}>
            {grant.level.charAt(0).toUpperCase() + grant.level.slice(1)} · {grant.grantType.replace('_', ' ')}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">{grant.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{grant.agency}</p>
      </div>

      {/* Key Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">Funding Amount</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatAmount(grant.minAmount, grant.maxAmount)}
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">Deadline</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatDeadline(grant.deadline, grant.deadlineType)}
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-medium text-foreground">Description</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{grant.description}</p>
      </div>

      {/* Eligibility */}
      <div>
        <h3 className="font-medium text-foreground">Eligibility</h3>
        <div className="mt-3 space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Sectors</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {grant.eligibleSectors.map((sector) => (
                <span key={sector} className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                  {sector}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Stages</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {grant.eligibleStages.map((stage) => (
                <span key={stage} className="rounded bg-green-50 px-2 py-0.5 text-xs text-green-700 capitalize">
                  {stage.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Provinces</p>
            <p className="mt-1 text-sm text-foreground">
              {grant.eligibleProvinces.length === 13 ? 'All Canadian provinces and territories' : grant.eligibleProvinces.join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* Required Documents */}
      <div>
        <h3 className="font-medium text-foreground">Required Documents</h3>
        <ul className="mt-2 space-y-1">
          {grant.requiredDocs.map((doc) => (
            <li key={doc} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
              {doc}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-3 border-t pt-6">
        {onSave && (
          <button
            onClick={() => onSave(grant.id)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium ${
              isSaved
                ? 'border border-border bg-background text-foreground hover:bg-muted transition-colors'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-colors'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="mr-1 inline h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="mr-1 inline h-4 w-4" />
                Save Grant
              </>
            )}
          </button>
        )}
        <a
          href={grant.applicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Apply Now
          <ExternalLink className="ml-1 inline h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
