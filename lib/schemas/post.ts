import { z } from 'zod';

export const CAPTION_LIMITS = {
  instagram: 2200,
  facebook: 63206,
  linkedin: 3000,
  youtube_description: 5000,
  youtube_title: 100,
};

export const PostVariantSchema = z.object({
  platform: z.enum(['facebook', 'instagram', 'linkedin', 'youtube', 'tiktok']),
  title: z.string().optional(),        // YouTube only — distinct required Title field
  caption: z.string().optional(),
  media_urls: z.array(z.string().url()).default([]),
  scheduled_at: z.string().datetime().optional()
}).superRefine((data, ctx) => {
  // Common scheduled_at validation
  if (data.scheduled_at) {
    if (new Date(data.scheduled_at) < new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'scheduled_at must not be in the past',
        path: ['scheduled_at']
      });
    }
  }

  // Instagram validation — media required, caption capped at 2,200 chars
  if (data.platform === 'instagram') {
    if (!data.media_urls || data.media_urls.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Instagram variants MUST have at least one media_url',
        path: ['media_urls']
      });
    }
    if (data.caption && data.caption.length > CAPTION_LIMITS.instagram) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Instagram caption max length is ${CAPTION_LIMITS.instagram.toLocaleString()} chars`,
        path: ['caption']
      });
    }
  }

  // Facebook validation — caption capped at 63,206 chars; media optional
  if (data.platform === 'facebook') {
    if (data.caption && data.caption.length > CAPTION_LIMITS.facebook) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Facebook caption max length is ${CAPTION_LIMITS.facebook.toLocaleString()} chars`,
        path: ['caption']
      });
    }
  }

  // LinkedIn validation — caption capped at 3,000 chars; media optional
  if (data.platform === 'linkedin') {
    if (data.caption && data.caption.length > CAPTION_LIMITS.linkedin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `LinkedIn caption max length is ${CAPTION_LIMITS.linkedin.toLocaleString()} chars`,
        path: ['caption']
      });
    }
  }

  // YouTube validation — title required (max 100), media required, description capped at 5,000 chars
  if (data.platform === 'youtube') {
    if (!data.title || data.title.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'YouTube variants MUST have a non-empty title',
        path: ['title']
      });
    }
    if (data.title && data.title.length > CAPTION_LIMITS.youtube_title) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `YouTube title max length is ${CAPTION_LIMITS.youtube_title} chars`,
        path: ['title']
      });
    }
    if (!data.media_urls || data.media_urls.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'YouTube variants MUST have at least one media_url (video)',
        path: ['media_urls']
      });
    }
    if (data.caption && data.caption.length > CAPTION_LIMITS.youtube_description) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `YouTube description max length is ${CAPTION_LIMITS.youtube_description.toLocaleString()} chars`,
        path: ['caption']
      });
    }
  }

  // TikTok validation — video required (publishing goes through Buffer)
  if (data.platform === 'tiktok') {
    if (!data.media_urls || data.media_urls.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'TikTok variants MUST have at least one media_url (video)',
        path: ['media_urls']
      });
    }
  }
});

export type PostVariant = z.infer<typeof PostVariantSchema>;
