/**
 * Prints the resume to `public/mikel-mccormick-resume.pdf` from `resume.html` in the author's `resume` repository,
 * with the phone number left out: the site is public, and its contact is email, GitHub and LinkedIn. The page's text is
 * in `src/data/resume.ts`; run this again whenever the resume changes.
 *
 *   node scripts/resume-pdf.ts [path/to/resume.html]
 */
import { chromium } from '@playwright/test'
import { pathToFileURL } from 'node:url'

const source = process.argv[2] ?? new URL('../../resume/resume.html', import.meta.url).pathname
const out = new URL('../public/mikel-mccormick-resume.pdf', import.meta.url).pathname

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(pathToFileURL(source).href, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)

const removed = await page.evaluate(() => {
  const phone = [...document.querySelectorAll('p')].filter((p) => /\(\d{3}\)\s*\d{3}-\d{4}/.test(p.textContent ?? ''))
  phone.forEach((p) => p.remove())
  return phone.length
})
if (removed !== 1) throw new Error(`Expected one phone number in the resume, found ${removed}.`)

await page.emulateMedia({ media: 'print' })
await page.pdf({ path: out, format: 'Letter', printBackground: true })
await browser.close()
console.log(`Printed ${out}`)
