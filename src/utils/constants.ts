export const SEARCH_URL = 'https://store.steampowered.com/search/results/';

export type FetchBypassUrl = typeof fetchBypassUrlList[number];
export const fetchBypassUrlList = [
  'https://store.steampowered.com/search/results/',
  'https://store.steampowered.com/appreviewhistogram/',
  'https://store.steampowered.com/apphover/',
] as const;

export const steamCDNList = [
  'https://steamcommunity-a.akamaihd.net/',
  'https://steamcdn-a.akamaihd.net/',
  'https://cdn.cloudflare.steamstatic.com/',
  'https://community.cloudflare.steamstatic.com/',
];

export const COMMON_HTTP_HEADER = {
  'Chrome-Extension-Id': 'mfcdhhliiebfhodiojakbclkgfcplleo',
};
