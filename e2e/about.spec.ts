import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('the About page has a bio, the resume and contact, and the navigation marks it', async ({ page }) => {
  await page.goto('/about')
  await expect(page).toHaveTitle('About · Mikel McCormick')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About')
  await expect(page.getByRole('heading', { level: 2 })).toHaveText(['Outside work', 'How I work', 'Resume', 'Contact'])
  await expect(page.getByRole('heading', { level: 3 })).toHaveText([
    'Impact and projects',
    'Experience',
    'Education',
    'Skills',
  ])
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'About' })).toHaveAttribute(
    'aria-current',
    'page',
  )
})

test('the About page has a photo with a description, and the header a decorative avatar', async ({ page }) => {
  await page.goto('/about')
  const photo = page.getByRole('img', {
    name: 'Mikel McCormick, smiling, with glasses and a beard, against a green wall.',
  })
  await expect(photo).toBeVisible()
  await expect(photo).toHaveJSProperty('complete', true)
  const avatar = page.getByRole('banner').getByRole('link', { name: 'Mikel McCormick' }).locator('img')
  await expect(avatar).toHaveAttribute('alt', '')
  await expect(avatar).toBeVisible()
})

test('the resume downloads as a PDF', async ({ page, request }) => {
  await page.goto('/about')
  const link = page.getByRole('link', { name: 'Download the resume (PDF, 1 page)' })
  await expect(link).toHaveAttribute('href', '/mikel-mccormick-resume.pdf')
  const response = await request.get('/mikel-mccormick-resume.pdf')
  expect(response.ok()).toBe(true)
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-')
})

test('no phone number appears on the site', async ({ page }) => {
  for (const path of ['/', '/about', '/projects/my-sous']) {
    await page.goto(path)
    await expect(page.locator('body')).not.toContainText(/\(?\d{3}\)?[\s.-]?\d{3}-\d{4}/)
  }
})

test('the contact links go to email, LinkedIn and GitHub', async ({ page }) => {
  await page.goto('/about')
  const contact = page.getByRole('region', { name: 'Contact' })
  await expect(contact.getByRole('link', { name: 'mjmfxmike@gmail.com' })).toHaveAttribute(
    'href',
    'mailto:mjmfxmike@gmail.com',
  )
  await expect(contact.getByRole('link', { name: 'mikel-mccormick-b054b445' })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/mikel-mccormick-b054b445/',
  )
  await expect(contact.getByRole('link', { name: 'magicianmike' })).toHaveAttribute(
    'href',
    'https://github.com/magicianmike',
  )
})

for (const colorScheme of ['light', 'dark'] as const) {
  test(`the About page has no axe violations, ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme })
    await page.goto('/about')
    await page.evaluate(() => document.fonts.ready)
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(violations).toEqual([])
  })
}
