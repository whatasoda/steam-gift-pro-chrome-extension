import React from 'react';
import styled, { css } from 'styled-components';
import type { TableOptions } from 'react-table';
import type { GameFlat } from './container';
import { Icon } from '@blueprintjs/core';

export const columns: TableOptions<GameFlat>['columns'] = [
  {
    disableSortBy: true,
    accessor: 'logo',
    Cell: ({ cell: { value }, row: { original } }) => (
      <a target="_blank" href={`https://store.steampowered.com/app/${original.appId}`}>
        {value ? <img src={value} /> : <span children="No Image" />}
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
        return new Date(value).toLocaleString();
      } else {
        return '[データを更新してください]';
      }
    },
  },
  {
    disableSortBy: true,
    accessor: 'tags',
    Header: 'ユーザータグ',
    Cell: ({ cell: { value } }) => {
      if (value) {
        return value.map((tag, idx) => <Tag key={idx} children={tag} />);
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
  // {
  //   accessor: 'updatedAt',
  //   Header: '情報更新',
  //   Cell: ({ cell: { value } }) => {
  //     if (value) {
  //       return new Date(value).toLocaleString();
  //     } else {
  //       return '-';
  //     }
  //   },
  // },
  {
    disableSortBy: true,
    id: 'update-button',
  },
];

export const tableCustomCSS = css`
  th {
    &:nth-child(1) {
      width: 190px;
    }
    &:nth-child(2) {
      width: 200px;
    }
    &:nth-child(3) {
      width: 170px;
    }
    &:nth-child(4) {
      /* width: 400px; */
    }
    &:nth-child(5),
    &:nth-child(6),
    &:nth-child(7) {
      width: 60px;
    }
    &:nth-child(8) {
      width: 100px;
    }
  }
  td {
    &:nth-child(5),
    &:nth-child(6),
    &:nth-child(7) {
      text-align: right;
    }
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
