declare module '*.css' {}

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

interface RgGame {
  appid: number;
  logo: string;
  name: string;
  availStatLinks: {} /* unnecessary  */;
}

interface Histogram {
  end_date: number;
  start_date: number;
  recent: ReviewPeriod[];
  rollup_type: 'month' | 'week';
  rollups: ReviewPeriod[];
  weeks: never[];
}
interface ReviewPeriod {
  date: number;
  recommendations_up: number;
  recommendations_down: number;
}
interface GameMetadata {
  releaseDate: Date | null;
  tags: string[];
}
