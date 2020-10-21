interface SearchResponse {
  success: number;
  results_html: string;
  total_count: number;
  start: number;
}

export const searchSteamStore = async ({ term, start, count }: SetamSearchPrams): Promise<SteamSearchResult | null> => {
  const res = await fetch(
    `https://store.steampowered.com/search/results/?${new URLSearchParams({
      term,
      start: start.toString(),
      count: count.toString(),
      infinite: '1',
    }).toString()}`,
  );
  const data = (await res.json()) as SearchResponse;
  const { success, results_html, total_count } = data;

  if (success !== 1) {
    // eslint-disable-next-line no-console
    console.log(data);
    return null;
  }

  const container = document.createElement('div');
  container.innerHTML = results_html;

  const games = Array.from(container.children)
    .filter((child): child is HTMLAnchorElement => child instanceof HTMLAnchorElement)
    .map<GameItem>((element) => {
      const href = element.href.replace(/\?.+$/, '');
      const title = element.querySelector('span.title')?.textContent ?? 'Unknown';
      const img = element.querySelector<HTMLImageElement>('div.search_capsule > img');
      const src = img?.src;
      const srcSet = img?.srcset;

      return { href, title, thumbnail: { src, srcSet } };
    });

  const next: SetamSearchPrams = {
    term,
    start: start + games.length,
    count: Math.min(total_count - start - games.length, count),
  };
  return {
    games,
    next: next.count <= 0 ? null : next,
  };
};
