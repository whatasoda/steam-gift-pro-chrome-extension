export const SEARCH_URL = 'https://store.steampowered.com/search/results/';

export type FetchBypassUrl = typeof fetchBypassUrlList[number];
export const fetchBypassUrlList = ['https://cdn.akamai.steamstatic.com/'] as const;

export const steamCDNList = [
  'https://cdn.akamai.steamstatic.com/',
  'https://steamcommunity-a.akamaihd.net/',
  'https://steamcdn-a.akamaihd.net/',
  'https://cdn.cloudflare.steamstatic.com/',
  'https://community.cloudflare.steamstatic.com/',
];

export const COMMON_HTTP_HEADER = {
  'Chrome-Extension-Id': 'mfcdhhliiebfhodiojakbclkgfcplleo',
};
