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
    const options: IOptionProps[] = [{ value: '', label: '選択してください', disabled: true }];
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
      <SectionWrapper>
        <StyledSelect
          value=""
          options={options}
          onChange={(event) => addFilter('includes', event.currentTarget.value)}
        />
        <StyledTagInput
          values={labels.includes}
          inputProps={{ style: { cursor: 'default' }, onFocus: (event) => event.currentTarget.blur() }}
          onRemove={(item) => {
            const { key } = item as JSX.Element;
            if (typeof key === 'string') removeFilter('includes', key);
          }}
        />
        <Suffix>に含まれるアイテムを表示中</Suffix>
      </SectionWrapper>
      <SectionWrapper>
        <StyledSelect
          value=""
          options={options}
          onChange={(event) => addFilter('excludes', event.currentTarget.value)}
        />
        <StyledTagInput
          values={labels.excludes}
          inputProps={{ style: { cursor: 'default' }, onFocus: (event) => event.currentTarget.blur() }}
          onRemove={(item) => {
            const { key } = item as JSX.Element;
            if (typeof key === 'string') removeFilter('excludes', key);
          }}
        />
        <Suffix>に含まれないアイテムを表示中</Suffix>
      </SectionWrapper>
    </div>
  );
});

const SectionWrapper = styled.div`
  display: flex;
  flex-wrap: none;
  margin-bottom: 6px;
  align-items: center;
`;
const StyledSelect = styled(HTMLSelect)`
  width: 150px;
`;
const StyledTagInput = styled(TagInput)`
  margin: 0 6px;
  width: 300px;
`;
const Suffix = styled.div`
  vertical-align: middle;
`;
