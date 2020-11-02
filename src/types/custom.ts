export {};
declare global {
  type MinMax = [min: number, max: number];

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

  interface CustomGameList {
    id: number;
    name: string;
    description: string;
    games: number[];
    comments: Record<number, string>;
  }

  interface User extends CustomGameList {
    profileLink: string;
  }

  interface Game {
    appId: number;
    logo: string | null;
    name: string | null;
    tags: string[] | null;
    releaseDate: number | null;
    review: ReviewHistogram | null;
  }

  interface ReviewHistogram {
    end_date: number;
    start_date: number;
    recent: RecommendationRecord[];
    rollup_type: 'month' | 'week';
    rollups: RecommendationRecord[];
    weeks: never[];
  }
  type RecommendationRecord = [date: number, recommendations_up: number, recommendations_down: number];

  interface GameMetadata extends Pick<Game, 'name' | 'releaseDate' | 'tags'> {}
}
