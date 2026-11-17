import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

/**
 * A Project, one YAML file each in `src/content/projects/` (ADR 0003). The schema grows with the milestones: the
 * Project page's sections arrive in milestone 3. A missing or misspelt field fails the build.
 */
const projects = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    /** Where it sits on the home page, smallest first. */
    order: z.number().int(),
    pitch: z.string(),
    /** The Margin note beside it on the home page: the one thing to look at. */
    note: z.string(),
    links: z.object({
      live: z.url().optional(),
      caseStudy: z.string(),
      code: z.url(),
    }),
  }),
})

export const collections = { projects }
