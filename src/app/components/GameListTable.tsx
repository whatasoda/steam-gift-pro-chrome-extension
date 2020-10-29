import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { Button, Card } from '@blueprintjs/core';
import styled, { css } from 'styled-components';
import { CellProps, TableOptions, useFilters, useSortBy, useTable } from 'react-table';
import type { Entity } from '@whatasoda/browser-extension-toolkit/data-storage';
import { ScrollableTable } from '../../fragments/ScrollableTable';
import { createSimpleFilter } from '../../utils/table/filter';
import { renderSortHeader } from '../../utils/table/sort';

export interface GameFlat extends Omit<Entity<any>, 'data'>, Game {}

interface GameListTableProps {
  games: GameFlat[];
  onUpdateGameData: (appId: number) => void;
  onUpdateAllGameData: () => void;
  onVisibleItemChange?: (games: GameFlat[]) => void;
}

const tagsContext = createContext<string[]>([]);
const tagsFilter = createSimpleFilter<GameFlat, 'tags'>(true, tagsContext, (key) => key);

const callbackContext = createContext<Pick<GameListTableProps, 'onUpdateGameData' | 'onUpdateAllGameData'>>(
  {
    onUpdateGameData: () => {},
    onUpdateAllGameData: () => {},
  },
  () => 0,
);

const GetExtraData = ({ game }: { game: GameFlat }) => {
  const { onUpdateGameData } = useContext(callbackContext);
  return <Button onClick={() => onUpdateGameData(game.appId)}>情報更新</Button>;
};

const columns: TableOptions<GameFlat>['columns'] = [
  {
    disableSortBy: true,
    accessor: 'logo',
    Cell: ({ cell, row }) => {
      return cell.value ? (
        <a target="_blank" href={`https://store.steampowered.com/app/${row.original.appId}`}>
          <img src={cell.value} />
        </a>
      ) : (
        <span>No Image</span>
      );
    },
  },
  {
    accessor: 'name',
    Header: 'タイトル',
    Cell: ({ cell }) => cell.value || '[データを更新してください]',
  },
  {
    accessor: 'releaseDate',
    Header: 'リリース日',
    Cell: ({ cell }) => {
      return cell.value ? new Date(cell.value).toLocaleString() : '[データを更新してください]';
    },
  },
  {
    ...tagsFilter,
    accessor: 'tags',
    Header: 'ユーザータグ',
    Cell: ({ cell }) => {
      return (
        <>
          {cell.value ? cell.value.map((tag, idx) => <Tag key={idx} children={tag} />) : '[データを更新してください]'}
        </>
      );
    },
  },
  {
    disableSortBy: true,
    accessor: 'review',
    Header: 'レビュー',
    Cell: ({ cell }) => {
      const data = useMemo(() => {
        if (!cell.value) return null;
        const { rollups, start_date, end_date } = cell.value;
        const acc = { up: 0, down: 0 };
        rollups.forEach(([, up, down]) => {
          acc.up += up;
          acc.down += down;
        });
        return { start_date, end_date, ...acc };
      }, [cell.value]);

      if (!data) return '[データを更新してください]';

      return (
        <>
          <p>
            期間:
            <br />
            <span>{new Date(data.start_date * 1000).toLocaleString()}</span>
            <br />-
            <br />
            <span>{new Date(data.end_date * 1000).toLocaleString()}</span>
          </p>
          <p>高評価：{data.up}</p>
          <p>低評価：{data.down}</p>
        </>
      );
    },
  },
  {
    accessor: 'updatedAt',
    Header: '最終情報更新日',
    Cell: ({ cell, row }) => {
      return cell.value ? new Date(cell.value).toLocaleString() : <GetExtraData game={row.original} />;
    },
  },
  {
    disableSortBy: true,
    id: 'update-button',
    Cell: ({ row }: CellProps<GameFlat>) => <GetExtraData game={row.original} />,
  },
];

export const GameListTable = ({
  games,
  onVisibleItemChange,
  onUpdateAllGameData,
  onUpdateGameData,
}: GameListTableProps) => {
  const tagsAcc = useMemo(() => new Set<string>(), []);
  const allTags = useMemo(() => {
    games.forEach(({ tags }) => {
      tags?.forEach((tag) => {
        tagsAcc.add(tag);
      });
    });
    return [...tagsAcc];
  }, [games]);

  const { headers, getTableProps, getTableBodyProps, prepareRow, rows } = useTable(
    { data: games, columns },
    useFilters,
    useSortBy,
  );

  useEffect(() => {
    onVisibleItemChange?.(rows.map(({ original }) => original));
  }, [rows]);

  const headerContents = headers.map((column) => {
    const { disableSortBy, Filter, getHeaderProps, render } = column;
    const header = disableSortBy ? render(Filter ? 'Filter' : 'Header') : renderSortHeader(column);
    return <th {...getHeaderProps()}>{header}</th>;
  });

  const bodyContents = rows.map((row) => {
    prepareRow(row);
    return (
      <tr {...row.getRowProps()}>
        {row.cells.map((cell) => (
          <td {...cell.getCellProps()} children={cell.render('Cell')} />
        ))}
      </tr>
    );
  });

  return (
    <div>
      <Button onClick={onUpdateAllGameData}>全データ更新</Button>
      <callbackContext.Provider value={{ onUpdateAllGameData, onUpdateGameData }}>
        <tagsContext.Provider value={allTags}>
          <Card elevation={2} className="bp3-dark">
            <ScrollableTable
              customCSS={tableCustomCSS}
              tableProps={getTableProps({ className: 'bp3-dark' })}
              wrapperProps={{ style: { height: '80vh' }, className: 'bp3-dark' }}
            >
              <thead>
                <tr>{headerContents}</tr>
              </thead>
              <tbody {...getTableBodyProps()}>{bodyContents}</tbody>
            </ScrollableTable>
          </Card>
        </tagsContext.Provider>
      </callbackContext.Provider>
    </div>
  );
};

const tableCustomCSS = css`
  th:nth-child(1) {
    width: 190px;
  }
  th:nth-child(2) {
    width: 200px;
  }
  th:nth-child(3) {
    width: 170px;
  }
  th:nth-child(4) {
    /* width: 400px; */
  }
  th:nth-child(5) {
    width: 350px;
  }
  th:nth-child(6) {
    width: 170px;
  }
  th:nth-child(7) {
    width: 100px;
  }
`;

const Tag = styled.span`
  display: inline-block;
  color: #8cd5ff;
  background-color: #3c6686;
  border-radius: 4px;
  padding: 2px 4px;
  margin: 2px;
`;
