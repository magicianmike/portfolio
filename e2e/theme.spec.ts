import { expect, test } from '@playwright/test'

const toggle = (page: import('@playwright/test').Page) => page.getByRole('button', { name: 'Dark theme' })

test('the theme follows the system until the Visitor chooses one', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('html')).not.toHaveAttribute('data-theme')

  await page.emulateMedia({ colorScheme: 'light' })
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'false')
})

test('a chosen theme is remembered, and applied before the page paints', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await toggle(page).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true')

  // The head's inline script sets it as the document is parsed, before any module script runs.
  const themeWhenParsed = page
    .waitForEvent('domcontentloaded')
    .then(() => page.evaluate(() => document.documentElement.dataset.theme))
  await page.reload()
  expect(await themeWhenParsed).toBe('dark')
  await expect(toggle(page)).toHaveAttribute('aria-pressed', 'true')

  await toggle(page).click()
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('the skip link moves focus to the page content', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'WebKit on iOS has no Tab key to reach it.')
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await skip.press('Enter')
  await expect(page.locator('main')).toBeFocused()
})
