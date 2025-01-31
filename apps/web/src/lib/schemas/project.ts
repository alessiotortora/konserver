import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  year: z.number().optional(),
  tags: z.array(z.string()).optional(),
  details: z.record(z.unknown()).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  coverImageId: z.string().uuid().optional().nullable(),
  coverVideoId: z.string().uuid().optional().nullable(),
  images: z.array(z.string().uuid()).optional(),
  videos: z.array(z.string().uuid()).optional(),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
