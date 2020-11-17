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
  'https://community.cloudflare.steamstatic.com/',
  'https://cdn.cloudflare.steamstatic.com/',
];

export const predefinedContents = {
  'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/753/135dc1ac1cd9763dfc8ad52f4e880d2ac058a36c.jpg':
    '/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAIAAgAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A+TPDHh+DVLdri5Yyyud7u/JY1t/8IbYf3F/KsPwtq39l2y22oRS2E+0EJcIVLDsRkdPeu28OWd14s1qy0rSlF3e3kgiijRupPcnsB1J7AE1gzRG74E/Zk8Q/EizlvdE0gS2ETbGvLiRIYt3oGcjcfpnHeuQ+Lnwc1r4S3iW2tabNpN+B5sL8FXH95HUkN+B471+gdrZ+EfBF9o2j+Mm04eHtO0W2t9Ok1PYLA3YaT7U7b/kErDyiC3OC+3+KvAP2zvEGgr8FgLDDaY/iE/8ACNp0xa/Z188xZ58jzd+3HHKY+XbVBc88+EXxZ8C+NPDUPh/xB9j80KFW21eNQu7plJDwD6YIavR7bwLo3wXju/FXh3RYIZbSKSS5+0tLLKYOCyxMXwjAA4ypLfdyM5r87BczabPLbzxSRTRuVdHBBU+hr122/at8SxaHFZXFjY393CqCO/uXuWO5MbJHgEwt5JFwpDvExyATkjNa38jM+jfjN+2Fc+F7+80Dwuok1S2kaG6vrhMxwupwyIp+8wIIJPAxwD1Hyl8Tfid4i+JWoLqPiPVZtUulXYhkwFjXPRVACqPoOa4m58QTXlzLcTvJNPK5kkkcks7E5JJ7kmoGuZ9RnitoInmmkcKiICSxPYVLuxqyP//Z',
};

export const COMMON_HTTP_HEADER = {
  'Chrome-Extension-Id': 'mfcdhhliiebfhodiojakbclkgfcplleo',
};
