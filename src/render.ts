import { steamSearch } from './search';

export const CONTENT_BOX_SELECTOR = 'div[id^="pending_gift_iteminfo"][id$="_content"]';
const TITLE_SELECTOR = 'h1[id^="pending_gift_iteminfo"][id$="_item_name"]';

const ANCHOR_ATTR = 'target="_blank" style="color: rgb(60, 108, 150);"';
const MAX_RETRY = 5;

export const renderSearchResult = async (container: HTMLElement, retryCount: number = 0) => {
  const wrapper = document.createElement('div');
  const onFail = (reason: string) => {
    wrapper.innerText = 'Sorry, Search Failed:' + reason;
    container.appendChild(wrapper);
  };

  try {
    const titleElement = container.querySelector(TITLE_SELECTOR);
    if (!titleElement?.textContent) {
      if (retryCount < MAX_RETRY) {
        return await new Promise((resolve) => {
          setTimeout(() => resolve(renderSearchResult(container, retryCount + 1)), 300);
        });
      } else {
        return onFail('Title not found');
      }
    }

    const title = titleElement?.textContent;
    const searchResult = await steamSearch(title);
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
    container.appendChild(wrapper);
  } catch (e) {
    return onFail(`Unknown Error ${e?.message}`);
  }
};
