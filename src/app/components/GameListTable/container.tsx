import React, { useEffect } from 'react';
import { TableInstance, TableOptions, useFilters, useSortBy, useTable } from 'react-table';
import type { Entity } from '@whatasoda/browser-extension-toolkit/data-storage';
import { gameListFilter, GameListRecord, useEntities, useGameFlatList, UserRecord, useTerm } from './utils';

export interface GameFlat extends Omit<Entity<any>, 'data'>, Omit<Game, 'review'> {
  up: number;
  down: number;
  comp: number;
}

export interface ComponentProps {
  getShownAppIds: () => number[];
  table: TableInstance<GameFlat>;
  indexes: Record<'up' | 'down' | 'comp' | 'tags' | 'appId', number>;
  gameLists: GameListRecord;
  users: UserRecord;
  termController: ReturnType<typeof useTerm>;
  gameListInfo: ReturnType<typeof useGameFlatList>;
  entityActions: ReturnType<typeof useEntities>[1];
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
    const [entities, entityActions] = useEntities(getShownAppIds);
    const termController = useTerm();
    const gameListInfo = useGameFlatList(entities.games, termController.term);

    const { games: data } = gameListInfo;
    const table = useTable({ data, columns }, useFilters, useSortBy);
    useEffect(() => {
      entityActions.fetchGames();
      entityActions.fetchGameLists();
      entityActions.fetchUsers();
    }, []);

    return (
      <Component
        table={table}
        indexes={indexes}
        gameLists={entities.gameLists}
        users={entities.users}
        getShownAppIds={getShownAppIds}
        gameListInfo={gameListInfo}
        termController={termController}
        entityActions={entityActions}
      />
    );
  };

  return TableLayer;
};
