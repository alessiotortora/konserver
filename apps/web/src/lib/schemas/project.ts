import { z } from 'zod';

const coverSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('image'),
    imageId: z.string().uuid(),
    videoId: z.null(),
  }),
  z.object({
    type: z.literal('video'),
    imageId: z.null(),
    videoId: z.string().uuid(),
  }),
  z.object({
    type: z.literal('none'),
    imageId: z.null(),
    videoId: z.null(),
  }),
]);

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  year: z.number().optional(),
  tags: z.array(z.string()).optional(),
  details: z.record(z.unknown()).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  cover: coverSchema,
  images: z.array(z.string().uuid()).optional(),
  videos: z.array(z.string().uuid()).optional(),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;

export type CoverType = z.infer<typeof coverSchema>;
