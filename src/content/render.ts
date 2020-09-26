import { searchSteamStore } from './search-steam-store';
import { takeScreenshot } from './screenshot';

export const CONTENT_BOX_SELECTOR = 'div[id^="pending_gift_iteminfo"][id$="_content"]';
export const TITLE_SELECTOR = 'h1[id^="pending_gift_iteminfo"][id$="_item_name"]';
export const THUMBNAIL_SELECTOR = 'img[id^="pending_gift_iteminfo"][id$="_item_icon"]';

const ANCHOR_ATTR = 'target="_blank" style="color: rgb(60, 108, 150);"';
const MAX_RETRY = 5;

export const renderSearchResult = async (box: HTMLElement, retryCount: number = 0) => {
  const container = box.parentElement?.parentElement?.parentElement?.parentElement;
  const wrapper = document.createElement('div');
  const onFail = (reason: string) => {
    wrapper.innerText = 'Sorry, Search Failed:' + reason;
    box.appendChild(wrapper);
  };

  try {
    const titleElement = box.querySelector(TITLE_SELECTOR);
    const thumbnail = box.querySelector(THUMBNAIL_SELECTOR);
    if (!titleElement?.textContent) {
      if (retryCount < MAX_RETRY) {
        return await new Promise((resolve) => {
          setTimeout(() => resolve(renderSearchResult(box, retryCount + 1)), 300);
        });
      } else {
        return onFail('Title not found');
      }
    }

    const title = titleElement?.textContent;
    const searchResult = await searchSteamStore(title);
    thumbnail!.addEventListener('click', () => takeScreenshot(container!, title));

    if (!searchResult || !searchResult.gameList.length) {
      return onFail('No result.');
    }

    const { gameList, searchPageURL, gameTitle } = searchResult;

    wrapper.innerHTML = [
      `${gameList.length} items found with <a href="${searchPageURL}" ${ANCHOR_ATTR}>'${gameTitle}'</a>:`,
      '<ul>',
      gameList.reduce((acc, { href, title }) => {
        return acc + `<li><a href="${href}" ${ANCHOR_ATTR}>${title}</a></li>`;
      }, ''),
      '</ul>',
    ].join('');
    box.appendChild(wrapper);
  } catch (e) {
    return onFail(`Unknown Error ${e?.message}`);
  }
};
