// Usage: npm run inspect -- <url> [--mobile]
// Prints where the Shorts links/labels are on a page
import { chromium, devices } from '@playwright/test';
import { PROFILE_DIR } from './paths.mjs';
import { loadPage } from './fixtures.mjs';

const mobile = process.argv.includes('--mobile');
const url = process.argv.slice(2).find(a => !a.startsWith('--'));
if (!url) throw new Error('Usage: npm run inspect -- <url> [--mobile]');

const { defaultBrowserType, ...device } = mobile ? devices['Pixel 7'] : {};
const context = await chromium.launchPersistentContext(PROFILE_DIR, { channel: 'chromium', headless: true, viewport: { width: 1400, height: 1000 }, ...device });
const page = context.pages()[0] ?? await context.newPage();
await loadPage(page, url);

const result = await page.evaluate(() => {
  const describe = el => {
    const attrs = [...el.attributes].filter(a => !['class', 'style'].includes(a.name) && a.value.length < 60).map(a => (a.value ? `${a.name}="${a.value}"` : a.name));
    return `<${el.tagName.toLowerCase()}${attrs.length ? ' ' + attrs.join(' ') : ''}>`;
  };
  const ancestry = el => {
    const parts = [];
    for (let e = el; e && e !== document.body && parts.length < 8; e = e.parentElement) if (e.tagName.includes('-')) parts.push(describe(e));
    return parts.join('\n      < ');
  };
  const group = els => {
    const map = new Map();
    for (const el of els) { const key = ancestry(el); map.set(key, (map.get(key) ?? 0) + 1); }
    return [...map].map(([chain, count]) => `  x${count}\n      ${chain}`);
  };
  const ownText = el => [...el.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim();
  return {
    shortsLinks: group([...document.querySelectorAll('a[href*="/shorts/"]')]),
    shortsLabels: group([...document.querySelectorAll('body *')].filter(el => ownText(el) === 'Shorts')),
  };
});
console.log(`Shorts links on ${page.url()}:\n${result.shortsLinks.join('\n') || '  none'}`);
console.log(`\n"Shorts" labels:\n${result.shortsLabels.join('\n') || '  none'}`);
await context.close();
