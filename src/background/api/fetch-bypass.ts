import { COMMON_HTTP_HEADER, fetchBypassUrlList } from '../../utils/constants';

export const fetchBypass = (_: any, baseUrl: typeof fetchBypassUrlList[number], extraUrl: string) => {
  if (!fetchBypassUrlList.includes(baseUrl)) {
    return null;
  }

  const url = new URL(baseUrl + extraUrl);
  switch (baseUrl) {
    case 'https://store.steampowered.com/search/results/': {
      const { searchParams } = url;
      const infinite = searchParams.get('infinite') || '0';
      const term = searchParams.get('term');
      const start = searchParams.get('start') || '0';
      const count = searchParams.get('count') || '50';
      if (url.pathname === '/search/results/' && term !== null && /^\d+$/.test(start) && /^\d+$/.test(count)) {
        return customFetch(
          'https://store.steampowered.com/search/results/?' +
            new URLSearchParams({ infinite, term, start, count }).toString(),
          { mode: 'cors' },
        );
      }
      return null;
    }
    case 'https://store.steampowered.com/appreviewhistogram/':
    case 'https://store.steampowered.com/apphover/': {
      const gameId = Number(extraUrl.replace(/(?<=^\d+)[^0-9].*$/, ''));
      return gameId === gameId ? customFetch(baseUrl + gameId) : null;
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
    const req = new Request(...args);
    Object.entries(COMMON_HTTP_HEADER).forEach((entry) => req.headers.set(...entry));
    const res = await fetch(req);
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
