'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { WorkspaceFormValues, TONE_PRESETS } from '@/lib/schemas/workspace';
import { TagInput } from './TagInput';
import { RepeatableInput } from './RepeatableInput';

export function Step2BrandKit() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<WorkspaceFormValues>();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Brand Voice */}
      <div className="form-field-block">
        <label htmlFor="ws-brand-voice" className="field-label">
          Brand Voice
        </label>
        <textarea
          id="ws-brand-voice"
          rows={3}
          placeholder="Describe your brand's personality and communication style…"
          className="field-input"
          style={{ resize: 'none' }}
          {...register('brand_voice')}
        />
      </div>

      {/* Tone Preset */}
      <div className="form-field-block">
        <label htmlFor="ws-tone-preset" className="field-label">
          Tone Preset
        </label>
        <select
          id="ws-tone-preset"
          className="field-input"
          style={{ textTransform: 'capitalize' }}
          {...register('tone_preset')}
        >
          <option value="">Select a tone…</option>
          {TONE_PRESETS.map((t) => (
            <option key={t} value={t} style={{ textTransform: 'capitalize' }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Target Audience */}
      <div className="form-field-block">
        <label htmlFor="ws-target-audience" className="field-label">
          Target Audience
        </label>
        <textarea
          id="ws-target-audience"
          rows={2}
          placeholder="Who are you speaking to? e.g. B2B decision-makers, 25–45…"
          className="field-input"
          style={{ resize: 'none' }}
          {...register('target_audience')}
        />
      </div>

      {/* Do Rules */}
      <div className="form-field-block">
        <label className="field-label">
          Do Rules{' '}
          <span style={{ color: 'var(--text-light)', fontWeight: 'normal', fontSize: '0.75rem' }}>(up to 5)</span>
        </label>
        <Controller
          name="do_rules"
          control={control}
          render={({ field }) => (
            <RepeatableInput
              value={field.value ?? []}
              onChange={field.onChange}
              maxItems={5}
              placeholder="Always be empathetic and solution-focused…"
            />
          )}
        />
      </div>

      {/* Don't Rules */}
      <div className="form-field-block">
        <label className="field-label">
          Don&apos;t Rules{' '}
          <span style={{ color: 'var(--text-light)', fontWeight: 'normal', fontSize: '0.75rem' }}>(up to 5)</span>
        </label>
        <Controller
          name="dont_rules"
          control={control}
          render={({ field }) => (
            <RepeatableInput
              value={field.value ?? []}
              onChange={field.onChange}
              maxItems={5}
              placeholder="Never make price guarantees…"
            />
          )}
        />
      </div>

      {/* Banned Words */}
      <div className="form-field-block">
        <label htmlFor="ws-banned-words" className="field-label">
          Banned Words
        </label>
        <Controller
          name="banned_words"
          control={control}
          render={({ field }) => (
            <TagInput
              id="ws-banned-words"
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder="Type a word and press Enter…"
            />
          )}
        />
      </div>

      {/* CTA Library */}
      <div className="form-field-block">
        <label htmlFor="ws-cta-library" className="field-label">
          CTA Library
        </label>
        <Controller
          name="cta_library"
          control={control}
          render={({ field }) => (
            <TagInput
              id="ws-cta-library"
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder="Learn more, Get a quote, Book now…"
            />
          )}
        />
      </div>

      {/* Default Hashtags */}
      <div className="form-field-block">
        <label htmlFor="ws-hashtags" className="field-label">
          Default Hashtags
        </label>
        <Controller
          name="default_hashtags"
          control={control}
          render={({ field }) => (
            <TagInput
              id="ws-hashtags"
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder="#brand #marketing…"
            />
          )}
        />
      </div>

      {/* Colors + Fonts row */}
      <div className="ws-field-row">
        <div className="form-field-block" style={{ marginBottom: 0 }}>
          <label htmlFor="ws-secondary-color" className="field-label">
            Secondary Color
          </label>
          <input
            id="ws-secondary-color"
            type="text"
            maxLength={7}
            placeholder="#FFFFFF"
            className="field-input"
            style={{ fontFamily: 'monospace' }}
            {...register('secondary_color')}
          />
          {errors.secondary_color && (
            <p className="ws-field-error">{errors.secondary_color.message}</p>
          )}
        </div>
        <div className="form-field-block" style={{ marginBottom: 0 }}>
          {/* Placeholder — add a color picker if needed */}
        </div>
        <div className="form-field-block" style={{ marginBottom: 0 }}>
          <label htmlFor="ws-font-primary" className="field-label">
            Primary Font
          </label>
          <input
            id="ws-font-primary"
            type="text"
            placeholder="Inter"
            className="field-input"
            {...register('font_primary')}
          />
        </div>
        <div className="form-field-block" style={{ marginBottom: 0 }}>
          <label htmlFor="ws-font-secondary" className="field-label">
            Secondary Font
          </label>
          <input
            id="ws-font-secondary"
            type="text"
            placeholder="Playfair Display"
            className="field-input"
            {...register('font_secondary')}
          />
        </div>
      </div>

      {/* Compliance Notes */}
      <div className="form-field-block">
        <label htmlFor="ws-compliance" className="field-label">
          Compliance Notes
        </label>
        <textarea
          id="ws-compliance"
          rows={3}
          placeholder="Regulatory, legal, or compliance requirements for this workspace's content…"
          className="field-input"
          style={{ resize: 'none' }}
          {...register('compliance_notes')}
        />
      </div>
    </div>
  );
}
