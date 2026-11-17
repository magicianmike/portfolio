// @ts-check
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'

export default defineConfig({
  site: 'https://mikelmccormick.vercel.app',
  integrations: [mdx()],
  vite: { plugins: [tailwindcss()] },
  // Self-hosted at build time, Latin only, so the site makes no requests to a font service.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Bricolage Grotesque',
      cssVariable: '--font-bricolage',
      weights: ['500 800'],
      subsets: ['latin'],
      fallbacks: ['Avenir Next', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-plex',
      weights: ['400', '500', '600'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Segoe UI', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Caveat',
      cssVariable: '--font-caveat',
      weights: ['500 700'],
      subsets: ['latin'],
      fallbacks: ['Comic Sans MS', 'cursive'],
    },
  ],
})
