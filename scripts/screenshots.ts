/**
 * Captures each Project's screenshots, in light and dark, into `src/assets/projects/<slug>/`, where the content
 * collection's entries point. The live apps are captured where they're deployed; this site from its own build, so build
 * first (`npm run screenshots` does). Run it again whenever an app changes.
 *
 *   npm run screenshots              every Project
 *   npm run screenshots -- my-sous   one Project
 */
import { chromium, type Page } from '@playwright/test'
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'

/** `scrollTo` is a Playwright selector to bring to the top of the screen first, for what's below the fold. */
type Shot = { name: string; path: string; phone?: boolean; scrollTo?: string }
type Target = { slug: string; base: string; shots: Shot[] }

const SELF = 'http://localhost:4399'

const targets: Target[] = [
  {
    slug: 'my-sous',
    base: 'https://my-sous.mjmfx.com',
    shots: [
      { name: 'hero', path: '/' },
      { name: 'filled-in', path: '/suggestions?with=chicken-thigh,garlic', scrollTo: 'h2:text-is("Suggestions")' },
      { name: 'sourced', path: '/ingredients/basil' },
      { name: 'basket-phone', path: '/suggestions?with=chicken-thigh,garlic,lemon', phone: true },
    ],
  },
  {
    slug: 'dad-a-base',
    base: 'https://the-dad-a-base.mjmfx.com',
    shots: [
      { name: 'hero', path: '/' },
      { name: 'search', path: '/search?q=cat' },
      { name: 'error', path: '/error/429' },
      // A live component in the Case Study, rather than its opening, which the live deploy frames differently.
      { name: 'case-study', path: '/case-study', scrollTo: 'figure.live' },
    ],
  },
  {
    slug: 'this-site',
    base: SELF,
    shots: [
      { name: 'hero', path: '/' },
      { name: 'notes-phone', path: '/', phone: true },
      { name: 'project-page', path: '/projects/my-sous' },
    ],
  },
]

const only = process.argv.slice(2)
const chosen = only.length ? targets.filter((t) => only.includes(t.slug)) : targets

async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready)
  // Let images and any entrance settle; reduced motion is on, so this is short.
  await page.waitForTimeout(800)
}

async function capture(target: Target) {
  const dir = new URL(`../src/assets/projects/${target.slug}/`, import.meta.url)
  await mkdir(dir, { recursive: true })
  const browser = await chromium.launch()
  for (const shot of target.shots) {
    for (const colorScheme of ['light', 'dark'] as const) {
      const page = await browser.newPage({
        viewport: shot.phone ? { width: 390, height: 844 } : { width: 1280, height: 800 },
        deviceScaleFactor: shot.phone ? 2 : 1.5,
        colorScheme,
        reducedMotion: 'reduce',
      })
      await page.goto(target.base + shot.path, { waitUntil: 'networkidle' })
      if (shot.scrollTo) {
        await page
          .locator(shot.scrollTo)
          .first()
          .evaluate((el) => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 32, behavior: 'instant' }))
      }
      await settle(page)
      const file = new URL(`${shot.name}-${colorScheme}.jpg`, dir)
      await page.screenshot({ path: file.pathname, type: 'jpeg', quality: 82 })
      console.log(`${target.slug}/${shot.name}-${colorScheme}.jpg`)
      await page.close()
    }
  }
  await browser.close()
}

// This site is captured from its own build, served by Astro's preview in the foreground (see playwright.config.ts).
const needsSelf = chosen.some((t) => t.base === SELF)
const preview = needsSelf
  ? spawn('npx', ['astro', 'preview', '--port', '4399', '--ignore-lock'], { stdio: 'ignore' })
  : undefined
try {
  if (preview) {
    for (let i = 0; i < 50; i++) {
      if (
        await fetch(SELF).then(
          (r) => r.ok,
          () => false,
        )
      )
        break
      await new Promise((r) => setTimeout(r, 200))
    }
  }
  for (const target of chosen) await capture(target)
} finally {
  preview?.kill()
}
