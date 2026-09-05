'use client';

import { useRef, useState, useCallback, DragEvent } from 'react';
import { Upload, ImageIcon, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

export interface UploadedLogo {
  path: string;
  publicUrl: string;
  previewUrl: string; // local object URL for preview
}

interface LogoUploaderProps {
  slug: string; // used for the storage path
  brandColor: string; // used for initials fallback background
  nameInitials: string; // used for avatar fallback
  value: UploadedLogo | null;
  onChange: (logo: UploadedLogo | null) => void;
  onError: (msg: string) => void;
}

/**
 * Drag-and-drop / click-to-upload logo uploader.
 *
 * Upload flow:
 *  1. User selects a file (drag-drop or click)
 *  2. Client validates MIME + size
 *  3. File is uploaded directly to Supabase Storage bucket 'workspace-logos'
 *  4. Resolved { path, publicUrl } is passed up to the form via onChange
 *
 * The parent is responsible for deleting the uploaded object if the API call fails.
 */
export function LogoUploader({
  slug,
  brandColor,
  nameInitials,
  value,
  onChange,
  onError,
}: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      // ── Client-side validation ──────────────────────────────────────────
      if (!ALLOWED_TYPES.includes(file.type)) {
        onError(`Unsupported file type. Allowed: PNG, JPG, WEBP, SVG.`);
        return;
      }
      if (file.size > MAX_BYTES) {
        onError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 2 MB.`);
        return;
      }

      // Generate a local preview URL immediately (no upload yet)
      const previewUrl = URL.createObjectURL(file);

      // ── Upload to Supabase Storage ──────────────────────────────────────
      setIsUploading(true);
      onError('');

      try {
        const supabase = createClient();
        const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png';
        const storagePath = `${slug || 'workspace'}-${Date.now()}.${ext}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('workspace-logos')
          .upload(storagePath, file, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError || !uploadData) {
          throw new Error(uploadError?.message ?? 'Upload failed');
        }

        const { data: urlData } = supabase.storage
          .from('workspace-logos')
          .getPublicUrl(uploadData.path);

        onChange({
          path: uploadData.path,
          publicUrl: urlData.publicUrl,
          previewUrl,
        });
      } catch (err: unknown) {
        URL.revokeObjectURL(previewUrl);
        const msg = err instanceof Error ? err.message : 'Logo upload failed.';
        onError(msg);
      } finally {
        setIsUploading(false);
      }
    },
    [slug, onChange, onError]
  );

  const removeLogo = async () => {
    if (!value) return;

    // Revoke local preview
    URL.revokeObjectURL(value.previewUrl);

    // Delete from Storage
    try {
      const supabase = createClient();
      await supabase.storage.from('workspace-logos').remove([value.path]);
    } catch (err) {
      console.warn('Logo cleanup error:', err);
    }

    onChange(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so the same file can be re-selected after removal
    e.target.value = '';
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
      {/* Live circular avatar preview — matches workspace-avatar-badge size + shape */}
      <div
        className="ws-logo-preview"
        style={
          !value
            ? { backgroundColor: brandColor || 'var(--cni-teal-primary)', borderColor: 'transparent' }
            : {}
        }
      >
        {value ? (
          <img
            src={value.previewUrl}
            alt="Logo preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span
            style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.125rem', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-hidden
          >
            {nameInitials || '?'}
          </span>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Drop zone */}
        {!value ? (
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload logo"
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            className={`ws-logo-dropzone ${isDragging ? 'is-dragging' : ''}`}
          >
            {isUploading ? (
              <>
                <div style={{ width: '1.25rem', height: '1.25rem', border: '2px solid var(--cni-teal-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Uploading…</span>
              </>
            ) : (
              <>
                <Upload size={20} color="var(--text-light)" />
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                  Drag & drop or <span style={{ color: 'var(--cni-teal-primary)', textDecoration: 'underline' }}>browse</span>
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                  PNG, JPG, WEBP, SVG · Max 2 MB
                </span>
              </>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
            <ImageIcon size={16} color="#16a34a" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 500, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>
              Logo uploaded ✓
            </span>
            <button
              type="button"
              onClick={removeLogo}
              style={{ padding: '2px', borderRadius: '4px', background: 'transparent', border: 'none', color: '#16a34a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#dcfce7'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              aria-label="Remove logo"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_EXTENSIONS.join(',')}
          style={{ display: 'none' }}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}

/**
 * Delete an uploaded logo from Storage.
 * Call this when the workspace creation API fails to avoid orphaned files.
 */
export async function deleteLogo(path: string) {
  try {
    const supabase = createClient();
    await supabase.storage.from('workspace-logos').remove([path]);
  } catch (err) {
    console.warn('[deleteLogo] cleanup failed:', err);
  }
}
