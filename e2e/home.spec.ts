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
  await expect(work.getByRole('heading', { level: 3 })).toHaveText(['MySous', 'The Dad-a-base', 'Portfolio site'])
  await expect(work.getByText('309 Pairings, every one with a source')).toBeVisible()
  await expect(work.getByRole('list', { name: 'The Dad-a-base: stack' }).getByRole('listitem')).toContainText([
    'Vue 3',
    'Apollo Client',
  ])
})

test('each Project card shows its screenshot and links to its Project page, Case Study, live site and code', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'MySous', exact: true })).toHaveAttribute('href', '/projects/my-sous')
  await expect(page.getByRole('link', { name: 'The Dad-a-base', exact: true })).toHaveAttribute(
    'href',
    '/projects/dad-a-base',
  )
  await expect(page.getByRole('link', { name: 'Portfolio site', exact: true })).toHaveAttribute(
    'href',
    '/projects/this-site',
  )
  await expect(page.getByRole('link', { name: 'Case Study: MySous' })).toHaveAttribute(
    'href',
    'https://my-sous.mjmfx.com/case-study',
  )
  // The Portfolio site's own Case Study opens here; links to other sites open in a new tab.
  const own = page.getByRole('link', { name: 'Case Study: Portfolio site', exact: true })
  await expect(own).toHaveAttribute('href', '/case-study')
  await expect(own).not.toHaveAttribute('target', '_blank')
  await expect(page.getByRole('link', { name: 'Case Study: MySous (opens in a new tab)' })).toHaveAttribute(
    'target',
    '_blank',
  )
  await expect(page.getByRole('link', { name: 'GitHub: MySous' })).toHaveAttribute(
    'href',
    'https://github.com/magicianmike/my-sous',
  )
  await expect(page.getByRole('link', { name: 'GitHub: Portfolio site' })).toHaveAttribute(
    'href',
    'https://github.com/magicianmike/portfolio',
  )
  // Each Project with a live site links to it; the Portfolio site, which is the page you're on, doesn't.
  const work = page.getByRole('region', { name: 'Work' })
  await expect(work.getByRole('link', { name: 'Live site: MySous' })).toHaveAttribute(
    'href',
    'https://my-sous.mjmfx.com',
  )
  await expect(work.getByRole('link', { name: 'Live site: The Dad-a-base' })).toHaveAttribute(
    'href',
    'https://the-dad-a-base.mjmfx.com',
  )
  await expect(work.getByRole('link', { name: /^Live site/ })).toHaveCount(2)
  // One screenshot per card shows, the one for the page's theme.
  await expect(work.getByRole('img')).toHaveCount(3)
})

test('the header names the site and the footer says how to get in touch', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Mikel McCormick' })).toHaveAttribute('href', '/')
  const nav = page.getByRole('navigation', { name: 'Main' })
  await expect(nav.getByRole('link')).toHaveText(['Work', 'About', 'Resume'])
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

test('Work in the navigation glides to the Projects, from the home page or another', async ({ page }) => {
  const workTop = () => page.evaluate(() => document.getElementById('work')?.getBoundingClientRect().top ?? NaN)
  const nav = page.getByRole('navigation', { name: 'Main' })

  // From another page: home opens at the top, then scrolls down to Work.
  await page.goto('/about')
  await nav.getByRole('link', { name: 'Work' }).click()
  await expect(page).toHaveURL(/\/#work$/)
  await expect.poll(workTop).toBeLessThan(40)
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(200)

  // On the home page: back to the top, then Work again.
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }))
  await nav.getByRole('link', { name: 'Work' }).click()
  await expect.poll(workTop).toBeLessThan(40)
})

test('with less motion asked for, Work jumps straight to the Projects', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/about')
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Work' }).click()
  await expect(page).toHaveURL(/\/#work$/)
  await expect
    .poll(() => page.evaluate(() => document.getElementById('work')?.getBoundingClientRect().top ?? NaN))
    .toBeLessThan(40)
})
