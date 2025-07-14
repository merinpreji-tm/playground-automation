import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const REPORT_ID = process.env.REPORT_ID || 'default';

export default defineConfig({
  testDir: './testAssets/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 3 * 60 * 1000,
  expect: {
    timeout: 30000
  },
  reporter: [
    ['list'],
    ['allure-playwright', { outputFolder: `playwright-report/allure-results-${REPORT_ID}` }],
    ['html', { outputFolder: `playwright-report/html-report-${REPORT_ID}`, open: 'never' }],
    ['./reporter/htmlCustomReporter.ts'],
    ['./reporter/allureCustomReporter.ts'],
  ],

  use: {
    headless: false,
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'off',
    baseURL: process.env.ENV ? `${process.env.baseUrl}` : 'https://www.playground.testingmavens.tools/',
    navigationTimeout: 60 * 1000,
    actionTimeout: 30 * 1000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against branded browsers. */
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});