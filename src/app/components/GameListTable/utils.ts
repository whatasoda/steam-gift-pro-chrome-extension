import { useEffect, useMemo, useRef, useState } from 'react';
import type { Entity } from '@whatasoda/browser-extension-toolkit/data-storage';
import type { GameFlat } from './container';
import { sendBackgroundMessage } from '../../../utils/send-message';
import { ColumnInstance, FilterType } from 'react-table';

export interface GameListRecord {
  [index: string]: Entity<CustomGameList> | undefined;
}
export interface UserRecord {
  [index: string]: Entity<User> | undefined;
}
export const useEntities = (getShownItemIds: () => number[]) => {
  const [games, setEntities] = useState<Entity<Game>[]>([]);
  const [gameLists, setGameLists] = useState<GameListRecord>({});
  const [users, setUsers] = useState<UserRecord>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchGames = async () => {
    setEntities(await sendBackgroundMessage('getAllGames'));
  };

  const fetchUsers = async () => {
    const entities = await sendBackgroundMessage('getAllUsers');
    const record = entities.reduce<UserRecord>((acc, entity) => ((acc[entity.index] = entity), acc), {});
    setUsers(record);
  };

  const fetchGameLists = async () => {
    const entities = await sendBackgroundMessage('getAllGameLists');
    const record = entities.reduce<GameListRecord>((acc, entity) => ((acc[entity.index] = entity), acc), {});
    setGameLists(record);
  };

  const onUpdateAllGameData = async () => {
    const ids = getShownItemIds();
    if (ids.length > 100) {
      const answer = window.confirm(
        `表示中の${ids.length}個のゲームの情報を更新しようとしています。この処理は時間にはかかる可能性があります。続行しますか？`,
      );
      if (!answer) return;
    }
    setIsLoading(true);
    await sendBackgroundMessage('updateGameData', getShownItemIds());
    await fetchGames();
    setIsLoading(false);
  };

  const onUpdateGameData = async (appId: number) => {
    const promise = sendBackgroundMessage('updateGameData', [appId]);
    const index = await new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(games.findIndex((entity) => entity.data.appId === appId));
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

  return [
    { games, gameLists, users },
    { isLoading, onUpdateAllGameData, onUpdateGameData, fetchGames, fetchUsers, fetchGameLists },
  ] as const;
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

interface UseGameListFilter {
  gameLists: GameListRecord;
  users: UserRecord;
}
export const useGameListFilter = (column: ColumnInstance<GameFlat>, deps: UseGameListFilter) => {
  const filterValue = column.filterValue as GameListFilterValue | null;
  const setFilterValue = column.setFilter as (next: GameListFilterValue | null) => void;
  const [includes, setIncludes] = useFilterState('includes', setFilterValue, filterValue, deps);
  const [excludes, setExcludes] = useFilterState('excludes', setFilterValue, filterValue, deps);

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

  return { includes, excludes, addFilter, removeFilter, clearFilter };
};
const useFilterState = (
  kind: keyof GameListFilterValue,
  setFilterValue: (next: GameListFilterValue | null) => void,
  filterValue: GameListFilterValue | null,
  deps: UseGameListFilter,
) => {
  const state = useState<string[]>([]);
  const [filter] = state;
  const { gameLists, users } = deps;
  useEffect(() => {
    const acc = [new Set<number>(), new Set<number>()] as const;
    let flag: 0 | 1 = 0;
    filter.forEach((index, idx) => {
      const prev = acc[flag];
      flag = flag ? 0 : 1;
      const next = acc[flag];
      const entity = gameLists[index] || users[index] || null;
      entity?.data.games.forEach((appId) => {
        if (idx && !prev.has(appId)) return;
        next.add(appId);
      });
    });
    setFilterValue({
      excludes: [],
      includes: [],
      ...filterValue,
      [kind]: [...acc[flag]],
    });
  }, [gameLists, users, filter]);

  return state;
};

export const useGameListEdit = (
  getVisibleItemIds: () => number[],
  refreshGameList: () => Promise<void>,
  gameLists: GameListRecord,
) => {
  const [editTarget, setEditTarget] = useState<string | null>(null);
  const [draft, setDraft] = useState<CustomGameList | null>(null);
  const hasUnsavedChange = useRef(false);
  const games = useRef(new Set<number>());

  useEffect(() => {
    resetDraft();
  }, [editTarget]);

  const resetDraft = () => {
    if (editTarget && gameLists[editTarget]) {
      const next = gameLists[editTarget]!;
      games.current = new Set(next.data.games);
      setDraft({ ...next.data, games: [...games.current] });
    } else {
      setDraft(null);
      setEditTarget(null);
    }
    hasUnsavedChange.current = false;
  };

  const setName = (name: string) => {
    if (!draft || draft.name === name) return;
    hasUnsavedChange.current = true;
    setDraft({ ...draft, name });
  };

  const setDescription = (description: string) => {
    if (!draft || draft.description === description) return;
    hasUnsavedChange.current = true;
    setDraft({ ...draft, description });
  };

  const addShownGames = () => addGames(...getVisibleItemIds());
  const addGames = (...appIds: number[]) => {
    if (!draft) return;
    let hasUpdated = false;
    appIds.forEach((appId) => {
      if (games.current.has(appId)) return;
      hasUpdated = true;
      games.current.add(appId);
    });
    if (!hasUpdated) return;
    hasUnsavedChange.current = true;
    setDraft({ ...draft, games: [...games.current] });
  };

  const removeShownGames = () => removeGames(...getVisibleItemIds());
  const removeGames = (...appIds: number[]) => {
    if (!draft) return;
    let hasUpdated = false;
    appIds.forEach((appId) => {
      if (!games.current.has(appId)) return;
      hasUpdated = true;
      games.current.delete(appId);
    });
    if (!hasUpdated) return;
    hasUnsavedChange.current = true;
    setDraft({ ...draft, games: [...games.current] });
  };

  const saveChanges = async () => {
    if (!editTarget || !draft) return;
    try {
      await sendBackgroundMessage('updateGameList', editTarget, draft);
      hasUnsavedChange.current = false;
      await refreshGameList();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('something wrong happened');
    }
  };

  const createGameList = async (name: string) => {
    const res = await sendBackgroundMessage('createGameList', { name, description: '', games: [] });
    if (res) {
      await refreshGameList();
      setEditTarget(res.index);
    }
  };

  return {
    selectedGames: games.current,
    hasUnsavedChange: hasUnsavedChange.current,
    draft,
    editTarget,
    setEditTarget,
    resetDraft,
    setName,
    setDescription,
    addGames,
    addShownGames,
    removeGames,
    removeShownGames,
    saveChanges,
    createGameList,
  };
};
