import fs from 'node:fs';
import { test as base, expect, chromium } from '@playwright/test';
import { PROFILE_DIR } from './paths.mjs';

// Uses the signed-in profile from `npm run login`
export const test = base.extend({
  profileOptions: [{}, { scope: 'worker', option: true }],

  profile: [async ({ profileOptions }, use) => {
    if (!fs.existsSync(PROFILE_DIR)) throw new Error('No browser profile yet, run `npm run login` and sign in to YouTube first');
    const context = await chromium.launchPersistentContext(PROFILE_DIR, {
      channel: 'chromium',
      headless: !process.env.HEADED,
      viewport: { width: 1400, height: 1000 },
      ...profileOptions,
    });
    await use(context);
    await context.close();
  }, { scope: 'worker' }],

  page: async ({ profile: context }, use) => {
    const page = context.pages()[0] ?? await context.newPage();
    await use(page);
  },
});

export { expect };

// Scroll down a bit so lazy-loaded stuff shows up
export async function loadPage(page, url, { scrolls = 4 } = {}) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    () => document.querySelectorAll('a[href*="/watch?v="], a[href*="/shorts/"], a[href*="/playlist?list="]').length > 0,
    null, { timeout: 20_000 },
  ).catch(() => {});
  await page.waitForTimeout(2_000);
  for (let i = 0; i < scrolls; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
    await page.waitForTimeout(1_200);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
}

export async function expectSignedIn(page) {
  const signInButton = page.locator('a[href*="accounts.google.com/ServiceLogin"]').first();
  if (await signInButton.isVisible().catch(() => false)) {
    throw new Error('Not signed in to YouTube, run `npm run login` and sign in first');
  }
}
