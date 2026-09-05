'use client';

import { useFormContext } from 'react-hook-form';
import { WorkspaceFormValues, LANGUAGES, LANGUAGE_LABELS } from '@/lib/schemas/workspace';
import { Info } from 'lucide-react';

export function Step3Setup() {
  const {
    register,
    formState: { errors },
  } = useFormContext<WorkspaceFormValues>();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Website URL */}
      <div className="form-field-block">
        <label htmlFor="ws-website-url" className="field-label">
          Website URL
        </label>
        <input
          id="ws-website-url"
          type="url"
          placeholder="https://example.com"
          className="field-input"
          style={errors.website_url ? { borderColor: 'var(--status-failed)', backgroundColor: 'var(--status-failed-bg)' } : {}}
          {...register('website_url')}
        />
        {errors.website_url && (
          <p className="ws-field-error">{errors.website_url.message}</p>
        )}
      </div>

      {/* Google Drive Folder ID */}
      <div className="form-field-block">
        <label htmlFor="ws-drive-folder" className="field-label">
          Google Drive Folder ID
        </label>
        <input
          id="ws-drive-folder"
          type="text"
          placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
          className="field-input"
          style={{ fontFamily: 'monospace' }}
          {...register('drive_folder_id')}
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>
          Found in the Google Drive URL after /folders/
        </p>
      </div>

      {/* Default Content Language */}
      <div className="form-field-block">
        <label htmlFor="ws-language" className="field-label">
          Default Content Language
        </label>
        <select
          id="ws-language"
          className="field-input"
          {...register('default_language')}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {LANGUAGE_LABELS[lang]}
            </option>
          ))}
        </select>
      </div>

      {/* Info callout */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--status-info-bg)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
        <Info size={16} color="var(--status-info)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '0.75rem', color: '#1e40af', lineHeight: 1.5, margin: 0 }}>
          These settings can all be changed later from the workspace settings page.
          You can click <strong>Skip for now</strong> to create the workspace without these.
        </p>
      </div>
    </div>
  );
}
