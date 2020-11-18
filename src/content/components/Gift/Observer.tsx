import React, { useEffect, useState } from 'react';
import { Controller } from './Controller';

export const CONTENT_BOX_SELECTOR = 'div[id^="pending_gift_iteminfo_"][id$="_content"]';
export const TITLE_SELECTOR = 'h1[id^="pending_gift_iteminfo_"][id$="_item_name"]';
export const THUMBNAIL_SELECTOR = 'img[id^="pending_gift_iteminfo_"][id$="_item_icon"]';

export const GiftObserver = () => {
  const [giftItems, setGiftItems] = useState<GiftItem[]>([]);

  useEffect(() => {
    const parseGiftItem = createGiftItemParser((item) => {
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

interface GiftRawInfo {
  id: string;
  name: string;
  actions: { name: string; link: string }[];
}

const createGiftItemParser = (addItem: (item: GiftItem) => void) => {
  return async function parseGiftItem(contentBox: HTMLElement) {
    const id = ~~contentBox.id.slice(/* pending_gift_iteminfo_ */ 22, -8 /* _content */);
    const container = contentBox.parentElement?.parentElement?.parentElement?.parentElement;
    if (!container) return;

    const dataContainer = container.querySelector('script');
    if (!dataContainer) return;

    const [dataJSON] = dataContainer.innerHTML.match(
      /(?<=^\s*BuildHover\(\s*'pending_gift_iteminfo_\d+',\s*).+(?=,\s*UserYou\s*\);$)/m,
    ) || ['{}'];

    let data: GiftRawInfo;
    try {
      data = JSON.parse(dataJSON) as GiftRawInfo;
    } catch (e) {
      return;
    }
    if (!data) return;

    const { actions, name } = data;
    const action = actions.find(({ link }) => link && link.startsWith('https://store.steampowered.com/app/'));
    if (!action) return;

    addItem({
      id,
      title: name,
      link: action.link,
      contentBox,
      container,
    });
  };
};
