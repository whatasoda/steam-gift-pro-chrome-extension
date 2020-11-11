import React from 'react';
import { css } from 'styled-components';
import { Button, Icon } from '@blueprintjs/core';
import type { TableOptions } from 'react-table';
import type { GameFlat } from './container';
import { Tag } from '../../../fragments/Tag';

export const columns: TableOptions<GameFlat>['columns'] = [
  {
    disableSortBy: true,
    id: 'checkbox',
  },
  {
    disableSortBy: true,
    accessor: 'appId',
    Cell: ({ cell: { value: appId }, row: { original } }) => (
      <a target="_blank" href={`https://store.steampowered.com/app/${appId}`}>
        {original.logo ? <img src={original.logo} /> : <span children="No Image" />}
      </a>
    ),
  },
  {
    accessor: 'name',
    Header: 'タイトル',
    Cell: ({ cell: { value } }) => value || '[ゲームリストを再取得してください]',
  },
  {
    accessor: 'releaseDate',
    Header: 'リリース日',
    Cell: ({ cell: { value } }) => {
      if (value) {
        const date = new Date(value);
        const yyyy = date.getFullYear();
        const mm = (date.getMonth() + 1).toString().padStart(2, '0');
        const dd = date.getDate().toString().padStart(2, '0');
        return `${yyyy}年${mm}月${dd}日`;
      } else {
        return '[データを更新してください]';
      }
    },
  },
  {
    accessor: 'up',
    Header: () => <Icon icon="thumbs-up" />,
    Cell: ({ cell: { value } }) => value.toLocaleString(),
    sortType: ({ original: { up: a } }, { original: { up: b } }) => a - b,
  },
  {
    accessor: 'comp',
    Header: () => <Icon icon="flow-review" />,
    Cell: ({ cell: { value } }) => value.toLocaleString(),
    sortType: ({ original: { comp: a } }, { original: { comp: b } }) => a - b,
  },
  {
    accessor: 'down',
    Header: () => <Icon icon="thumbs-down" />,
    Cell: ({ cell: { value } }) => (-value).toLocaleString(),
    sortType: ({ original: { down: a } }, { original: { down: b } }) => a - b,
  },
  {
    disableSortBy: true,
    accessor: 'tags',
    Header: () => <Button fill minimal text="ユーザータグ" />,
    Cell: ({ cell: { value: tags } }) => {
      if (tags) {
        return tags.map((tag, idx) => <Tag key={idx} children={tag} />);
      } else {
        return '[データを更新してください]';
      }
    },
  },
  {
    disableSortBy: true,
    id: 'update-button',
  },
];

const CSSIndexes = columns.reduce<Record<string, number>>((acc, { accessor, id }, idx) => {
  acc[typeof accessor === 'string' ? accessor : id || ''] = idx + 1;
  return acc;
}, {}) as Record<'appId' | 'name' | 'releaseDate' | 'up' | 'comp' | 'down' | 'tags' | 'update-button', number>;

export const tableCustomCSS = css`
  th {
    &:nth-child(${CSSIndexes.appId}) {
      width: 190px;
    }
    &:nth-child(${CSSIndexes.name}) {
      width: 200px;
    }
    &:nth-child(${CSSIndexes.releaseDate}) {
      width: 140px;
    }
    &:nth-child(${CSSIndexes.up}),
    &:nth-child(${CSSIndexes.comp}),
    &:nth-child(${CSSIndexes.down}) {
      width: 60px;
    }
    &:nth-child(${CSSIndexes.tags}) {
      /* width: 400px; */
    }
    &:nth-child(${CSSIndexes['update-button']}) {
      width: 30px;
    }
  }
  td {
    &:nth-child(${CSSIndexes.releaseDate}) {
      text-align: center;
    }
    &:nth-child(${CSSIndexes.up}),
    &:nth-child(${CSSIndexes.comp}),
    &:nth-child(${CSSIndexes.down}) {
      text-align: right;
    }
  }
`;
