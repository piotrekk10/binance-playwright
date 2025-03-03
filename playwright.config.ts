import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "https://testnet.binancefuture.com",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    timezoneId: "Europe/Warsaw",
    storageState: {
      origins: [
        {
          origin: "https://testnet.binancefuture.com",
          localStorage: [
            {
              name: "chart_shared_TOOLBAR_MOVED_KEY",
              value: "false",
            },
          ],
        },
      ],
      cookies: [],
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "mobile_safari",
      use: {
        ...devices["iPhone 13 Pro"],
      },
      testIgnore: "**/web/**",
    },
  ],
});
