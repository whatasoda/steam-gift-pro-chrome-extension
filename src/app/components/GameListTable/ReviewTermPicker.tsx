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

  const content = (
    <>
      <MonthPickerWrapper>
        <span>レビュー集計開始月</span>
        <StyledMonthPicker defaultValue={start} onChange={(date) => setTermStart(date.getTime())} />
      </MonthPickerWrapper>
      <MonthPickerWrapper>
        <span>レビュー集計終了月</span>
        <StyledMonthPicker defaultValue={end} onChange={(date) => setTermEnd(date.getTime())} />
      </MonthPickerWrapper>
    </>
  );

  return <Popover content={content} children={<Button text="レビュー集計期間を指定" />} />;
};

const MonthPickerWrapper = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
  text-align: center;
`;

const StyledMonthPicker = styled(MonthPicker)`
  margin-top: 8px;
`;
