// Checks the built extension (dist/chrome) injects the CSS and can be toggled off
import fs from 'node:fs';
import path from 'node:path';
import { test, expect, loadPage } from './fixtures.mjs';
import { EXTENSION_DIR, CSS_FILE } from './paths.mjs';

const SEARCH = '/results?search_query=minecraft';
const visibleShorts = page => page.locator('a[href*="/shorts/"]:visible').count();

test.beforeAll(() => {
  const built = path.join(EXTENSION_DIR, 'styles/shorts-selectors.css');
  if (!fs.existsSync(built) || fs.readFileSync(built, 'utf8') !== fs.readFileSync(CSS_FILE, 'utf8')) {
    throw new Error('dist/chrome is missing or out of date, run `./gradlew assembleChrome` first');
  }
});

async function setHidden(context, hidden) {
  const worker = context.serviceWorkers()[0] ?? await context.waitForEvent('serviceworker');
  await worker.evaluate(value => chrome.storage.local.set({ shortsHidden: value }), hidden);
}

test('hides Shorts when enabled', async ({ profile: context, page, baseURL }) => {
  await setHidden(context, true);
  await loadPage(page, baseURL + SEARCH);
  expect(await page.locator('a[href*="/watch?v="]:visible').count()).toBeGreaterThan(0);
  await expect.poll(() => visibleShorts(page)).toBe(0);
});

test('shows Shorts when disabled', async ({ profile: context, page, baseURL }) => {
  await setHidden(context, false);
  await loadPage(page, baseURL + SEARCH);
  expect(await visibleShorts(page)).toBeGreaterThan(0);
  await setHidden(context, true);
});
