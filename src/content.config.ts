import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const texts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/texts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().optional(),
    source: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    originalUrl: z.string().optional(),
  }),
});

export const collections = { texts };
