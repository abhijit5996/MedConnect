import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'line',
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    headless: false, // Run in headed mode so user can see it!
    launchOptions: {
      slowMo: 1000, // Slow down actions by 1s so the user can see what's happening
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
