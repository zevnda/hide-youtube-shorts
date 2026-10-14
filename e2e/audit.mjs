// Checks the CSS only hides Shorts and doesn't miss any
import fs from 'node:fs';
import { CSS_FILE } from './paths.mjs';

export const css = fs.readFileSync(CSS_FILE, 'utf8');

// Can't be hidden with CSS, so don't fail on these
export const KNOWN_LEAKS = [
  { path: 'yt-chip-cloud-chip-renderer', why: 'The "Shorts" filter chip on search results has no attribute to select it by, only its text' },
];
export const isKnownLeak = leak => KNOWN_LEAKS.some(k => leak.path.includes(k.path));

// Selectors from the CSS file, used to work out which rule hid what
export const selectors = css
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .split('}')
  .flatMap(block => splitTopLevel(block.split('{')[0] ?? ''))
  .map(s => s.replace(/\s+/g, ' ').replace(/\( /g, '(').replace(/ \)/g, ')').trim())
  .filter(Boolean);

// Split on commas outside of :is()/:has()/:not()
function splitTopLevel(list) {
  const parts = [''];
  let depth = 0;
  for (const ch of list) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) parts.push('');
    else parts[parts.length - 1] += ch;
  }
  return parts;
}

// Runs in the page
function auditInPage({ css, selectors }) {
  const SHORTS_LINK = 'a[href*="/shorts/"]';
  const REGULAR_LINK = 'a[href*="/watch?v="], a[href*="/playlist?list="], a[href^="/post/"]';
  const LABEL = 'Shorts';

  const isVisible = el => el.checkVisibility({ visibilityProperty: true, contentVisibilityAuto: false });
  const ownText = el => [...el.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim();
  const path = el => {
    const parts = [];
    for (let e = el; e && e !== document.body && parts.length < 6; e = e.parentElement) {
      if (e.tagName.includes('-') || e.id) parts.push(e.tagName.toLowerCase() + (e.id ? `#${e.id}` : ''));
    }
    return parts.join(' < ');
  };
  const describe = el => ({ path: path(el), text: (el.innerText || el.getAttribute('title') || '').replace(/\s+/g, ' ').trim().slice(0, 80) });

  const all = [...document.body.querySelectorAll('*')];
  const before = new Map(all.map(el => [el, isVisible(el)]));

  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
  const after = new Map(all.map(el => [el, isVisible(el)]));
  const visibleNow = el => after.get(el) ?? isVisible(el);

  // Shorts on the page before hiding
  const shortsLinks = [...document.querySelectorAll(SHORTS_LINK)].filter(el => before.get(el));
  const shortsLabels = all.filter(el => before.get(el) && ownText(el) === LABEL);

  // Outermost hidden elements and the rules that hid them
  const newlyHidden = all.filter(el => before.get(el) && !after.get(el));
  const matching = el => selectors.filter(sel => { try { return el.matches(sel); } catch { return false; } });
  const hiddenByRule = new Map(newlyHidden.map(el => [el, matching(el)]).filter(([, rules]) => rules.length));
  const roots = [...hiddenByRule].map(([el, rules]) => ({ el, rules })).filter(({ el }) => {
    for (let p = el.parentElement; p; p = p.parentElement) if (hiddenByRule.has(p)) return false;
    return true;
  });

  const wronglyHidden = [];
  for (const { el, rules } of roots) {
    const regular = [...el.querySelectorAll(REGULAR_LINK)].filter(a => before.get(a));
    const isShortsContent = shortsLinks.some(a => el.contains(a)) || shortsLabels.some(l => el.contains(l));
    if (regular.length) {
      wronglyHidden.push({ rules, ...describe(el), reason: `hid ${regular.length} regular video/playlist link(s)`, example: regular[0].getAttribute('href').slice(0, 60) });
    } else if (!isShortsContent) {
      wronglyHidden.push({ rules, ...describe(el), reason: 'hid an element with no Shorts in it' });
    }
  }

  const leaks = [
    ...shortsLinks.filter(visibleNow).map(a => ({ kind: 'shorts link', href: a.getAttribute('href').slice(0, 40), ...describe(a) })),
    ...shortsLabels.filter(visibleNow).map(el => ({ kind: '"Shorts" label', ...describe(el) })),
  ];

  // Remove it again
  style.remove();

  const regularLinks = [...document.querySelectorAll(REGULAR_LINK)].filter(a => before.get(a));
  return {
    url: location.href,
    counts: { regularLinks: regularLinks.length, shortsLinks: shortsLinks.length, shortsLabels: shortsLabels.length, hiddenRoots: roots.length },
    ruleUsage: Object.fromEntries(selectors.map(sel => [sel, roots.filter(r => r.rules.includes(sel)).length])),
    wronglyHidden: dedupe(wronglyHidden),
    leaks: dedupe(leaks),
  };

  function dedupe(items) {
    const seen = new Map();
    for (const item of items) {
      const key = `${item.kind ?? item.reason}|${item.path}|${item.rules ?? ''}`;
      seen.set(key, { ...item, count: (seen.get(key)?.count ?? 0) + 1 });
    }
    return [...seen.values()];
  }
}

export async function auditPage(page) {
  return page.evaluate(auditInPage, { css, selectors });
}
