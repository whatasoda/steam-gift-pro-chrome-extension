import React, { memo, useMemo } from 'react';
import styled from 'styled-components';
import { HTMLSelect, IOptionProps, TagInput } from '@blueprintjs/core';
import { useGameListFilter } from './utils';
import type { ComponentProps } from './container';

interface GameListFilterProps extends Pick<ComponentProps, 'table' | 'indexes' | 'gameLists' | 'users'> {
  className?: string;
}

export const GameListFilter = memo(({ table, indexes, gameLists, users }: GameListFilterProps) => {
  const { includes, excludes, addFilter, removeFilter } = useGameListFilter(table.columns[indexes.appId], {
    gameLists,
    users,
  });

  const { options, labels } = useMemo(() => {
    const options: IOptionProps[] = [{ value: '', label: '+', disabled: true }];
    const userList = Object.values(users);
    const gameListList = Object.values(gameLists);

    const labels = { includes: [] as JSX.Element[], excludes: [] as JSX.Element[] };

    [...userList, ...gameListList].forEach((entity, idx) => {
      if (!entity) return;
      const isUser = idx < userList.length;
      const { index } = entity;
      const label = `${isUser ? 'USER' : 'LIST'}: ${entity.data.name}`;
      if (includes.includes(index)) {
        labels.includes.push(<span key={index} children={label} />);
      } else if (excludes.includes(index)) {
        labels.excludes.push(<span key={index} children={label} />);
      } else {
        options.push({ value: index, label });
      }
    });

    return { options, labels };
  }, [includes, excludes, users, gameLists]);

  return (
    <div>
      <Wrapper>
        <StyledTagInput
          values={labels.includes}
          inputProps={{ style: { cursor: 'default' }, onFocus: (event) => event.currentTarget.blur() }}
          onRemove={(item) => {
            const { key } = item as JSX.Element;
            if (typeof key === 'string') removeFilter('includes', key);
          }}
        />
        <StyledSelect
          value=""
          options={options}
          onChange={(event) => addFilter('includes', event.currentTarget.value)}
        />
        <Suffix>に含まれ、かつ</Suffix>
        <StyledTagInput
          values={labels.excludes}
          inputProps={{ style: { cursor: 'default' }, onFocus: (event) => event.currentTarget.blur() }}
          onRemove={(item) => {
            const { key } = item as JSX.Element;
            if (typeof key === 'string') removeFilter('excludes', key);
          }}
        />
        <StyledSelect
          value=""
          options={options}
          onChange={(event) => addFilter('excludes', event.currentTarget.value)}
        />
        <Suffix>に含まれないアイテムを表示中</Suffix>
      </Wrapper>
    </div>
  );
});

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: 6px;
  margin-bottom: 6px;
  align-items: center;
  width: 300px;
`;
const StyledSelect = styled(HTMLSelect)`
  width: 50px;
`;
const StyledTagInput = styled(TagInput)`
  width: 250px;
`;
const Suffix = styled.div`
  text-align: right;
  margin: 6px 0;
  width: 100%;
`;
