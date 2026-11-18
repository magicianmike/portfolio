/**
 * Prints the resume to `public/mikel-mccormick-resume.pdf` from the site's own `/resume` page, so the page and the PDF
 * share one source, `src/data/resume.ts`. The page's print styles leave out the site around the sheet. Run it whenever
 * the resume changes; it builds the site first.
 *
 *   npm run resume-pdf
 */
import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'

const SELF = 'http://localhost:4398'
const out = new URL('../public/mikel-mccormick-resume.pdf', import.meta.url).pathname

// The build, served by Astro's preview in the foreground (see playwright.config.ts), on a port of its own.
const preview = spawn('npx', ['astro', 'preview', '--port', '4398', '--ignore-lock'], { stdio: 'ignore' })
try {
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

  const browser = await chromium.launch()
  // Printed in the light theme, as on paper.
  const page = await browser.newPage({ colorScheme: 'light' })
  await page.goto(`${SELF}/resume`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.emulateMedia({ media: 'print', colorScheme: 'light' })
  await page.pdf({ path: out, format: 'Letter', printBackground: true, preferCSSPageSize: true })
  await browser.close()
  console.log(`Printed ${out}`)
} finally {
  preview.kill()
}
