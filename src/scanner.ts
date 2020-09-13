import { CONTENT_BOX_SELECTOR, renderSearchResult } from './render';

type Timeout = ReturnType<typeof setTimeout>;

export const createScanner = () => {
  const queue: HTMLElement[] = [];
  const resolvedIdSet = new Set<string>();
  const scanNode = (node: Node) => {
    if (node instanceof HTMLElement) {
      node.querySelectorAll<HTMLElement>(CONTENT_BOX_SELECTOR).forEach((elem) => {
        queue.push(elem);
      });
      if (queue.length) dequeue();
    }
  };

  const observer = new MutationObserver((records) => {
    records.forEach(({ addedNodes }) => {
      addedNodes.forEach((node) => scanNode(node));
    });
  });

  let timeout: Timeout | null = null;
  const dequeue = async (self: Timeout | null = null) => {
    if (timeout !== self) return;
    const container = queue.shift();

    if (container && !resolvedIdSet.has(container.id)) {
      resolvedIdSet.add(container.id);
      await renderSearchResult(container);
    }

    if (queue.length) {
      timeout = setTimeout(() => dequeue(next), 300);
      const next = timeout;
    } else {
      timeout = null;
    }
  };

  const start = () => {
    scanNode(document.body);
    return observer.observe(document, { childList: true, subtree: true });
  };

  return { observer, start };
};
