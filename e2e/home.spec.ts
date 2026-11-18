import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('the home page says who its author is', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Mikel McCormick')
  await expect(
    page.getByRole('heading', { level: 1, name: 'A product-minded frontend engineer who sweats the details.' }),
  ).toBeVisible()
})

test('the Projects come from the content collection, in order, each with its Margin note', async ({ page }) => {
  await page.goto('/')
  const work = page.getByRole('region', { name: 'Work' })
  await expect(work.getByRole('heading', { level: 3 })).toHaveText(['MySous', 'The Dad-a-base', 'This site'])
  await expect(work.getByText('309 Pairings, every one with a source')).toBeVisible()
  await expect(work.getByRole('list', { name: 'The Dad-a-base: stack' }).getByRole('listitem')).toContainText([
    'Vue 3',
    'Apollo Client',
  ])
})

test('each Project card shows its screenshot and links to its Project page', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Read about MySous' })).toHaveAttribute('href', '/projects/my-sous')
  await expect(page.getByRole('link', { name: 'The Dad-a-base', exact: true })).toHaveAttribute(
    'href',
    '/projects/dad-a-base',
  )
  await expect(page.getByRole('link', { name: 'Read about This site' })).toHaveAttribute('href', '/projects/this-site')
  // One screenshot per card shows, the one for the page's theme.
  await expect(page.getByRole('region', { name: 'Work' }).getByRole('img')).toHaveCount(3)
})

test('the header names the site and the footer says how to get in touch', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Mikel McCormick' })).toHaveAttribute('href', '/')
  const nav = page.getByRole('navigation', { name: 'Main' })
  await expect(nav.getByRole('link')).toHaveText(['Work', 'About', 'Resume', 'Case study'])
  await expect(nav.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/#work')
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
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
