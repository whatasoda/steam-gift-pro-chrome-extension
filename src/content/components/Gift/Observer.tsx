import React, { useEffect, useState } from 'react';
import { waitFor } from '../../../utils/wait';
import { Controller } from './Controller';

export const CONTENT_BOX_SELECTOR = 'div[id^="pending_gift_iteminfo_"][id$="_content"]';
export const TITLE_SELECTOR = 'h1[id^="pending_gift_iteminfo_"][id$="_item_name"]';
export const THUMBNAIL_SELECTOR = 'img[id^="pending_gift_iteminfo_"][id$="_item_icon"]';

export const GiftObserver = () => {
  const [giftItems, setGiftItems] = useState<GiftItem[]>([]);

  useEffect(() => {
    const parseGiftItem = createGiftItemParser(50, 100, (item) => {
      setGiftItems((curr) => [...curr, item]);
    });

    const observer = new MutationObserver((records) => {
      records.forEach(({ addedNodes }) => {
        forEachBoxElement(addedNodes, parseGiftItem);
      });
    });
    observer.observe(document, { childList: true, subtree: true });
    forEachBoxElement(document.body.childNodes, parseGiftItem);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {giftItems.map((giftItem) => (
        <Controller key={giftItem.id} {...giftItem} />
      ))}
    </>
  );
};

const forEachBoxElement = (nodes: NodeList, callback: (node: HTMLElement) => void) => {
  nodes.forEach((node) => {
    if (node instanceof HTMLElement) {
      node.querySelectorAll<HTMLElement>(CONTENT_BOX_SELECTOR).forEach((contentBox) => {
        callback(contentBox);
      });
    }
  });
};

const createGiftItemParser = (maxRetryCount: number, timeout: number, addItem: (item: GiftItem) => void) => {
  return async function parseGiftItem(contentBox: HTMLElement) {
    const id = ~~contentBox.id.slice(/* pending_gift_iteminfo_ */ 22, -8 /* _content */);
    const container = contentBox.parentElement?.parentElement?.parentElement?.parentElement;

    if (!container) return;

    const title = await waitFor(maxRetryCount, timeout, () => {
      const titleElement = contentBox.querySelector(TITLE_SELECTOR);
      return titleElement?.textContent || null;
    });

    addItem({
      id,
      title: title || undefined,
      contentBox,
      container,
    });
  };
};
