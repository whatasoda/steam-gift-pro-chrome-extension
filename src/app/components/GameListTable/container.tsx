import React, { useEffect } from 'react';
import { TableInstance, TableOptions, useFilters, useSortBy, useTable } from 'react-table';
import type { Entity } from '@whatasoda/browser-extension-toolkit/data-storage';
import { useGameEntities, useGameFlatList, useTerm } from './utils';

export interface GameFlat extends Omit<Entity<any>, 'data'>, Omit<Game, 'review'> {
  up: number;
  down: number;
  comp: number;
}

interface RangeMinMaxRecord extends Record<'up' | 'down' | 'comp', MinMax> {}

export interface ComponentProps {
  table: TableInstance<GameFlat>;
  term: MinMax;
  // tagListRef: MutableRefObject<string[]>;
  minmax: RangeMinMaxRecord;
  indexes: Record<'up' | 'down' | 'comp', number>;
  // updateTagList: () => void;
  // onTagFilterSet: () => void;
  onUpdateGameData: (appId: number) => void;
  onUpdateAllGameData: () => void;
  onTermStartSet: (value: number) => void;
  onTermEndSet: (value: number) => void;
}

export const createGameListContainer = (
  columnOptions: TableOptions<GameFlat>['columns'],
  Component: (props: ComponentProps) => React.ReactElement,
) => {
  const columnIndexes = {} as Record<'up' | 'down' | 'comp', number>;
  const columns: typeof columnOptions = columnOptions.map((column, i) => {
    switch (column.accessor) {
      case 'tags':
        return { ...column, filter: 'includesAll' };
      case 'up':
      case 'down':
      case 'comp':
        columnIndexes[column.accessor] = i;
        return { ...column, filter: 'between' };
      default:
        return column;
    }
  });

  return function GameListContainer() {
    const [entities, entityAction] = useGameEntities(() => table.rows.map(({ original: { appId } }) => appId));
    const { term, setTermStart: onTermStartSet, setTermEnd: onTermEndSet } = useTerm();
    const { games: data, minmax } = useGameFlatList(entities, term);

    const table = useTable({ data, columns }, useFilters, useSortBy);

    useEffect(() => {
      entityAction.refreshItems();
    }, []);

    return (
      <Component
        table={table}
        term={term}
        onUpdateAllGameData={entityAction.onUpdateAllGameData}
        onUpdateGameData={entityAction.onUpdateGameData}
        onTermStartSet={onTermStartSet}
        onTermEndSet={onTermEndSet}
        indexes={columnIndexes}
        minmax={minmax}
      />
    );
  };
};
