import React, { useEffect, useMemo } from 'react';
import { ColumnInstance } from 'react-table';
import { useGameListFilter } from './utils';
import type { GameFlat } from './container';
import { HTMLSelect, IOptionProps, TagInput } from '@blueprintjs/core';
import styled from 'styled-components';

interface GameListFilterProps {
  className?: string;
  column: ColumnInstance<GameFlat>;
}

export const GameListFilter = ({ column }: GameListFilterProps) => {
  const { fetchGameList, users, gameLists, includes, excludes, addFilter, removeFilter } = useGameListFilter(column);
  useEffect(() => {
    fetchGameList();
  }, []);

  const { options, labels } = useMemo(() => {
    const options: IOptionProps[] = [{ value: '', label: '選択してください', disabled: true }];
    const userList = Object.values(users);
    const gameListList = Object.values(gameLists);

    const labels = { includes: [] as JSX.Element[], excludes: [] as JSX.Element[] };

    [...userList, ...gameListList].forEach((entity, idx) => {
      if (!entity) return;
      const isUser = idx < userList.length;
      const { index } = entity;
      const label = `${isUser ? 'USER' : 'LIST'}: ${users[index]!.data.name}`;
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
};

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
