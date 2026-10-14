// Sign in to YouTube in the window that opens, then close it.
// Automation flags are off, otherwise Google won't let you sign in
import { chromium } from '@playwright/test';
import { PROFILE_DIR } from './paths.mjs';

const context = await chromium.launchPersistentContext(PROFILE_DIR, {
  channel: 'chromium',
  headless: false,
  viewport: null,
  ignoreDefaultArgs: ['--enable-automation'],
  args: ['--disable-blink-features=AutomationControlled', '--start-maximized'],
});
const page = context.pages()[0] ?? await context.newPage();
await page.goto('https://accounts.google.com/ServiceLogin?continue=https%3A%2F%2Fwww.youtube.com%2F');
console.log('Sign in to YouTube in the opened window, then close it.');
await new Promise(resolve => context.on('close', resolve));
console.log(`Profile saved to ${PROFILE_DIR}`);
