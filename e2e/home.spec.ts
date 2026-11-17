import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('the home page names its author and lists the Projects from the content collection', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Mikel McCormick')
  await expect(page.getByRole('heading', { level: 1, name: 'Mikel McCormick' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: 'MySous' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'MySous: Case Study' })).toHaveAttribute(
    'href',
    'https://my-sous.vercel.app/case-study',
  )
})

for (const colorScheme of ['light', 'dark'] as const) {
  test(`the home page has no axe violations, ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme })
    await page.goto('/')
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(violations).toEqual([])
  })
}
