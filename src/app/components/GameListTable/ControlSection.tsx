import React from 'react';
import styled from 'styled-components';
import type { ColumnInstance } from 'react-table';
import type { ComponentProps, GameFlat } from './container';
import { MonthPicker } from '../../../fragments/MonthPicker';
import { ReviewRangePicker } from './ReviewRangePicker';
import { TagPicker } from './TagPicker';
import { Button } from '@blueprintjs/core';
import { GameListFilter } from './GameListFilter';

type Base = Pick<
  ComponentProps,
  'onUpdateAllGameData' | 'term' | 'onTermStartSet' | 'onTermEndSet' | 'indexes' | 'minmax' | 'tags'
>;
interface ControlSectionProps extends Base {
  columns: ColumnInstance<GameFlat>[];
}

export const ControlSection = ({
  term: [start, end],
  onTermStartSet,
  onTermEndSet,
  onUpdateAllGameData,
  indexes,
  minmax,
  columns,
  tags,
}: ControlSectionProps) => (
  <Wrapper>
    <GameListFilter column={columns[indexes.appId]} />
    <ButtonWrapper>
      <Button onClick={onUpdateAllGameData} fill text="全データ更新" />
    </ButtonWrapper>
    <MonthPickerWrapper>
      <span>レビュー集計開始月</span>
      <StyledMonthPicker defaultValue={start} onChange={(date) => onTermStartSet(date.getTime())} />
    </MonthPickerWrapper>
    <MonthPickerWrapper>
      <span>レビュー集計終了月</span>
      <StyledMonthPicker defaultValue={end} onChange={(date) => onTermEndSet(date.getTime())} />
    </MonthPickerWrapper>
    <ReviewRangePicker icon="thumbs-up" column={columns[indexes.up]} minmax={minmax.up} />
    <ReviewRangePicker icon="flow-review" column={columns[indexes.comp]} minmax={minmax.comp} />
    <ReviewRangePicker icon="thumbs-down" column={columns[indexes.down]} minmax={minmax.down} />
    <StyledTagPicker tags={tags} column={columns[indexes.tags]} />
  </Wrapper>
);

const Wrapper = styled.div`
  height: 230px;
`;

const ButtonWrapper = styled.div`
  display: inline-block;
  vertical-align: middle;
  width: 150px;
  margin-right: 10px;
  height: 100%;
  padding-top: 44px;
  box-sizing: border-box;
`;

const StyledMonthPicker = styled(MonthPicker)`
  margin-top: 8px;
`;

const MonthPickerWrapper = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
  text-align: center;
`;

const StyledTagPicker = styled(TagPicker)`
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
  width: 500px;
  height: 226px;
`;
