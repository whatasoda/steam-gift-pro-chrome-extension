const IMAGE_URL_PREFIX = 'https://cdn.cloudflare.steamstatic.com/steam/apps/';
const STORE_URL_PREFIX = 'https://store.steampowered.com/app/';
const BACKGROUND_ATTRIBUTE_NAME = 'data-background-image-url';
const SELECTOR = `[${BACKGROUND_ATTRIBUTE_NAME}^="${IMAGE_URL_PREFIX}"], img[src^="${IMAGE_URL_PREFIX}"]:not(.movie_thumb)`;

const applyStoreLink = (elem: HTMLElement, listenerMap: Map<string, () => void>) => {
  let parent: HTMLElement = elem;
  while (parent !== document.body) {
    if (parent instanceof HTMLAnchorElement || !parent.parentElement) {
      return;
    } else {
      parent = parent.parentElement;
    }
  }

  const imageUrl = elem.getAttribute(elem instanceof HTMLImageElement ? 'src' : BACKGROUND_ATTRIBUTE_NAME);
  if (!imageUrl) return;

  const appId = imageUrl.slice(IMAGE_URL_PREFIX.length).replace(/(?<=^\d+)\/.*$/, '');
  const storeUrl = `${STORE_URL_PREFIX}${appId}/`;
  if (elem.parentElement!.classList.contains('highlight_strip_item')) return;
  if (window.location.href.startsWith(storeUrl)) return;

  if (!listenerMap.has(appId)) {
    listenerMap.set(appId, () => {
      window.open(storeUrl, '_blank');
    });
  }
  const listener = listenerMap.get(appId)!;

  elem.style.cursor = 'pointer';
  elem.removeEventListener('click', listener);
  elem.addEventListener('click', listener);
};

export const createScanner = () => {
  const listenerMap = new Map<string, () => void>();
  const scanNode = (node: Node) => {
    if (node instanceof HTMLElement) {
      node.querySelectorAll<HTMLElement>(SELECTOR).forEach((elem) => {
        applyStoreLink(elem, listenerMap);
      });
    }
  };

  const observer = new MutationObserver((records) => {
    records.forEach(({ addedNodes }) => {
      addedNodes.forEach((node) => scanNode(node));
    });
  });

  const start = () => {
    scanNode(document.body);
    return observer.observe(document, { childList: true, subtree: true });
  };

  return { observer, start };
};
