import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('the Resume page has the resume, in its sections, and the navigation marks it', async ({ page }) => {
  await page.goto('/resume')
  await expect(page).toHaveTitle('Resume · Mikel McCormick')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mikel McCormick')
  await expect(page.getByRole('heading', { level: 2 })).toHaveText([
    'Profile',
    'Strategic Impact & Projects',
    'Experience',
    'Academic',
    'Engineering',
    'Design',
  ])
  await expect(page.getByRole('heading', { level: 3 })).toHaveCount(3)
  await expect(page.getByRole('region', { name: 'Experience' }).getByRole('listitem')).toHaveCount(4)
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Resume' })).toHaveAttribute(
    'aria-current',
    'page',
  )
})

test('the resume downloads as a PDF', async ({ page, request }) => {
  await page.goto('/resume')
  const link = page.getByRole('link', { name: 'Download as PDF' })
  await expect(link).toHaveAttribute('href', '/mikel-mccormick-resume.pdf')
  const response = await request.get('/mikel-mccormick-resume.pdf')
  expect(response.ok()).toBe(true)
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-')
})

for (const colorScheme of ['light', 'dark'] as const) {
  test(`the Resume page has no axe violations, ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme })
    await page.goto('/resume')
    await page.evaluate(() => document.fonts.ready)
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(violations).toEqual([])
  })
}

test('nothing on the Resume page is wider than a phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/resume')
  await page.evaluate(() => document.fonts.ready)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
})
