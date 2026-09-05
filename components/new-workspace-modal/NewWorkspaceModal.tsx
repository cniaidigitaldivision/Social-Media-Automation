'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { X, ChevronRight, ChevronLeft, SkipForward, Loader2 } from 'lucide-react';

import {
  step1Schema,
  step2Schema,
  step3Schema,
  workspaceFormSchema,
  type WorkspaceFormValues,
} from '@/lib/schemas/workspace';
import { Step1Business } from './Step1Business';
import { Step2BrandKit } from './Step2BrandKit';
import { Step3Setup } from './Step3Setup';
import { deleteLogo } from './LogoUploader';

// ── Step metadata ─────────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Business', description: 'Basic workspace info' },
  { label: 'Brand Kit', description: 'Voice, tone & content rules' },
  { label: 'Setup', description: 'Integrations & language' },
] as const;

type StepIndex = 0 | 1 | 2;

// Schema resolver per step (for validation on Next)
const stepSchemas = [step1Schema, step2Schema, step3Schema] as const;

// ── Default values ────────────────────────────────────────────────────────────
const DEFAULT_VALUES: Partial<WorkspaceFormValues> = {
  brand_color: '#0F5132',
  country_code: 'PK',
  timezone: 'Asia/Karachi',
  requires_approval: true,
  default_language: 'en',
  do_rules: [],
  dont_rules: [],
  banned_words: [],
  cta_library: [],
  default_hashtags: [],
};

// ── Props ─────────────────────────────────────────────────────────────────────
interface NewWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called with the new workspace data after a successful creation */
  onSuccess: (workspace: { id: string; name: string; slug: string; logo_url: string | null }) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function NewWorkspaceModal({ isOpen, onClose, onSuccess }: NewWorkspaceModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<StepIndex>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  // Track the uploaded logo path so we can delete it on API failure
  const uploadedLogoPathRef = useRef<string | null>(null);

  const methods = useForm<WorkspaceFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(workspaceFormSchema) as any,
    defaultValues: DEFAULT_VALUES as WorkspaceFormValues,
    mode: 'onTouched',
  });

  const { handleSubmit, trigger, watch, formState: { isDirty } } = methods;
  const logoPath = watch('logo_path');

  // Keep the ref in sync with the form value
  useEffect(() => {
    uploadedLogoPathRef.current = logoPath || null;
  }, [logoPath]);

  // Confirm before closing if form is dirty
  const requestClose = useCallback(() => {
    if (isDirty) {
      const ok = window.confirm(
        'You have unsaved changes. Are you sure you want to close the wizard?'
      );
      if (!ok) return;
    }
    // Cleanup any uploaded logo before abandoning
    if (uploadedLogoPathRef.current) {
      deleteLogo(uploadedLogoPathRef.current);
    }
    methods.reset(DEFAULT_VALUES);
    setStep(0);
    setApiError('');
    onClose();
  }, [isDirty, methods, onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, requestClose]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goNext = async () => {
    // Validate only the current step's fields
    const schema = stepSchemas[step];
    const fields = Object.keys(schema.shape) as (keyof WorkspaceFormValues)[];
    const valid = await trigger(fields);
    if (!valid) return;
    setStep((prev) => Math.min(prev + 1, 2) as StepIndex);
  };

  const goPrev = () => {
    setStep((prev) => Math.max(prev - 1, 0) as StepIndex);
  };

  // ── Form submission ────────────────────────────────────────────────────────
  const submitForm = async (values: WorkspaceFormValues) => {
    setIsSubmitting(true);
    setApiError('');

    // Build API payload (File objects stripped out; logo is already uploaded)
    const payload = {
      ...values,
      // Clean up empty strings
      logo_url: values.logo_url || undefined,
      logo_path: values.logo_path || undefined,
      owner_id: values.owner_id || undefined,
      website_url: values.website_url || undefined,
      drive_folder_id: values.drive_folder_id || undefined,
    };

    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));

        // If API failed AFTER logo upload, clean up the orphaned file
        if (payload.logo_path) {
          await deleteLogo(payload.logo_path);
          methods.setValue('logo_path', '');
          methods.setValue('logo_url', '');
          uploadedLogoPathRef.current = null;
        }

        if (res.status === 409) {
          setApiError('A workspace with this name already exists.');
        } else if (res.status === 400 && body.fieldErrors) {
          // Surface field-level errors back into the form
          Object.entries(body.fieldErrors as Record<string, string[]>).forEach(([field, msgs]) => {
            methods.setError(field as keyof WorkspaceFormValues, { message: msgs[0] });
          });
          setApiError('Please correct the errors highlighted above.');
          // Jump back to step 1 for field errors
          setStep(0);
        } else {
          setApiError(body.error || 'Something went wrong. Please try again.');
        }
        return;
      }

      const created = await res.json();

      // ── Success ────────────────────────────────────────────────────────────
      onSuccess(created);
      methods.reset(DEFAULT_VALUES);
      setStep(0);
      setApiError('');
      onClose();
      router.push(`/workspaces/${created.id}/accounts`);
    } catch (err) {
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // "Skip for now" on steps 2 and 3 — submits the form as-is
  const handleSkip = () => {
    handleSubmit(submitForm)();
  };

  if (!isOpen) return null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="modal-backdrop">
      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ws-modal-title"
        className="modal-dialog modal-lg ws-wizard-dialog"
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="modal-header">
          <div>
            <h2 id="ws-modal-title" className="modal-title">
              Add New Workspace
            </h2>
            <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '4px' }}>
              {STEPS[step].description}
            </p>
          </div>
          <button
            type="button"
            onClick={requestClose}
            className="modal-close-btn"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Step Indicator ──────────────────────────────────────────────── */}
        <div className="ws-stepper">
          {STEPS.map((s, idx) => {
            const isActive = idx === step;
            const isDone = idx < step;
            let stepClass = "ws-step";
            if (isActive) stepClass += " is-active";
            if (isDone) stepClass += " is-done";

            return (
              <div key={idx} className={stepClass}>
                <div className="ws-step-circle">
                  {isDone ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <span className="ws-step-label">{s.label}</span>
                {idx < STEPS.length - 1 && <div className="ws-step-line" />}
              </div>
            );
          })}
        </div>

        {/* ── Form Body ───────────────────────────────────────────────────── */}
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(submitForm)}
            style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
          >
            <div className="ws-wizard-body">
              {/* API-level error banner */}
              {apiError && (
                <div className="ws-error-banner">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p>{apiError}</p>
                </div>
              )}

              {step === 0 && <Step1Business />}
              {step === 1 && <Step2BrandKit />}
              {step === 2 && <Step3Setup />}
            </div>

            {/* ── Footer ──────────────────────────────────────────────────── */}
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={isSubmitting}
                    className="btn-secondary-outline"
                  >
                    <ChevronLeft size={16} style={{ marginRight: '4px' }} />
                    Back
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {/* Skip for now — steps 2 and 3 only */}
                {step > 0 && (
                  <button
                    type="button"
                    id={`ws-skip-step-${step + 1}`}
                    onClick={handleSkip}
                    disabled={isSubmitting}
                    className="btn-secondary-outline"
                    style={{ border: 'transparent' }}
                  >
                    <SkipForward size={14} style={{ marginRight: '4px' }} />
                    Skip for now
                  </button>
                )}

                {step < 2 ? (
                  <button
                    type="button"
                    id={`ws-next-step-${step + 1}`}
                    onClick={goNext}
                    disabled={isSubmitting}
                    className="btn-primary-teal"
                  >
                    Next
                    <ChevronRight size={16} style={{ marginLeft: '4px' }} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    id="ws-create-workspace"
                    disabled={isSubmitting}
                    className="btn-primary-teal"
                  >
                    {isSubmitting ? (
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <Loader2 size={16} style={{ marginRight: '4px', animation: 'spin 1s linear infinite' }} />
                        Creating…
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        Create Workspace
                        <ChevronRight size={16} style={{ marginLeft: '4px' }} />
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
