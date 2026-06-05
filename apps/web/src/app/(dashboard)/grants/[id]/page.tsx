'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Link2, Check, ChevronRight, FileQuestion } from 'lucide-react';
import { useGrant } from '@/lib/hooks/useGrant';
import { useGrants } from '@/lib/hooks/useGrants';
import { useSavedGrants } from '@/lib/hooks/useSavedGrants';
import { GrantDetail } from '@/components/GrantDetail';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/button';

function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-md hover:bg-muted"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Link2 className="h-3.5 w-3.5" />}
      <span>{copied ? 'Copied!' : 'Copy link'}</span>
    </button>
  );
}

function ApplicationChecklist({ docs }: { docs: string[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const toggle = (doc: string) => setChecked(prev => ({ ...prev, [doc]: !prev[doc] }));
  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Application Checklist</h3>
        <span className="text-xs text-muted-foreground">{doneCount}/{docs.length} ready</span>
      </div>
      <ul className="space-y-2.5">
        {docs.map((doc) => (
          <li
            key={doc}
            onClick={() => toggle(doc)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
              checked[doc]
                ? 'bg-primary border-primary'
                : 'border-border group-hover:border-primary/50'
            }`}>
              {checked[doc] && <Check className="h-3 w-3 text-primary-foreground" />}
            </div>
            <span className={`text-sm transition-colors ${
              checked[doc] ? 'line-through text-muted-foreground' : 'text-foreground'
            }`}>
              {doc}
            </span>
          </li>
        ))}
      </ul>
      {doneCount === docs.length && docs.length > 0 && (
        <p className="mt-4 text-sm text-emerald-600 font-medium">
          ✓ All documents ready — you&apos;re set to apply!
        </p>
      )}
    </div>
  );
}

function SimilarGrants({ currentId, sectors }: { currentId: string; sectors: string[] }) {
  const { grants } = useGrants();
  const similar = grants
    .filter(g => g.id !== currentId && g.eligibleSectors.some(s => sectors.includes(s)))
    .slice(0, 3);

  if (similar.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="font-semibold text-foreground mb-3">Similar Grants</h3>
      <div className="space-y-3">
        {similar.map(g => (
          <Link
            key={g.id}
            href={`/grants/${g.id}`}
            className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/20 hover:shadow-sm transition-all group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {g.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{g.agency}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}

interface GrantDetailPageProps {
  params: { id: string };
}

export default function GrantDetailPage({ params }: GrantDetailPageProps) {
  const { id } = params;
  const { grant, loading, error } = useGrant(id);
  const { savedGrants, saveGrant, removeGrant } = useSavedGrants();
  const isSaved = savedGrants.some((sg) => sg.grantId === id);
  const handleSave = async (grantId: string) => {
    if (isSaved) { await removeGrant(grantId); } else { await saveGrant(grantId); }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Breadcrumb + copy-link row */}
      <div className="flex items-center justify-between mb-6">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <span>/</span>
          <Link href="/grants" className="hover:text-foreground transition-colors">Grants</Link>
          {grant && (
            <>
              <span>/</span>
              <span className="text-foreground truncate max-w-[200px]">{grant.title}</span>
            </>
          )}
        </nav>
        <CopyLinkButton />
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => window.location.reload()}
        />
      ) : grant ? (
        <>
          <GrantDetail grant={grant} isSaved={isSaved} onSave={handleSave} />
          <ApplicationChecklist docs={grant.requiredDocs} />
          <SimilarGrants currentId={id} sectors={grant.eligibleSectors} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Grant not found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            This grant doesn&apos;t exist or is no longer available.
          </p>
          <Button asChild>
            <Link href="/grants">Browse all grants</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
