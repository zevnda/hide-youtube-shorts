// shorts: fail if no Shorts are found on the page
// viewport: window size override (e.g. for the mini sidebar)
// prepare: runs after load, e.g. to open a menu

export const desktopPages = [
  { name: 'home', url: '/', shorts: true },
  { name: 'home (mini sidebar)', url: '/', viewport: { width: 1000, height: 900 } },
  { name: 'subscriptions', url: '/feed/subscriptions', shorts: true },
  { name: 'you', url: '/feed/you' },
  { name: 'history', url: '/feed/history' },
  { name: 'playlists', url: '/feed/playlists' },
  { name: 'watch later', url: '/playlist?list=WL' },
  { name: 'liked videos', url: '/playlist?list=LL' },
  { name: 'search', url: '/results?search_query=minecraft', shorts: true },
  { name: 'search (music)', url: '/results?search_query=taylor+swift' },
  { name: 'channel home', url: '/@mkbhd', shorts: true },
  { name: 'channel videos', url: '/@mkbhd/videos' },
  { name: 'watch', url: '/watch?v=dQw4w9WgXcQ' },
  { name: 'explore: music', url: '/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ' },
  { name: 'explore: gaming', url: '/gaming' },
  { name: 'explore: news', url: '/channel/UCYfdidRxbB8Qhf0Nx7ioOYw' },
  { name: 'explore: sports', url: '/channel/UCEgdi0XIXXZ-qJOFPf4JSKw' },
  { name: 'explore: learning', url: '/channel/UCtFRv9O2AHqOZjjynzrv-xg' },
  { name: 'explore: podcasts', url: '/podcasts' },
  { name: 'explore: fashion & beauty', url: '/channel/UCrpQ4p1Ql_hG8rKXIKM1MOQ' },
  {
    name: 'notifications',
    url: '/',
    prepare: async page => {
      await page.locator('ytd-notification-topbar-button-renderer button, #button[aria-label^="Notifications"]').first().click();
      await page.locator('ytd-notification-renderer').first().waitFor({ timeout: 15_000 });
    },
  },
];

export const mobilePages = [
  { name: 'mobile home', url: '/' },
  { name: 'mobile search', url: '/results?search_query=minecraft', shorts: true },
  { name: 'mobile subscriptions', url: '/feed/subscriptions', shorts: true },
  { name: 'mobile channel', url: '/@mkbhd', shorts: true },
  { name: 'mobile watch', url: '/watch?v=dQw4w9WgXcQ' },
];
