import { fetchBypassUrlList } from '../../utils/constants';

export const fetchBypass = (_: any, baseUrl: typeof fetchBypassUrlList[number], extraUrl: string) => {
  if (!fetchBypassUrlList.includes(baseUrl)) {
    return null;
  }

  const url = new URL(baseUrl + extraUrl);
  switch (baseUrl) {
    case 'https://store.steampowered.com/search/': {
      const term = url.searchParams.get('term');
      if (url.pathname === '/search/' && term !== null) {
        return customFetch(`https://store.steampowered.com/search/?term=${encodeURIComponent(term)}`, { mode: 'cors' });
      }
      return null;
    }
    case 'https://steamcdn-a.akamaihd.net/':
    case 'https://steamcommunity-a.akamaihd.net/': {
      if (/^((steamcommunity\/)?(public\/)?(shared\/)?(economy\/)?(images?|css))\//.test(extraUrl)) {
        return customFetch(url.href, { mode: 'cors' });
      }
      return null;
    }
  }
};

const serializeHeaders = (headers: Headers) => {
  const headerRecord: Record<string, string | string[]> = {};
  headers.forEach((value, name) => {
    const existing = headerRecord[name];
    headerRecord[name] = existing ? [...(Array.isArray(existing) ? existing : [existing]), value] : value;
  });
  return headerRecord;
};

const customFetch = async (...args: Parameters<typeof window.fetch>) => {
  try {
    const res = await fetch(...args);
    const body = bufferToString(await res.arrayBuffer());
    return {
      body,
      headers: serializeHeaders(res.headers),
      status: res.status,
      statusText: res.statusText,
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return null;
  }
};

const bufferToString = (buffer: ArrayBuffer) => {
  const arr = new Uint8Array(buffer);
  const acc: string[] = [];
  for (let i = 0, length = arr.length; i < length; i += 1000) {
    const subarray = arr.subarray(i, Math.min(i + 1000, length));
    acc.push(String.fromCharCode.apply('', (subarray as unknown) as number[]));
  }
  return btoa(acc.join(''));
};
