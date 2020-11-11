import { Button, Popover } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { MonthPicker } from '../../../fragments/MonthPicker';
import type { useTerm } from './utils';

interface ReviewTermPickerProps {
  controller: ReturnType<typeof useTerm>;
}

export const ReviewTermPicker = ({ controller }: ReviewTermPickerProps) => {
  const {
    term: [start, end],
    setTermStart,
    setTermEnd,
  } = controller;

  return (
    <Popover
      position="right"
      content={
        <Wrapper>
          <MonthPickerWrapper>
            <span>レビュー集計開始月</span>
            <StyledMonthPicker defaultValue={start} onChange={(date) => setTermStart(date.getTime())} />
          </MonthPickerWrapper>
          <MonthPickerWrapper>
            <span>レビュー集計終了月</span>
            <StyledMonthPicker defaultValue={end} onChange={(date) => setTermEnd(date.getTime())} />
          </MonthPickerWrapper>
        </Wrapper>
      }
      children={<Button icon="calendar" text="レビュー集計期間を設定" />}
    />
  );
};

const Wrapper = styled.div`
  padding: 6px;
`;

const MonthPickerWrapper = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin: 0 4px;
  text-align: center;
`;

const StyledMonthPicker = styled(MonthPicker)`
  margin-top: 8px;
`;
