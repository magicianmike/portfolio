import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test("the Case Study's chapters, in order", async ({ page }) => {
  await page.goto('/case-study')
  await expect(page).toHaveTitle('How this site was made · Mikel McCormick')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How this site was made')
  await expect(page.getByRole('article').getByRole('heading', { level: 2 })).toHaveText([
    'In 60 seconds',
    'Why Astro',
    'Projects as content',
    'The look',
    'Performance',
    'Accessibility',
    'Building with Claude',
    'After launch',
    'Found on the way',
    // MDX sets typographic apostrophes.
    'What\u2019s next',
  ])
  // It's reached from the Portfolio site's card and Project page, not the main navigation.
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Case study' })).toHaveCount(0)
})

test('its links reach the Projects, the code and the decision records', async ({ page }) => {
  await page.goto('/case-study')
  const article = page.getByRole('article')
  await expect(article.getByRole('link', { name: 'MySous', exact: true })).toHaveAttribute('href', '/projects/my-sous')
  await expect(article.getByRole('link', { name: 'the Dad-a-base', exact: true })).toHaveAttribute(
    'href',
    '/projects/dad-a-base',
  )
  await expect(article.getByRole('link', { name: 'magicianmike/portfolio' })).toHaveAttribute(
    'href',
    'https://github.com/magicianmike/portfolio',
  )
  for (const link of await article.getByRole('link', { name: /^ADR 000\d$/ }).all()) {
    await expect(link).toHaveAttribute('href', /\/docs\/adr\/000\d-[\w-]+\.md$/)
  }
})

test('The Portfolio site links to its Case Study from its card and its Project page', async ({ page }) => {
  await page.goto('/projects/this-site')
  await expect(page.getByRole('link', { name: 'Case Study: Portfolio site' })).toHaveAttribute('href', '/case-study')
})

test('every prototype figure is described', async ({ page }) => {
  await page.goto('/case-study')
  const images = page.getByRole('article').getByRole('img')
  await expect(images).toHaveCount(8)
  for (const image of await images.all()) expect(await image.getAttribute('alt')).toMatch(/prototype|riff/)
})

for (const colorScheme of ['light', 'dark'] as const) {
  test(`the Case Study has no axe violations, ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme })
    await page.goto('/case-study')
    await page.evaluate(() => document.fonts.ready)
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(violations).toEqual([])
  })
}

test('nothing on the Case Study is wider than a phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/case-study')
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
})
