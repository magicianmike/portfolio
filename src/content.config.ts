import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

/**
 * A Project, one YAML file each in `src/content/projects/` (ADR 0003). The file's name is its slug, at
 * `/projects/<slug>`. A missing or misspelt field fails the build.
 */
const projects = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/projects' }),
  schema: ({ image }) => {
    /** A screenshot in both themes, from `npm run screenshots`. The page shows the one matching its theme. */
    const shot = z.object({ light: image(), dark: image(), alt: z.string().min(1) })
    return z.object({
      name: z.string(),
      /** Where it sits on the home page, smallest first. */
      order: z.number().int(),
      /** One or two sentences: what it is, for someone who's never seen it. */
      pitch: z.string(),
      /** The Margin note beside it on the home page: the one thing to look at. */
      note: z.string(),
      /** What the author did on it, in a few words for the card. */
      role: z.string(),
      /** The problem it answers, for the Project page. */
      problem: z.string(),
      /** The author's role in full, for the Project page. */
      roleDetail: z.string(),
      stack: z.array(z.string()).min(1),
      hero: shot,
      /** Exactly three, so every Project page has the same shape. */
      highlights: z.array(z.object({ heading: z.string(), body: z.string(), shot })).length(3),
      next: z.array(z.string()).min(1),
      /**
       * Only links to pages that exist. This site's own Case Study joins in milestone 5, so its link is optional until
       * then; a Live link to the home page from the home page would go nowhere.
       */
      links: z.object({
        live: z.url().optional(),
        caseStudy: z.string().optional(),
        code: z.url(),
      }),
    })
  },
})

export const collections = { projects }
