const { defineConfig, devices } = require('@playwright/test');

const slowMo = Number(process.env.PW_SLOW_MO || 0);

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // Tests share database, must run serially
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    launchOptions: {
      slowMo
    }
  },
  webServer: {
    command: 'npm start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
