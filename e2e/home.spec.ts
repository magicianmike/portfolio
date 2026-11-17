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

test('each Project links to its live site, Case Study and code, and only to pages that exist', async ({ page }) => {
  await page.goto('/')
  const link = (name: string) => page.getByRole('link', { name, exact: true })
  await expect(link('Live site: MySous')).toHaveAttribute('href', 'https://my-sous.vercel.app')
  await expect(link('Case Study: MySous')).toHaveAttribute('href', 'https://my-sous.vercel.app/case-study')
  await expect(link('Code: MySous')).toHaveAttribute('href', 'https://github.com/magicianmike/my-sous')
  await expect(link('Case Study: The Dad-a-base')).toHaveAttribute(
    'href',
    'https://the-dad-a-base.vercel.app/case-study',
  )
  await expect(link('Code: This site')).toHaveAttribute('href', 'https://github.com/magicianmike/portfolio')
  // This site's Case Study arrives in milestone 5, and a Live link to this page would go nowhere.
  await expect(link('Case Study: This site')).toHaveCount(0)
  await expect(link('Live site: This site')).toHaveCount(0)
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
