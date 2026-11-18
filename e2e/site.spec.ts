import { expect, test } from '@playwright/test'

const pages = [
  '/',
  '/about',
  '/resume',
  '/case-study',
  '/projects/my-sous',
  '/projects/dad-a-base',
  '/projects/this-site',
]

test('every page has a link preview image that exists, and a canonical address', async ({ page, request }) => {
  for (const path of pages) {
    await page.goto(path)
    const image = await page.locator('meta[property="og:image"]').getAttribute('content')
    expect(image).toMatch(/^https:\/\/www\.mjmfx\.com\/og\/[\w/-]+\.png$/)
    // Served from this build, at the same path.
    const response = await request.get(new URL(image ?? '').pathname)
    expect(response.ok(), `${path}: ${image}`).toBe(true)
    expect(response.headers()['content-type']).toBe('image/png')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.mjmfx.com${path}`)
  }
})

test('the favicons, the sitemap and robots.txt are served', async ({ request }) => {
  for (const file of ['/favicon.svg', '/favicon.ico', '/apple-touch-icon.png', '/robots.txt', '/sitemap-index.xml']) {
    expect((await request.get(file)).ok(), file).toBe(true)
  }
  const sitemap = await (await request.get('/sitemap-0.xml')).text()
  for (const path of pages) expect(sitemap).toContain(`<loc>https://www.mjmfx.com${path}</loc>`)
})

test('an unknown address shows the 404 page, with a way home', async ({ page }) => {
  const response = await page.goto('/no-such-page')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("This page isn't in the notebook")
  await expect(page.getByRole('link', { name: 'Home page' })).toHaveAttribute('href', '/')
})

test('analytics stay out of builds that Vercel does not serve', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('script[src*="_vercel/insights"]')).toHaveCount(0)
})
