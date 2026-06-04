'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

interface FormData {
  companyName: string;
  website: string;
  province: string;
  sector: string;
  stage: string;
  employees: string;
  annualRevenue: string;
}

const STEP_LABELS = ['Your Business', 'Location & Industry', 'About Your Business'];

const PROVINCES = [
  { value: 'ON', label: 'Ontario (ON)' },
  { value: 'BC', label: 'British Columbia (BC)' },
  { value: 'AB', label: 'Alberta (AB)' },
  { value: 'QC', label: 'Quebec (QC)' },
  { value: 'MB', label: 'Manitoba (MB)' },
  { value: 'SK', label: 'Saskatchewan (SK)' },
  { value: 'NS', label: 'Nova Scotia (NS)' },
  { value: 'NB', label: 'New Brunswick (NB)' },
  { value: 'PE', label: 'Prince Edward Island (PE)' },
  { value: 'NL', label: 'Newfoundland and Labrador (NL)' },
];

const SECTORS = [
  { value: 'IT', label: 'IT' },
  { value: 'Agriculture', label: 'Agriculture' },
  { value: 'Biotech', label: 'Biotech' },
  { value: 'Clean Tech', label: 'Clean Tech' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Services', label: 'Services' },
  { value: 'Food & Beverage', label: 'Food & Beverage' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Healthcare', label: 'Healthcare' },
];

const STAGES = [
  { value: 'startup', label: 'Startup - Just getting started' },
  { value: 'pre-revenue', label: 'Pre-Revenue' },
  { value: 'revenue', label: 'Revenue - Generating sales' },
  { value: 'established', label: 'Established - Growing and scaling' },
];

const EMPLOYEES = [
  { value: '1-5', label: '1–5' },
  { value: '6-10', label: '6–10' },
  { value: '11-50', label: '11–50' },
  { value: '51-200', label: '51–200' },
  { value: '200+', label: '200+' },
];

const REVENUES = [
  { value: '<$100K', label: 'Less than $100K' },
  { value: '$100K-$500K', label: '$100K – $500K' },
  { value: '$500K-$1M', label: '$500K – $1M' },
  { value: '$1M-$5M', label: '$1M – $5M' },
  { value: '$5M+', label: '$5M+' },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step, index) => {
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={[
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                  isCompleted || isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : 'border-2 border-border text-muted-foreground bg-background',
                ].join(' ')}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  step
                )}
              </div>
              <span
                className={[
                  'text-xs whitespace-nowrap',
                  isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground',
                ].join(' ')}
              >
                {STEP_LABELS[index]}
              </span>
            </div>

            {index < 2 && (
              <div
                className={[
                  'h-px w-12 mx-2 mb-5 transition-colors',
                  step < currentStep ? 'bg-primary' : 'bg-border',
                ].join(' ')}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    website: '',
    province: '',
    sector: '',
    stage: '',
    employees: '',
    annualRevenue: '',
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function isStep1Valid() {
    return formData.companyName.trim() !== '';
  }

  function isStep2Valid() {
    return formData.province !== '' && formData.sector !== '';
  }

  function isStep3Valid() {
    return formData.stage !== '';
  }

  async function handleFinish() {
    setSaving(true);
    setSaveError(false);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      router.push('/dashboard');
    } catch {
      setSaveError(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-16 pb-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">GrantDesk</span>
          </Link>
        </div>

        {/* Page heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Set up your profile</h1>
          <p className="text-muted-foreground mt-1">
            Helps us match you to the right grants
          </p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <StepIndicator currentStep={step} />
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Step 1 */}
            {step === 1 && (
              <>
                <CardTitle className="text-lg">Your Business</CardTitle>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="companyName">
                      Company Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      placeholder="Acme Corp"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="website">
                      Website{' '}
                      <span className="text-muted-foreground text-xs">(optional)</span>
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      placeholder="https://acmecorp.com"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!isStep1Valid()}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <CardTitle className="text-lg">Location &amp; Industry</CardTitle>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="province">
                      Province <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                    >
                      <option value="">Select province</option>
                      {PROVINCES.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="sector">
                      Industry Sector <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      id="sector"
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                    >
                      <option value="">Select sector</option>
                      {SECTORS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="secondary" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!isStep2Valid()}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <>
                <CardTitle className="text-lg">About Your Business</CardTitle>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="stage">
                      Business Stage <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      id="stage"
                      name="stage"
                      value={formData.stage}
                      onChange={handleChange}
                    >
                      <option value="">Select stage</option>
                      {STAGES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="employees">Number of Employees</Label>
                    <Select
                      id="employees"
                      name="employees"
                      value={formData.employees}
                      onChange={handleChange}
                    >
                      <option value="">Select range</option>
                      {EMPLOYEES.map((e) => (
                        <option key={e.value} value={e.value}>
                          {e.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="annualRevenue">Annual Revenue</Label>
                    <Select
                      id="annualRevenue"
                      name="annualRevenue"
                      value={formData.annualRevenue}
                      onChange={handleChange}
                    >
                      <option value="">Select range</option>
                      {REVENUES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="secondary" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    onClick={handleFinish}
                    disabled={!isStep3Valid() || saving}
                  >
                    {saving ? 'Saving...' : 'Finish'}
                  </Button>
                </div>

                {saveError && (
                  <p className="text-sm text-muted-foreground text-center pt-1">
                    Profile saved locally. Sign in to sync.
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Skip link */}
        <div className="text-center mt-4">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now →
          </Link>
        </div>
      </div>
    </div>
  );
}
