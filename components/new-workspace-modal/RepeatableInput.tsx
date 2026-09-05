'use client';

import { Plus, Trash2 } from 'lucide-react';

interface RepeatableInputProps {
  value: string[];
  onChange: (values: string[]) => void;
  maxItems?: number;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * A list of text inputs that the user can add/remove.
 * Used for Do rules, Don't rules (max 5 each).
 */
export function RepeatableInput({
  value,
  onChange,
  maxItems = 5,
  placeholder = 'Add a rule…',
  disabled,
}: RepeatableInputProps) {
  const updateAt = (idx: number, text: string) => {
    const next = [...value];
    next[idx] = text;
    onChange(next);
  };

  const removeAt = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const addRow = () => {
    if (value.length >= maxItems) return;
    onChange([...value, '']);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {value.map((item, idx) => (
        <div key={idx} className="ws-repeatable-row">
          <input
            type="text"
            value={item}
            onChange={(e) => updateAt(idx, e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="field-input"
            style={{ marginBottom: 0 }}
          />
          <button
            type="button"
            onClick={() => removeAt(idx)}
            disabled={disabled}
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-light)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = 'var(--status-failed)'; e.currentTarget.style.backgroundColor = 'var(--status-failed-bg)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-light)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            aria-label="Remove rule"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      {value.length < maxItems && (
        <button
          type="button"
          onClick={addRow}
          disabled={disabled}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--cni-teal-primary)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0',
            alignSelf: 'flex-start'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--cni-teal-hover)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--cni-teal-primary)'}
        >
          <Plus size={14} />
          Add rule
        </button>
      )}
    </div>
  );
}
