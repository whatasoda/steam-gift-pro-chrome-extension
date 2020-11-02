import React from 'react';
import { Button, Card } from '@blueprintjs/core';
import { ScrollableTable } from '../../../fragments/ScrollableTable';
import { renderSortHeader } from '../../../utils/table/sort';
import type { ComponentProps } from './container';
import { ControlSection } from './ControlSection';
import { tableCustomCSS } from './columns';

export const GameListTable = ({
  table,
  term,
  tags,
  minmax,
  indexes,
  onUpdateAllGameData,
  onUpdateGameData,
  onTermStartSet,
  onTermEndSet,
}: ComponentProps) => {
  const { headers, getTableProps, getTableBodyProps, prepareRow, rows, columns } = table;

  const headerContents = headers.map((column) => {
    const { disableSortBy, getHeaderProps, render } = column;
    const header = disableSortBy ? render('Header') : renderSortHeader(column);
    return <th {...getHeaderProps()} children={header} />;
  });

  const bodyContents = rows.map((row) => {
    prepareRow(row);
    return (
      <tr {...row.getRowProps()}>
        {row.cells.map((cell) => {
          switch (cell.column.id) {
            case 'update-button':
              return (
                <td
                  {...cell.getCellProps()}
                  children={<Button onClick={() => onUpdateGameData(cell.row.original.appId)}>情報更新</Button>}
                />
              );
            default:
              return <td {...cell.getCellProps()} children={cell.render('Cell')} />;
          }
        })}
      </tr>
    );
  });

  return (
    <div>
      <Card elevation={2} className="bp3-dark">
        <ControlSection
          term={term}
          onTermStartSet={onTermStartSet}
          onTermEndSet={onTermEndSet}
          onUpdateAllGameData={onUpdateAllGameData}
          columns={columns}
          indexes={indexes}
          minmax={minmax}
          tags={tags}
        />
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
      </Card>
    </div>
  );
};
