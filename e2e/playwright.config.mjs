import { defineConfig, devices } from '@playwright/test';
import { EXTENSION_DIR } from './paths.mjs';

export default defineConfig({
  testDir: '.',
  // Only one browser can use the profile at a time
  workers: 1,
  timeout: 90_000,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  projects: [
    { name: 'desktop', testMatch: 'desktop.spec.mjs', use: { baseURL: 'https://www.youtube.com' } },
    {
      name: 'mobile',
      testMatch: 'mobile.spec.mjs',
      use: {
        baseURL: 'https://m.youtube.com',
        profileOptions: (({ defaultBrowserType, ...device }) => device)(devices['Pixel 7']),
      },
    },
    {
      name: 'extension',
      testMatch: 'extension.spec.mjs',
      use: {
        baseURL: 'https://www.youtube.com',
        profileOptions: { args: [`--disable-extensions-except=${EXTENSION_DIR}`, `--load-extension=${EXTENSION_DIR}`] },
      },
    },
  ],
});
