import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('the home page says who its author is and lists the Projects from the content collection', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Mikel McCormick')
  await expect(
    page.getByRole('heading', { level: 1, name: 'A product-minded frontend engineer who sweats the details.' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: 'MySous' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'MySous: Case Study' })).toHaveAttribute(
    'href',
    'https://my-sous.vercel.app/case-study',
  )
})

test('the header names the site and the footer says how to get in touch', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Mikel McCormick' })).toHaveAttribute('href', '/')
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Work' })).toHaveAttribute(
    'href',
    '/#work',
  )
  const footer = page.getByRole('contentinfo')
  await expect(footer.getByRole('link', { name: 'mjmfxmike@gmail.com' })).toHaveAttribute(
    'href',
    'mailto:mjmfxmike@gmail.com',
  )
  await expect(footer.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/magicianmike')
  await expect(footer.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/mikel-mccormick-b054b445/',
  )
})

for (const colorScheme of ['light', 'dark'] as const) {
  test(`the home page has no axe violations, ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme })
    await page.goto('/')
    // The fonts are part of the contrast, so wait for them.
    await page.evaluate(() => document.fonts.ready)
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(violations).toEqual([])
  })
}
