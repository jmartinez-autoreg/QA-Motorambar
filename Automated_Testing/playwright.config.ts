import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'https://testwaf.portaldevehiculos.com',
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15_000,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    slowMo: parseInt(process.env.SLOW_MO || '0'),
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
