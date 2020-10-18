interface SteamSearchResult {
  games: GameItem[];
  next: SetamSearchPrams | null;
}
interface SetamSearchPrams {
  term: string;
  start: number;
  count: number;
}

interface GameItem {
  href: string;
  title: string;
  thumbnail: { src?: string; srcSet?: string };
}

interface GiftItem {
  id: number;
  title?: string;
  container: HTMLElement;
  contentBox: HTMLElement;
}
