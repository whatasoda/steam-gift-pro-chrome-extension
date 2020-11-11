import { Button, Popover } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { BetweenFilterPicker } from '../../../fragments/BetweenFilterPicker';
import type { ComponentProps } from './container';

interface ReviewRangePickerProps extends Pick<ComponentProps, 'table' | 'indexes' | 'info'> {}

export const ReviewRangePicker = ({ table: { columns }, indexes, info: { minmax } }: ReviewRangePickerProps) => {
  return (
    <Popover
      position="right"
      content={
        <Wrapper>
          <BetweenFilterPicker icon="thumbs-up" column={columns[indexes.up]} minmax={minmax.up} />
          <BetweenFilterPicker icon="flow-review" column={columns[indexes.comp]} minmax={minmax.comp} />
          <BetweenFilterPicker icon="thumbs-down" column={columns[indexes.down]} minmax={minmax.down} />
        </Wrapper>
      }
      children={<Button icon="filter" text="レビューで絞り込み" />}
    />
  );
};

const Wrapper = styled.div`
  padding: 6px;
`;
