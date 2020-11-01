import React from 'react';
import styled from 'styled-components';
import { Card, H3 } from '@blueprintjs/core';
import type { ColumnInstance } from 'react-table';
import type { ComponentProps, GameFlat } from './container';
import { MonthPicker } from '../../../fragments/MonthPicker';
import { ReviewRangePicker } from './ReviewRangePicker';

interface ReviewTermPickerProps
  extends Pick<ComponentProps, 'term' | 'onTermStartSet' | 'onTermEndSet' | 'indexes' | 'minmax'> {
  columns: ColumnInstance<GameFlat>[];
}

export const FilterSection = ({
  term: [start, end],
  onTermStartSet,
  onTermEndSet,
  indexes,
  minmax,
  columns,
}: ReviewTermPickerProps) => (
  <Card className="bp3-dark">
    <div>
      <H3>レビュー集計範囲</H3>
      <MonthPickerWrapper>
        <span>FROM</span>
        <StyledMonthPicker defaultValue={start} onChange={(date) => onTermStartSet(date.getTime())} />
      </MonthPickerWrapper>
      <MonthPickerWrapper>
        <span>TO</span>
        <StyledMonthPicker defaultValue={end} onChange={(date) => onTermEndSet(date.getTime())} />
      </MonthPickerWrapper>
      <ReviewRangePicker icon="thumbs-up" column={columns[indexes.up]} minmax={minmax.up} />
      <ReviewRangePicker icon="flow-review" column={columns[indexes.comp]} minmax={minmax.comp} />
      <ReviewRangePicker icon="thumbs-down" column={columns[indexes.down]} minmax={minmax.down} />
    </div>
  </Card>
);

const StyledMonthPicker = styled(MonthPicker)`
  margin-top: 8px;
`;

const MonthPickerWrapper = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-right: 4px;
  text-align: center;
`;
