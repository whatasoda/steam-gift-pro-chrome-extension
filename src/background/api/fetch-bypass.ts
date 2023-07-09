import { COMMON_HTTP_HEADER, fetchBypassUrlList } from '../../constants';

export const fetchBypass = (_: any, baseUrl: typeof fetchBypassUrlList[number], extraUrl: string) => {
  if (!fetchBypassUrlList.includes(baseUrl)) {
    return null;
  }

  const url = new URL(baseUrl + extraUrl);
  switch (baseUrl) {
    case 'https://cdn.akamai.steamstatic.com/': {
      return customFetch(url.toString());
    }
  }
};

const serializeHeaders = (headers: Headers) => {
  const headerRecord: Record<string, string | string[]> = {};
  headers.forEach((value: string, name: string) => {
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
