import { SEARCH_URL } from '../utils/constants';

const LIST_START = '<!-- List Items -->';
const LIST_END = '<!-- End List Items -->';

export const searchSteamStore = async (gameTitle: string) => {
  const res = await fetch(`https://store.steampowered.com/search/?term=${encodeURIComponent(gameTitle)}`);
  const rawHTML = await res.text();

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

  const searchPageURL = `${SEARCH_URL}?term=${encodeURIComponent(gameTitle)}`;
  return { gameList, searchPageURL, gameTitle };
};
