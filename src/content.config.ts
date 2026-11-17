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
    /** One or two sentences: what it is, for someone who's never seen it. */
    pitch: z.string(),
    /** The Margin note beside it on the home page: the one thing to look at. */
    note: z.string(),
    /** What the author did on it. */
    role: z.string(),
    stack: z.array(z.string()).min(1),
    /**
     * Only links to pages that exist. This site's own Case Study joins in milestone 5, so its link is optional until
     * then; a Live link to the home page from the home page would go nowhere.
     */
    links: z.object({
      live: z.url().optional(),
      caseStudy: z.string().optional(),
      code: z.url(),
    }),
  }),
})

export const collections = { projects }
