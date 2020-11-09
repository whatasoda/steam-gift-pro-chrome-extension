import React, { useState } from 'react';
import { Button, Checkbox, Popover, InputGroup, Callout } from '@blueprintjs/core';
import { Tag } from '../../../fragments/Tag';
import styled from 'styled-components';
import { useFilterHelper } from '../../../utils/table/filter';
import { ColumnInstance } from 'react-table';

interface TagPickerProps {
  className?: string;
  tags: string[];
  column: ColumnInstance<any>;
}

export const TagPicker = ({ className, tags, column }: TagPickerProps) => {
  const { switchSelection, filter } = useFilterHelper(column);
  const [searchText, setSearchText] = useState('');

  const popover = (
    <PopoverWrapepr>
      <InputGroup
        value={searchText}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchText(event.currentTarget.value)}
      />
      <ScrollContainer>
        {tags.reduce<JSX.Element[]>((acc, tag) => {
          if (searchText && !tag.includes(searchText)) return acc;
          const isChecked = filter.has(tag);
          const element = (
            <StyledCheckbox
              key={isChecked ? '-' + tag : tag} // this prefix avoids resetting scroll on check
              labelElement={tag}
              checked={filter.has(tag)}
              onChange={(event) => switchSelection(tag, event.currentTarget.checked)}
            />
          );
          isChecked ? acc.unshift(element) : acc.push(element);
          return acc;
        }, [])}
      </ScrollContainer>
    </PopoverWrapepr>
  );

  return (
    <StyledCallout className={className}>
      <Popover content={popover} onClosed={() => setSearchText('')}>
        <Button icon="filter" text="タグで絞り込み" />
      </Popover>
      <TagsWrapper>
        {[...filter].map((tag) => (
          <Tag key={tag} children={tag} />
        ))}
      </TagsWrapper>
    </StyledCallout>
  );
};

const PopoverWrapepr = styled.div`
  padding: 8px;
`;

const ScrollContainer = styled.div`
  overflow-y: scroll;
  padding: 2px;
  max-height: 35vh;
`;

const StyledCallout = styled(Callout)`
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 4px;
`;

const StyledCheckbox = styled(Checkbox)`
  margin-bottom: 0;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-left: 2px;
`;

const TagsWrapper = styled.div`
  margin-left: 8px;
  width: calc(100% - 150px);
`;
