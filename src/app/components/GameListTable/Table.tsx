import React from 'react';
import { Cell } from 'react-table';
import { Button, Checkbox } from '@blueprintjs/core';
import { ScrollableTable } from '../../../fragments/ScrollableTable';
import { renderSortHeader } from '../../../utils/table/sort';
import type { ComponentProps, GameFlat } from './container';
import type { ControllerRefs } from './Layout';
import { tableCustomCSS } from './columns';

interface TableProps extends Pick<ComponentProps, 'table' | 'entityActions'> {
  controllerRefs: ControllerRefs;
}

export const Table = (props: TableProps) => {
  const { table } = props;
  const { headers, getTableProps, getTableBodyProps, prepareRow, rows } = table;

  const headerContents = headers.map((column) => {
    const { disableSortBy, getHeaderProps, render } = column;
    const header = disableSortBy ? render('Header') : renderSortHeader(column);
    return <th {...getHeaderProps()} children={header} />;
  });

  const bodyContents = rows.map((row) => {
    prepareRow(row);
    return (
      <tr {...row.getRowProps()}>
        {row.cells.map((cell) => (
          <td {...cell.getCellProps()} children={renderCell(cell, props)} />
        ))}
      </tr>
    );
  });

  return (
    <ScrollableTable
      customCSS={tableCustomCSS}
      tableProps={getTableProps({ className: 'bp3-dark' })}
      wrapperProps={{ style: { height: 'calc(90vh - 230px)' }, className: 'bp3-dark' }}
    >
      <thead>
        <tr>{headerContents}</tr>
      </thead>
      <tbody {...getTableBodyProps()}>{bodyContents}</tbody>
    </ScrollableTable>
  );
};

const renderCell = (cell: Cell<GameFlat>, { entityActions, controllerRefs }: TableProps) => {
  const { appId } = cell.row.original;
  switch (cell.column.id) {
    case 'checkbox': {
      if (!controllerRefs.gameListEditor) return <Checkbox disabled />;
      const { draft, selectedGames, addGames, removeGames } = controllerRefs.gameListEditor.current;
      return (
        <Checkbox
          disabled={!draft}
          checked={draft ? selectedGames.has(appId) : false}
          onClick={(event) => (event.currentTarget.checked ? addGames(appId) : removeGames(appId))}
        />
      );
    }
    case 'update-button': {
      const { onUpdateGameData } = entityActions;
      return <Button text="情報更新" onClick={() => onUpdateGameData(appId)} />;
    }
    default:
      return cell.render('Cell');
  }
};
