import { defineConfig, devices } from '@playwright/test'

/**
 * Runs against the built site, as Vercel serves it, in Chromium and WebKit. `--ignore-lock` keeps the preview server in
 * the foreground, where Playwright can stop it: Astro backgrounds it when it detects a coding agent. It has a port of
 * its own, so a dev server on 4321 is never mistaken for the build.
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: 'http://localhost:4322', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['iPhone 15'] } },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4322 --ignore-lock',
    url: 'http://localhost:4322',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
