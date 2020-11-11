import { Button, Popover } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { BetweenFilterPicker } from '../../../fragments/BetweenFilterPicker';
import type { ComponentProps } from './container';

interface ReviewRangePickerProps extends Pick<ComponentProps, 'table' | 'indexes' | 'info'> {}

export const ReviewRangePicker = ({ table: { columns }, indexes, info: { minmax } }: ReviewRangePickerProps) => {
  const up = columns[indexes.up];
  const comp = columns[indexes.comp];
  const down = columns[indexes.down];
  const hasFilter = Boolean(up.filterValue || comp.filterValue || down.filterValue);
  return (
    <Popover
      position="right"
      content={
        <Wrapper>
          <BetweenFilterPicker icon="thumbs-up" column={up} minmax={minmax.up} />
          <BetweenFilterPicker icon="flow-review" column={comp} minmax={minmax.comp} />
          <BetweenFilterPicker icon="thumbs-down" column={down} minmax={minmax.down} />
        </Wrapper>
      }
      children={<Button icon={hasFilter ? 'filter-keep' : 'filter'} text="レビューで絞り込み" />}
    />
  );
};

const Wrapper = styled.div`
  padding: 6px;
`;
