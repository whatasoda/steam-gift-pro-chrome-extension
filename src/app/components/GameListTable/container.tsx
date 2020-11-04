import React, { useEffect } from 'react';
import { TableInstance, TableOptions, useFilters, useSortBy, useTable } from 'react-table';
import type { Entity } from '@whatasoda/browser-extension-toolkit/data-storage';
import { gameListFilter, useGameEntities, useGameFlatList, useGameListEdit, useGameListFilter, useTerm } from './utils';

export interface GameFlat extends Omit<Entity<any>, 'data'>, Omit<Game, 'review'> {
  up: number;
  down: number;
  comp: number;
}

interface TableLayerPayload {
  getShownAppIds: () => number[];
  table: TableInstance<GameFlat>;
  termController: ReturnType<typeof useTerm>;
  gameListInfo: ReturnType<typeof useGameFlatList>;
  entityActions: ReturnType<typeof useGameEntities>[1];
}

export interface ComponentProps extends TableLayerPayload {
  indexes: Record<'up' | 'down' | 'comp' | 'tags' | 'appId', number>;
  gameListFilterController: ReturnType<typeof useGameListFilter>;
  gameListEditController: ReturnType<typeof useGameListEdit>;
}

export const createGameListContainer = (
  columnOptions: TableOptions<GameFlat>['columns'],
  Component: (props: ComponentProps) => React.ReactElement,
) => {
  const indexes = {} as ComponentProps['indexes'];
  const columns: typeof columnOptions = columnOptions.map((column, i) => {
    switch (column.accessor) {
      case 'appId':
        indexes[column.accessor] = i;
        return { ...column, filter: gameListFilter };
      case 'tags':
        indexes[column.accessor] = i;
        return { ...column, filter: 'includesAll' };
      case 'up':
      case 'down':
      case 'comp':
        indexes[column.accessor] = i;
        return { ...column, filter: 'between' };
      default:
        return column;
    }
  });

  const TableLayer = () => {
    const getShownAppIds = () => table.rows.map(({ original: { appId } }) => appId);
    const [entities, entityActions] = useGameEntities(getShownAppIds);
    const termController = useTerm();
    const gameListInfo = useGameFlatList(entities, termController.term);

    const { games: data } = gameListInfo;
    const table = useTable({ data, columns }, useFilters, useSortBy);
    useEffect(() => {
      entityActions.refreshItems();
    }, []);

    return (
      <FilterLayer
        table={table}
        getShownAppIds={getShownAppIds}
        gameListInfo={gameListInfo}
        termController={termController}
        entityActions={entityActions}
      />
    );
  };

  const FilterLayer = (props: TableLayerPayload) => {
    const { table, getShownAppIds } = props;
    const gameListFilterController = useGameListFilter(table.columns[indexes.appId]);
    const { fetchGameList, gameLists } = gameListFilterController;
    const gameListEditController = useGameListEdit(getShownAppIds, fetchGameList, gameLists);

    useEffect(() => {
      gameListFilterController.fetchGameList();
    }, []);

    return (
      <Component
        {...props}
        indexes={indexes}
        gameListFilterController={gameListFilterController}
        gameListEditController={gameListEditController}
      />
    );
  };

  return TableLayer;
};
