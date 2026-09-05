import { z } from 'zod';

export const CAPTION_LIMITS = {
  instagram: 2200,
  facebook: 63206,
};

export const PostVariantSchema = z.object({
  platform: z.enum(['facebook', 'instagram']),
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

  // Instagram validation
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

  // Facebook validation
  if (data.platform === 'facebook') {
    if (data.caption && data.caption.length > CAPTION_LIMITS.facebook) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Facebook caption max length is ${CAPTION_LIMITS.facebook.toLocaleString()} chars`,
        path: ['caption']
      });
    }
  }
});

export type PostVariant = z.infer<typeof PostVariantSchema>;
