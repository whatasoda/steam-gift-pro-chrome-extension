import { escapeGameTitle } from './utils/escape-game-title';
import { sendSteamSearchMessage } from './utils/background-fetch';
import { SEARCH_URL } from './utils/constants';

const LIST_START = '<!-- List Items -->';
const LIST_END = '<!-- End List Items -->';

export const steamSearch = async (gameTitle: string) => {
  const escapedTitle = escapeGameTitle(gameTitle);
  const rawHTML = await sendSteamSearchMessage(escapedTitle);

  const listStart = rawHTML.indexOf(LIST_START);
  const listEnd = rawHTML.indexOf(LIST_END);
  if (listStart === -1 || listEnd === -1) {
    return null;
  }

  const listHTML = rawHTML.slice(listStart + LIST_START.length, listEnd);
  if (!listHTML) {
    return null;
  }
  const container = document.createElement('div');
  container.innerHTML = listHTML;

  const elementList = Array.from(
    container.querySelectorAll<HTMLAnchorElement>('a[href^="https://store.steampowered.com/"]'),
  );

  const gameList = elementList.map((element) => {
    const href = element.href.replace(/\?.+$/, '');
    const title = element.querySelector('span.title')?.textContent ?? 'Unknown';
    return { href, title };
  });

  const searchPageURL = `${SEARCH_URL}?term=${escapedTitle}`;
  return { gameList, searchPageURL, escapedTitle };
};
