import { sendBackgroundMessage } from './send-message';
import { fetchBypassUrlList, FetchBypassUrl, predefinedContents } from './constants';

const nativeFetch = window.fetch;

const urlPattern = new RegExp(`^(${fetchBypassUrlList.map((url) => url.replace(/\./g, '\\.')).join('|')})(.*)$`);

export const fetch: typeof window.fetch = (input, init) => {
  if (typeof input === 'string' && input in predefinedContents) {
    const body = predefinedContents[input as keyof typeof predefinedContents];
    return Promise.resolve(new Response(stringToBuffer(atob(body)), { status: 200, statusText: 'OK' }));
  }

  const req = typeof input === 'string' ? new Request(input, init) : input;

  if (req.method.toUpperCase() === 'GET') {
    const match = req.url.match(urlPattern) || [];
    const [, baseUrl = '', extraUrl = ''] = match;
    if (baseUrl) {
      return sendBackgroundMessage('fetch-bypass', baseUrl as FetchBypassUrl, extraUrl).then((res) => {
        if (res) {
          const { body, headers, status, statusText } = res;
          const r = new Response(stringToBuffer(atob(body)), {
            headers: createHeaders(headers),
            status,
            statusText,
          });
          return r;
        }
        return nativeFetch(req);
      });
    }
  }
  return nativeFetch(req);
};

const createHeaders = (headerRecord: Record<string, string | string[]>) => {
  const acc = new Headers();
  Object.entries(headerRecord).forEach(([key, values]) => {
    (Array.isArray(values) ? values : [values]).forEach((value) => {
      acc.append(key, value);
    });
  });
  return acc;
};

const stringToBuffer = (str: string) => {
  return new Uint8Array([...str].map((c) => c.charCodeAt(0))).buffer;
};
