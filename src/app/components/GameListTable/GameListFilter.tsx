import React, { memo, useMemo } from 'react';
import styled from 'styled-components';
import { Button, Menu, Popover, TagInput } from '@blueprintjs/core';
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

  const { menuItemsIncludes, menuItemsExcludes, labels } = useMemo(() => {
    const menuItemsIncludes: JSX.Element[] = [];
    const menuItemsExcludes: JSX.Element[] = [];
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
        menuItemsIncludes.push(<Menu.Item key={index} text={label} onClick={() => addFilter('includes', index)} />);
        menuItemsExcludes.push(<Menu.Item key={index} text={label} onClick={() => addFilter('excludes', index)} />);
      }
    });

    return { menuItemsIncludes, menuItemsExcludes, labels };
  }, [includes, excludes, users, gameLists]);

  return (
    <Popover
      position="right"
      content={
        <Wrapper>
          <StyledTagInput
            values={labels.includes}
            inputProps={{ style: { cursor: 'default' }, onFocus: (event) => event.currentTarget.blur() }}
            onRemove={(item) => {
              const { key } = item as JSX.Element;
              if (typeof key === 'string') removeFilter('includes', key);
            }}
            rightElement={
              <Popover
                captureDismiss
                content={<Menu children={menuItemsIncludes} />}
                children={<Button icon="add" minimal />}
              />
            }
          />
          <Text>に含まれ、かつ</Text>
          <StyledTagInput
            values={labels.excludes}
            inputProps={{ style: { cursor: 'default' }, onFocus: (event) => event.currentTarget.blur() }}
            onRemove={(item) => {
              const { key } = item as JSX.Element;
              if (typeof key === 'string') removeFilter('excludes', key);
            }}
            rightElement={
              <Popover
                captureDismiss
                content={<Menu children={menuItemsExcludes} />}
                children={<Button icon="add" minimal />}
              />
            }
          />
          <Text>に含まれないゲームを表示</Text>
        </Wrapper>
      }
      children={
        <Button icon={includes.length || excludes.length ? 'filter-keep' : 'filter'} text="ゲームリストで絞り込み" />
      }
    />
  );
});

const Wrapper = styled.div`
  padding: 6px;
`;
const StyledTagInput = styled(TagInput)`
  flex: 0 0 auto;
  width: 320px;
`;
const Text = styled.div`
  flex: 0 0 auto;
  margin: 6px;
  text-align: right;
`;
