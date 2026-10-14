<div align="center">
  <img src="icons/icon128.png" width="80" alt="Hide YouTube Shorts icon" />
  <h1>Hide YouTube Shorts</h1>
  <p>Hide YouTube Shorts videos effortlessly with this powerful browser extension</p>
</div>

## Installation - Unpacked extension
1. Download the `.zip` file for `chrome` or `firefox` from [latest release](https://github.com/probablyraging/hide-youtube-shorts/releases)
2. Extract the contents of `hide-youtube-shorts-<browser>.zip`
3. Load the unpacked directory in the Chrome/Firefox extension manager

[Chrome Written Guide](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked) | [Firefox Written Guide](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing) | [Chrome/Firefox Video Guide](https://www.youtube.com/watch?v=dhaGRJvJAII)

## Permanent install - Firefox
Create a signed `.xpi` that you can install like a regular extension. Requires JDK 17 or newer

1. Create `.env` in the root and add your own Mozilla `WEB_EXT_API_KEY` and `WEB_EXT_API_SECRET` credentials
2. Build the extension with `./gradlew build` - outputs to `dist/`
3. Sign the build with `./gradlew signFirefox` - the `.xpi` outputs to `web-ext-artifacts/`

## Shorts videos are hidden from
- ✅ Home page
- ✅ Subscriptions feed
- ✅ Search results 
- ✅ User's channel pages
- ✅ The notifications menu
- and anywhere else they usually appear

## License
Copyright © 2022-2026 zevnda — **[MIT License](./LICENSE)**
