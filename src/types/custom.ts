interface SearchResult {
  gameList: GameItem[];
  searchPageURL: string;
  gameTitle: string;
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
