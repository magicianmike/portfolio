// @ts-check
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'

export default defineConfig({
  site: 'https://www.mjmfx.com',
  // One address per page, as the site links to them: canonical links and the sitemap agree.
  trailingSlash: 'never',
  integrations: [mdx(), sitemap()],
  // The stylesheet is small (under 5 KB gzipped), so it's inlined rather than a request that blocks the first paint.
  build: { inlineStylesheets: 'always' },
  vite: { plugins: [tailwindcss()] },
  // Self-hosted at build time, Latin only, so the site makes no requests to a font service.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Bricolage Grotesque',
      cssVariable: '--font-bricolage',
      // Only the weights the site sets: one heavy weight for headings, not the whole variable range.
      weights: ['800'],
      subsets: ['latin'],
      fallbacks: ['Avenir Next', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-plex',
      weights: ['400', '500', '600'],
      subsets: ['latin'],
      fallbacks: ['Segoe UI', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Caveat',
      cssVariable: '--font-caveat',
      weights: ['700'],
      subsets: ['latin'],
      fallbacks: ['Comic Sans MS', 'cursive'],
    },
  ],
})
