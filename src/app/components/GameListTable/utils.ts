import { useEffect, useMemo, useState } from 'react';
import type { Entity } from '@whatasoda/browser-extension-toolkit/data-storage';
import type { GameFlat } from './container';
import { sendBackgroundMessage } from '../../../utils/send-message';
import { ColumnInstance } from 'react-table';
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
