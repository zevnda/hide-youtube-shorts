import fs from 'node:fs';
import { test, expect, loadPage, expectSignedIn } from './fixtures.mjs';
import { auditPage, isKnownLeak } from './audit.mjs';

const format = items => items.map(i => `\n  - ${JSON.stringify(i)}`).join('');

// One test per page
export function defineAuditTests(pages) {
  for (const def of pages) {
    test(def.name, async ({ page, baseURL }, testInfo) => {
      const viewport = page.viewportSize();
      if (def.viewport) await page.setViewportSize(def.viewport);
      // Home doesn't always have Shorts, reload a couple times
      let report;
      for (let attempt = 1; attempt <= (def.shorts ? 3 : 1); attempt++) {
        await loadPage(page, new URL(def.url, baseURL).href);
        await expectSignedIn(page);
        if (def.prepare) await def.prepare(page);
        report = await auditPage(page);
        if (report.counts.shortsLinks > 0) break;
      }
      fs.mkdirSync('reports', { recursive: true });
      fs.writeFileSync(`reports/${testInfo.project.name}-${def.name.replace(/\W+/g, '-')}.json`, JSON.stringify(report, null, 2));
      await testInfo.attach('audit.json', { body: JSON.stringify(report, null, 2), contentType: 'application/json' });
      await testInfo.attach('page.png', { body: await page.screenshot(), contentType: 'image/png' });
      testInfo.annotations.push({ type: 'counts', description: JSON.stringify(report.counts) });
      if (def.viewport) await page.setViewportSize(viewport);

      expect.soft(report.wronglyHidden, `Non-Shorts content was hidden on ${report.url}:${format(report.wronglyHidden)}`).toEqual([]);
      const leaks = report.leaks.filter(leak => !isKnownLeak(leak));
      for (const leak of report.leaks.filter(isKnownLeak)) testInfo.annotations.push({ type: 'known leak', description: JSON.stringify(leak) });
      expect.soft(leaks, `Shorts still visible on ${report.url}:${format(leaks)}`).toEqual([]);
      if (def.shorts) {
        expect.soft(report.counts.shortsLinks, 'Expected Shorts on this page but found none, so this test checked nothing').toBeGreaterThan(0);
      }
    });
  }
}
