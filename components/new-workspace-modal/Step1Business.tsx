'use client';

import { useEffect, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { WorkspaceFormValues, INDUSTRIES, INDUSTRY_LABELS } from '@/lib/schemas/workspace';
import { LogoUploader, type UploadedLogo } from './LogoUploader';

// Country list (abbreviated; expand as needed)
const COUNTRIES: { code: string; label: string; tz: string }[] = [
  { code: 'PK', label: 'Pakistan', tz: 'Asia/Karachi' },
  { code: 'US', label: 'United States', tz: 'America/New_York' },
  { code: 'GB', label: 'United Kingdom', tz: 'Europe/London' },
  { code: 'AE', label: 'United Arab Emirates', tz: 'Asia/Dubai' },
  { code: 'SA', label: 'Saudi Arabia', tz: 'Asia/Riyadh' },
  { code: 'IN', label: 'India', tz: 'Asia/Kolkata' },
  { code: 'CA', label: 'Canada', tz: 'America/Toronto' },
  { code: 'AU', label: 'Australia', tz: 'Australia/Sydney' },
  { code: 'DE', label: 'Germany', tz: 'Europe/Berlin' },
  { code: 'FR', label: 'France', tz: 'Europe/Paris' },
  { code: 'SG', label: 'Singapore', tz: 'Asia/Singapore' },
];

const TIMEZONE_MAP: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c.tz])
);

// Placeholder users list — replace with real API fetch when auth is wired
const MOCK_USERS = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Sarah Jenkins' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'David Kim' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Aisha Malik' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'Raza Ahmed' },
];

export function Step1Business() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<WorkspaceFormValues>();

  const [uploadError, setUploadError] = useState('');
  const [uploadedLogo, setUploadedLogo] = useState<UploadedLogo | null>(null);

  const name = watch('name') ?? '';
  const countryCode = watch('country_code') ?? 'PK';
  const brandColor = watch('brand_color') ?? '#0F5132';

  // Auto-derive initials from workspace name
  const nameInitials = name
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Auto-suggest timezone when country changes
  useEffect(() => {
    const tz = TIMEZONE_MAP[countryCode];
    if (tz) setValue('timezone', tz, { shouldValidate: false });
  }, [countryCode, setValue]);

  // Sync uploaded logo into form
  const handleLogoChange = (logo: UploadedLogo | null) => {
    setUploadedLogo(logo);
    setValue('logo_url', logo?.publicUrl ?? '', { shouldValidate: false });
    setValue('logo_path', logo?.path ?? '', { shouldValidate: false });
  };

  // Slug preview (read-only)
  const slugPreview = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Business Name */}
      <div className="form-field-block">
        <label htmlFor="ws-name" className="field-label">
          Business Name <span style={{ color: 'var(--status-failed)' }}>*</span>
        </label>
        <input
          id="ws-name"
          type="text"
          autoFocus
          maxLength={80}
          placeholder="e.g. Acme Corp"
          className="field-input"
          style={errors.name ? { borderColor: 'var(--status-failed)', backgroundColor: 'var(--status-failed-bg)' } : {}}
          {...register('name')}
        />
        {errors.name && (
          <p className="ws-field-error">{errors.name.message}</p>
        )}
        {slugPreview && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Slug: <code style={{ fontFamily: 'monospace', color: 'var(--cni-teal-primary)', backgroundColor: 'var(--cni-teal-light)', padding: '2px 6px', borderRadius: '4px' }}>{slugPreview}</code>
          </p>
        )}
      </div>

      {/* Logo Upload */}
      <div className="form-field-block">
        <label className="field-label">
          Logo <span style={{ color: 'var(--text-light)', fontWeight: 'normal', marginLeft: '4px' }}>(optional)</span>
        </label>
        <LogoUploader
          slug={slugPreview}
          brandColor={brandColor}
          nameInitials={nameInitials}
          value={uploadedLogo}
          onChange={handleLogoChange}
          onError={setUploadError}
        />
        {uploadError && (
          <p className="ws-field-error">{uploadError}</p>
        )}
      </div>

      {/* Brand Color */}
      <div className="form-field-block">
        <label htmlFor="ws-brand-color" className="field-label">
          Brand Color
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Controller
            name="brand_color"
            control={control}
            render={({ field }) => (
              <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, width: '2.75rem', height: '2.75rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <input
                  id="ws-brand-color-picker"
                  type="color"
                  value={field.value}
                  onChange={field.onChange}
                  style={{ position: 'absolute', top: '-8px', left: '-8px', width: '4rem', height: '4rem', cursor: 'pointer', border: 0, padding: 0 }}
                />
              </div>
            )}
          />
          <input
            id="ws-brand-color"
            type="text"
            maxLength={7}
            placeholder="#0F5132"
            className="field-input"
            style={{ fontFamily: 'monospace', flex: 1, ...(errors.brand_color ? { borderColor: 'var(--status-failed)', backgroundColor: 'var(--status-failed-bg)' } : {}) }}
            {...register('brand_color')}
          />
        </div>
        {errors.brand_color && (
          <p className="ws-field-error">{errors.brand_color.message}</p>
        )}
      </div>

      {/* Industry */}
      <div className="form-field-block">
        <label htmlFor="ws-industry" className="field-label">
          Industry
        </label>
        <select
          id="ws-industry"
          className="field-input"
          {...register('industry')}
        >
          <option value="">Select an industry…</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>
              {INDUSTRY_LABELS[ind]}
            </option>
          ))}
        </select>
      </div>

      {/* Country + Timezone — side by side */}
      <div className="ws-field-row">
        <div className="form-field-block" style={{ marginBottom: 0 }}>
          <label htmlFor="ws-country" className="field-label">
            Country
          </label>
          <select
            id="ws-country"
            className="field-input"
            {...register('country_code')}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field-block" style={{ marginBottom: 0 }}>
          <label htmlFor="ws-timezone" className="field-label">
            Timezone
          </label>
          <input
            id="ws-timezone"
            type="text"
            className="field-input"
            style={errors.timezone ? { borderColor: 'var(--status-failed)' } : {}}
            {...register('timezone')}
          />
          {errors.timezone && (
            <p className="ws-field-error">{errors.timezone.message}</p>
          )}
        </div>
      </div>

      {/* Owner */}
      <div className="form-field-block">
        <label htmlFor="ws-owner" className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Owner
          <span style={{ color: 'var(--text-light)', fontWeight: 'normal', fontSize: '0.75rem', backgroundColor: 'var(--bg-hover)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
            Receives publish alerts
          </span>
        </label>
        <select
          id="ws-owner"
          className="field-input"
          style={errors.owner_id ? { borderColor: 'var(--status-failed)' } : {}}
          {...register('owner_id')}
        >
          <option value="">Select an owner…</option>
          {MOCK_USERS.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        {errors.owner_id && (
          <p className="ws-field-error">{errors.owner_id.message}</p>
        )}
      </div>

      {/* Requires Approval Toggle */}
      <div className="approval-toggle-wrapper" style={{ marginTop: '0.5rem', padding: '1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ paddingRight: '1rem' }}>
          <p className="toggle-label-text" style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)', fontSize: '0.875rem' }}>Requires approval before publishing</p>
          <p className="toggle-state-text" style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            All posts must be explicitly approved by a team member before they go live.
          </p>
        </div>
        <Controller
          name="requires_approval"
          control={control}
          render={({ field }) => (
            <button
              id="ws-approval-toggle"
              type="button"
              role="switch"
              aria-checked={field.value}
              onClick={() => field.onChange(!field.value)}
              className={`custom-toggle-switch ${field.value ? 'checked' : ''}`}
            >
              <span className="sr-only">Toggle approval requirement</span>
              <span className="toggle-knob" />
            </button>
          )}
        />
      </div>
    </div>
  );
}
