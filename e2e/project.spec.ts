import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const projects = [
  { slug: 'my-sous', name: 'MySous', links: ['Live site', 'Case Study', 'Code'] },
  { slug: 'dad-a-base', name: 'The Dad-a-base', links: ['Live site', 'Case Study', 'Code'] },
  // This site's Case Study arrives in milestone 5, and its live site is this one.
  { slug: 'this-site', name: 'This site', links: ['Code'] },
]

async function loadEveryImage(page: Page) {
  // Screenshots below the fold load lazily; scroll through so axe and the checks see them loaded.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) {
      scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 50))
    }
    scrollTo(0, 0)
  })
}

for (const project of projects) {
  test(`${project.name}'s page has the template's sections, in order`, async ({ page }) => {
    await page.goto(`/projects/${project.slug}`)
    await expect(page).toHaveTitle(`${project.name} · Mikel McCormick`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(project.name)
    await expect(page.getByRole('heading', { level: 2 })).toHaveText([
      'The problem, and my role',
      'Stack',
      'Highlights',
      "What's next",
      'Links',
    ])
    await expect(page.getByRole('region', { name: 'Highlights' }).getByRole('heading', { level: 3 })).toHaveCount(3)
  })

  test(`${project.name}'s page links only where it should`, async ({ page }) => {
    await page.goto(`/projects/${project.slug}`)
    const links = page.getByRole('region', { name: 'Links' }).getByRole('listitem').getByRole('link')
    await expect(links).toHaveText(project.links)
    for (const label of project.links) {
      await expect(page.getByRole('link', { name: `${label}: ${project.name}` })).toBeVisible()
    }
  })

  test(`${project.name}'s page shows one screenshot per place, each described`, async ({ page }) => {
    await page.goto(`/projects/${project.slug}`)
    await loadEveryImage(page)
    // A hero and three Highlights, in the page's theme only.
    const images = page.getByRole('main').getByRole('img')
    await expect(images).toHaveCount(4)
    for (const image of await images.all()) {
      expect(await image.getAttribute('alt')).toMatch(/\w{3,}/)
      // Lazy images load once near the screen, so bring each there and wait for it, rather than checking once.
      await image.scrollIntoViewIfNeeded()
      await expect
        .poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
        .toBe(true)
    }
  })

  for (const colorScheme of ['light', 'dark'] as const) {
    test(`${project.name}'s page has no axe violations, ${colorScheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme })
      await page.goto(`/projects/${project.slug}`)
      await page.evaluate(() => document.fonts.ready)
      await loadEveryImage(page)
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(violations).toEqual([])
    })
  }
}

test('the dark screenshot shows in the dark theme, chosen or from the system', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/projects/my-sous')
  const hero = page.getByRole('img', { name: /The MySous home page/ })
  await expect(hero).toHaveCount(1)
  await expect(hero).toHaveAttribute('src', /hero-dark/)

  await page.getByRole('button', { name: 'Dark theme' }).click()
  await expect(hero).toHaveAttribute('src', /hero-light/)
})
