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

interface PageData {
  userId: number;
  userName: string;
  profileLink: string;
  games: Pick<Game, 'appId' | 'logo' | 'name'>[];
}

interface Game {
  appId: number;
  logo: string | null;
  name: string | null;
  tags: string[] | null;
  releaseDate: Date | null;
  histogram: Histogram | null;
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
interface GameMetadata extends Pick<Game, 'name' | 'releaseDate' | 'tags'> {}
