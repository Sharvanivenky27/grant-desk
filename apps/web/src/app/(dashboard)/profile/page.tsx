'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useProfile, type UpsertProfileData } from '@/lib/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PROVINCES = ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'PE', 'NL'];
const SECTORS = ['IT', 'Agriculture', 'Biotech', 'Clean Tech', 'Manufacturing', 'Retail', 'Services', 'Food & Beverage', 'Construction', 'Healthcare'];
const STAGES = [
  { value: 'startup', label: 'Startup - Just getting started' },
  { value: 'pre-revenue', label: 'Pre-Revenue - Building product, no sales yet' },
  { value: 'revenue', label: 'Revenue - Generating sales' },
  { value: 'established', label: 'Established - Growing and scaling' },
];
const REVENUES = ['<$100K', '$100K-$500K', '$500K-$1M', '$1M-$5M', '$5M+'];
const EMPLOYEES = ['1-5', '6-10', '11-50', '51-200', '200+'];
const LEGAL_STRUCTURES = ['Sole Proprietor', 'Partnership', 'Corporation', 'Cooperative'];

const REQUIRED_FIELDS: (keyof UpsertProfileData)[] = [
  'companyName', 'province', 'sector', 'stage', 'employees', 'annualRevenue', 'legalStructure',
];

function ProfileCompletionBar({ formData }: { formData: UpsertProfileData }) {
  const filled = REQUIRED_FIELDS.filter((f) => !!formData[f]).length;
  const percent = Math.round((filled / REQUIRED_FIELDS.length) * 100);
  const isComplete = filled === REQUIRED_FIELDS.length;

  return (
    <div className="mb-6 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          Profile completion
        </span>
        <span className={`text-sm font-semibold ${isComplete ? 'text-emerald-600' : 'text-primary'}`}>
          {percent}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${isComplete ? 'bg-emerald-500' : 'bg-primary'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {!isComplete && (
        <p className="mt-2 text-xs text-muted-foreground">
          Fill in {REQUIRED_FIELDS.length - filled} more required field{REQUIRED_FIELDS.length - filled !== 1 ? 's' : ''} to unlock better grant matching.
        </p>
      )}
      {isComplete && (
        <p className="mt-2 text-xs text-emerald-600">
          Your profile is complete. You&apos;re getting the best grant matches.
        </p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { profile, loading, error, saving, updateProfile, refetch } = useProfile();
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  // Track whether any save has been attempted so we don't replace the form
  // with a full-page error block when a save fails (profile would still be null).
  const [saveAttempted, setSaveAttempted] = useState(false);
  const [formData, setFormData] = useState<UpsertProfileData>({
    companyName: '',
    province: '',
    sector: '',
    stage: '',
    employees: '',
    annualRevenue: '',
    legalStructure: '',
    website: '',
    description: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        companyName: profile.companyName || '',
        province: profile.province || '',
        sector: profile.sector || '',
        stage: profile.stage || '',
        employees: profile.employees?.toString() || '',
        annualRevenue: profile.annualRevenue || '',
        legalStructure: profile.legalStructure || '',
        website: profile.website || '',
        description: profile.description || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 3000);
    return () => clearTimeout(timer);
  }, [saved]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaved(false);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaved(false);
    setSaveAttempted(true);
    try {
      await updateProfile(formData);
      setSaved(true);
    } catch (err) {
      setFormError('Failed to save profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-2xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-72 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-muted rounded-lg animate-pulse" />
            <div className="h-64 bg-muted rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile && !saveAttempted) {
    return (
      <div className="p-6 lg:p-8 max-w-2xl">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-start gap-3 p-6">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-foreground">Error loading profile</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
              <Button variant="link" onClick={refetch} className="text-destructive p-0 h-auto mt-2">
                Try again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Business Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete your profile to get matched to grants you qualify for.
        </p>
      </div>

      {/* Profile completion */}
      <ProfileCompletionBar formData={formData} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Info Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Basic details about your business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name <span className="text-destructive">*</span></Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://acmecorp.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your company..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Details Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Business Details</CardTitle>
            <CardDescription>
              Information about your business operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="province">Province <span className="text-destructive">*</span></Label>
                <Select
                  id="province"
                  name="province"
                  required
                  value={formData.province}
                  onChange={handleChange}
                >
                  <option value="">Select province</option>
                  {PROVINCES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Industry Sector <span className="text-destructive">*</span></Label>
                <Select
                  id="sector"
                  name="sector"
                  required
                  value={formData.sector}
                  onChange={handleChange}
                >
                  <option value="">Select sector</option>
                  {SECTORS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Business Stage <span className="text-destructive">*</span></Label>
                <Select
                  id="stage"
                  name="stage"
                  required
                  value={formData.stage}
                  onChange={handleChange}
                >
                  <option value="">Select stage</option>
                  {STAGES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employees">Number of Employees <span className="text-destructive">*</span></Label>
                <Select
                  id="employees"
                  name="employees"
                  required
                  value={formData.employees}
                  onChange={handleChange}
                >
                  <option value="">Select range</option>
                  {EMPLOYEES.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualRevenue">Annual Revenue <span className="text-destructive">*</span></Label>
                <Select
                  id="annualRevenue"
                  name="annualRevenue"
                  required
                  value={formData.annualRevenue}
                  onChange={handleChange}
                >
                  <option value="">Select range</option>
                  {REVENUES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalStructure">Legal Structure <span className="text-destructive">*</span></Label>
                <Select
                  id="legalStructure"
                  name="legalStructure"
                  required
                  value={formData.legalStructure}
                  onChange={handleChange}
                >
                  <option value="">Select structure</option>
                  {LEGAL_STRUCTURES.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button type="submit" disabled={saving} size="lg" className="gap-2">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Profile
              </>
            )}
          </Button>

          {saved && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Profile saved successfully</span>
            </div>
          )}

          {formError && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{formError}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
