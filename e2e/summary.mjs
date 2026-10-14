// Prints a short summary of the last run
import fs from 'node:fs';
import { isKnownLeak } from './audit.mjs';

for (const file of fs.readdirSync('reports').sort()) {
  const r = JSON.parse(fs.readFileSync(`reports/${file}`, 'utf8'));
  const ok = !r.wronglyHidden.length && !r.leaks.some(l => !isKnownLeak(l));
  console.log(`${ok ? 'PASS' : 'FAIL'} ${file.replace('.json', '')}  ${JSON.stringify(r.counts)}`);
  for (const w of r.wronglyHidden) console.log(`   HIDDEN x${w.count} [${w.rules.join(' | ')}] ${w.reason} @ ${w.path} :: ${w.text.slice(0, 50)}`);
  for (const l of r.leaks) console.log(`   ${isKnownLeak(l) ? 'KNOWN LEAK' : 'LEAK'} x${l.count} ${l.kind} @ ${l.path} :: ${l.text.slice(0, 40)}`);
}
