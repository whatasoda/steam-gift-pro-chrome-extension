import { useEffect, useMemo, useState } from 'react';
import type { Entity } from '@whatasoda/browser-extension-toolkit/data-storage';
import type { GameFlat } from './container';
import { sendBackgroundMessage } from '../../../utils/send-message';
import { ColumnInstance, FilterType } from 'react-table';
import { debounce } from '../../../utils/debounce';

export const useGameEntities = (getVisibleItemIds: () => number[]) => {
  const [entities, setEntities] = useState<Entity<Game>[]>([]);

  const onUpdateAllGameData = async () => {
    await sendBackgroundMessage('updateGameData', getVisibleItemIds());
    await refreshItems();
  };

  const onUpdateGameData = async (appId: number) => {
    const promise = sendBackgroundMessage('updateGameData', [appId]);
    const index = await new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(entities.findIndex((entity) => entity.data.appId === appId));
      }, 0);
    });

    const [next] = await promise;
    if (!next || index === -1) {
      // eslint-disable-next-line no-console
      console.log('Something wrong happened');
      return;
    }
    setEntities((curr) => {
      return [...curr.slice(0, index), next, ...curr.slice(index + 1)];
    });
  };

  const refreshItems = async () => {
    setEntities(await sendBackgroundMessage('getAllGames'));
  };

  return [entities, { onUpdateAllGameData, onUpdateGameData, refreshItems }] as const;
};

const defaultStart = 946684800000; // 2000/01/01;
const defaultEndDate = new Date();
defaultEndDate.setUTCMonth(defaultEndDate.getUTCMonth() + 1);
defaultEndDate.setUTCDate(1);
const defaultEnd = defaultEndDate.setUTCHours(0, 0, 0, 0);

export const useTerm = () => {
  const [start, setTermStart] = useState(defaultStart);
  const [end, setTermEnd] = useState(defaultEnd);

  const term = useMemo<MinMax>(() => [start, end], [start, end]);

  return { term, setTermStart, setTermEnd };
};

export const useBetweenFilter = <T extends object = {}>(column: ColumnInstance<T>, minmax: MinMax) => {
  const [propotion, setPropotion] = useState<MinMax>([0.0, 1.0]);
  const [setFilter, setFilterRef] = useMemo(() => {
    const ref = { current: column.setFilter as (value: MinMax | null) => void };
    const func = debounce((value: MinMax | null) => ref.current(value), 200);
    return [func, ref] as const;
  }, []);
  setFilterRef.current = column.setFilter;

  useEffect(() => {
    setPropotion([0.0, 1.0]);
    setFilter(null);
  }, minmax);

  const setRange = (next: MinMax) => {
    setPropotion(next);
    const [min, max] = minmax;
    const range = max - min;
    setFilter([min + range * next[0], min + range * next[1]]);
  };

  const clearRange = () => {
    setPropotion([0, 1.0]);
    setFilter(null);
  };

  return { propotion, setRange, clearRange };
};

export const useGameFlatList = (entities: Entity<Game>[], term: MinMax) => {
  return useMemo(() => {
    const minmax: Record<'up' | 'down' | 'comp', MinMax> = {
      up: [Infinity, 0],
      down: [Infinity, 0],
      comp: [Infinity, -Infinity],
    };
    const tagAcc = new Set<string>();

    const games = entities.map<GameFlat>(({ data: { review, ...dataRest }, ...entityRest }) => {
      dataRest.tags?.forEach((tag) => tagAcc.add(tag));
      const reviews = review ? collectReviewCount(review, term) : { up: 0, down: 0, comp: 0 };
      // up
      minmax.up[0] = Math.min(minmax.up[0], reviews.up);
      minmax.up[1] = Math.max(minmax.up[1], reviews.up);
      // down
      minmax.down[0] = Math.min(minmax.down[0], reviews.down);
      minmax.down[1] = Math.max(minmax.down[1], reviews.down);
      // comp
      minmax.comp[0] = Math.min(minmax.comp[0], reviews.comp);
      minmax.comp[1] = Math.max(minmax.comp[1], reviews.comp);
      return { ...entityRest, ...dataRest, ...reviews };
    });
    const tags = [...tagAcc];

    return { games, minmax, tags };
  }, [entities, term]);
};

export const collectReviewCount = (review: ReviewHistogram, [start, end]: MinMax) => {
  start /= 1000;
  end /= 1000;
  const { start_date, end_date } = review;
  const rollups = end_date < start || end < start_date ? [] : review.rollups;
  let up = 0;
  let down = 0;
  let comp = 0;
  for (const [date, u, d] of rollups) {
    if (date < start) continue;
    if (date > end) break;
    up += u;
    down += d;
    comp += u - d;
  }
  return { up, down, comp };
};

interface GameListFilterValue {
  includes: number[];
  excludes: number[];
}
export const gameListFilter: FilterType<GameFlat> = (rows, _: any, filterValue: GameListFilterValue) => {
  return rows.filter(({ original: { appId } }) => {
    return filterValue.includes.includes(appId) && !filterValue.excludes.includes(appId);
  });
};
gameListFilter.autoRemove = (filterValue: GameListFilterValue | null) => {
  return !filterValue || (filterValue.excludes.length === 0 && filterValue.includes.length === 0);
};

type GameListRecord = Partial<Record<string, Entity<CustomGameList>>>;
type UserRecord = Partial<Record<string, Entity<User>>>;
export const useGameListFilter = (column: ColumnInstance<GameFlat>) => {
  const filterValue = column.filterValue as GameListFilterValue | null;
  const setFilterValue = column.setFilter as (next: GameListFilterValue | null) => void;
  const [gameLists, setGameLists] = useState<GameListRecord>({});
  const [users, setUsers] = useState<UserRecord>({});
  const [includes, setIncludes] = useFilterState('includes', setFilterValue, filterValue, { gameLists, users });
  const [excludes, setExcludes] = useFilterState('excludes', setFilterValue, filterValue, { gameLists, users });

  const fetchGameList = async () => {
    const [gameLists, users] = await Promise.all([
      sendBackgroundMessage('getAllGameLists').then((entities) => {
        return entities.reduce<GameListRecord>((acc, entity) => ((acc[entity.index] = entity), acc), {});
      }),
      sendBackgroundMessage('getAllUsers').then((entities) => {
        return entities.reduce<UserRecord>((acc, entity) => ((acc[entity.index] = entity), acc), {});
      }),
    ]);
    setGameLists(gameLists);
    setUsers(users);
  };

  const clearFilter = (kind: keyof GameListFilterValue | 'all') => {
    switch (kind) {
      case 'all':
        return setFilterValue(null);
      case 'includes':
        return setFilterValue({ excludes: [], ...filterValue, includes: [] });
      case 'excludes':
        return setFilterValue({ includes: [], ...filterValue, excludes: [] });
    }
  };

  const addFilter = (kind: keyof GameListFilterValue, index: string) => {
    const { value, setValue } = {
      includes: { value: includes, setValue: setIncludes },
      excludes: { value: excludes, setValue: setExcludes },
    }[kind];
    if (value.includes(index)) return;
    setValue([...value, index]);
  };

  const removeFilter = (kind: keyof GameListFilterValue, index: string) => {
    const { value, setValue } = {
      includes: { value: includes, setValue: setIncludes },
      excludes: { value: excludes, setValue: setExcludes },
    }[kind];
    const idx = value.indexOf(index);
    if (idx === -1) return;
    setValue([...value.slice(0, idx), ...value.slice(idx + 1)]);
  };

  return { fetchGameList, includes, excludes, gameLists, users, addFilter, removeFilter, clearFilter };
};
const useFilterState = (
  kind: keyof GameListFilterValue,
  setFilterValue: (next: GameListFilterValue | null) => void,
  filterValue: GameListFilterValue | null,
  deps: { gameLists: GameListRecord; users: UserRecord },
) => {
  const state = useState<string[]>([]);
  const [filter] = state;
  const { gameLists, users } = deps;
  useEffect(() => {
    const appIds = new Set<number>();
    filter.forEach((index) => {
      const entity = gameLists[index] || users[index] || null;
      entity?.data.games.forEach((appId) => appIds.add(appId));
    });
    setFilterValue({
      excludes: [],
      includes: [],
      ...filterValue,
      [kind]: [...appIds],
    });
  }, [gameLists, users, filter]);

  return state;
};
