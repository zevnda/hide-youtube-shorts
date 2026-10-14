# E2E tests

Runs the CSS against live YouTube (desktop and mobile) with a signed-in account. A test fails if
anything other than Shorts gets hidden, or if Shorts are still visible, and tells you which rule
caused it.

## Setup

```sh
cd e2e
npm install
npx playwright install chromium
npm run login   # sign in, then close the window
```

Use an English YouTube account. The login is saved to `e2e/.profile/`.

## Running

```sh
./gradlew assembleChrome   # from the repo root, the extension test uses dist/chrome
npm test
npm run summary            # what failed and why
```

Add `-g "home"` to run specific pages, or `HEADED=1` to watch it.

## Fixing selectors

`npm run inspect -- <url>` (add `--mobile` for m.youtube.com) shows where the Shorts are on a page.
Fix `styles/shorts-selectors.css`, then rerun. New pages go in `pages.mjs`.

If a page fails with "found none", YouTube just isn't showing that account Shorts there. Watching a
few usually fixes it.

The Shorts chip on search results can't be hidden with CSS, so it's ignored.
