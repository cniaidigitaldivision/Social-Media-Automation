import { z } from 'zod';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const INDUSTRIES = [
  'retail',
  'real_estate',
  'healthcare',
  'education',
  'food_beverage',
  'professional_services',
  'automotive',
  'travel',
  'fitness',
  'technology',
  'other',
] as const;

export const INDUSTRY_LABELS: Record<(typeof INDUSTRIES)[number], string> = {
  retail: 'Retail',
  real_estate: 'Real Estate',
  healthcare: 'Healthcare',
  education: 'Education',
  food_beverage: 'Food & Beverage',
  professional_services: 'Professional Services',
  automotive: 'Automotive',
  travel: 'Travel',
  fitness: 'Fitness',
  technology: 'Technology',
  other: 'Other',
};

export const TONE_PRESETS = [
  'professional',
  'casual',
  'playful',
  'authoritative',
] as const;

export const LANGUAGES = ['en', 'ur', 'ar'] as const;
export const LANGUAGE_LABELS: Record<(typeof LANGUAGES)[number], string> = {
  en: 'English',
  ur: 'Urdu',
  ar: 'Arabic',
};

export const MEMBER_ROLES = ['admin', 'strategist', 'designer', 'viewer'] as const;

// ---------------------------------------------------------------------------
// Step 1 — Business
// ---------------------------------------------------------------------------

export const step1Schema = z.object({
  name: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(80, 'Business name must be 80 characters or fewer'),

  // Logo is handled as File on the client but the resolved values sent to API are strings
  logo_url: z.string().url().optional().or(z.literal('')),
  logo_path: z.string().optional().or(z.literal('')),

  brand_color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6})$/, 'Must be a valid hex color, e.g. #0F5132')
    .default('#0F5132'),

  industry: z.enum(INDUSTRIES).optional(),

  country_code: z.string().length(2).default('PK'),

  timezone: z.string().min(1, 'Timezone is required').default('Asia/Karachi'),

  owner_id: z.string().uuid('Must be a valid user ID').optional().or(z.literal('')),

  requires_approval: z.boolean().default(true),
});

export type Step1Values = z.infer<typeof step1Schema>;

// ---------------------------------------------------------------------------
// Step 2 — Brand Kit (all optional)
// ---------------------------------------------------------------------------

const maxFiveStrings = z
  .array(z.string().max(200))
  .max(5)
  .optional()
  .default([])
  .transform(arr => arr.filter(s => s.trim().length > 0));

const tagArray = z.array(z.string().max(100)).optional().default([]).transform(arr => arr.filter(s => s.trim().length > 0));

export const step2Schema = z.object({
  brand_voice: z.string().max(2000).optional().or(z.literal('')),
  tone_preset: z.enum(TONE_PRESETS).optional().or(z.literal('').transform(() => undefined)),
  target_audience: z.string().max(2000).optional().or(z.literal('')),
  do_rules: maxFiveStrings,
  dont_rules: maxFiveStrings,
  banned_words: tagArray,
  cta_library: tagArray,
  default_hashtags: tagArray,
  secondary_color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6})$/, 'Must be a valid hex color')
    .optional()
    .or(z.literal('')),
  font_primary: z.string().max(100).optional().or(z.literal('')),
  font_secondary: z.string().max(100).optional().or(z.literal('')),
  compliance_notes: z.string().max(3000).optional().or(z.literal('')),
});

export type Step2Values = z.infer<typeof step2Schema>;

// ---------------------------------------------------------------------------
// Step 3 — Optional Setup
// ---------------------------------------------------------------------------

export const step3Schema = z.object({
  website_url: z
    .string()
    .url('Must be a valid URL, e.g. https://example.com')
    .optional()
    .or(z.literal('')),
  drive_folder_id: z.string().max(200).optional().or(z.literal('')),
  default_language: z.enum(LANGUAGES).default('en'),
});

export type Step3Values = z.infer<typeof step3Schema>;

// ---------------------------------------------------------------------------
// Full form schema (client — composed)
// ---------------------------------------------------------------------------

export const workspaceFormSchema = step1Schema.merge(step2Schema).merge(step3Schema);
export type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>;

// ---------------------------------------------------------------------------
// API schema (what POST /api/workspaces validates server-side)
// Differs from the form schema: no File objects, has resolved logo_path/url
// ---------------------------------------------------------------------------

export const createWorkspaceApiSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .extend({
    // These come back from the client after the client-side upload
    logo_url: z.string().url().optional().or(z.literal('').transform(() => undefined)),
    logo_path: z.string().optional().or(z.literal('').transform(() => undefined)),
  });

export type CreateWorkspaceApiPayload = z.infer<typeof createWorkspaceApiSchema>;
