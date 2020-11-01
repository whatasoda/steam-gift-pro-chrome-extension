import { Button, RangeSlider, IconName } from '@blueprintjs/core';
import React, { memo } from 'react';
import { ColumnInstance } from 'react-table';
import styled from 'styled-components';
import { useBetweenFilter } from './utils';

interface ReviewRangePickerProps {
  className?: string;
  icon: IconName;
  column: ColumnInstance<any>;
  minmax: MinMax;
}

const floatFormat = /(?<=\.\d{2})\d+$/;

export const ReviewRangePicker = memo(({ icon, column, minmax }: ReviewRangePickerProps) => {
  const { propotion, setRange, clearRange } = useBetweenFilter(column, minmax);

  return (
    <Wrapper>
      <Button icon={icon} fill onClick={clearRange} />
      <StyledRangeSlider
        value={propotion}
        onChange={setRange}
        min={0}
        max={1}
        vertical
        stepSize={0.005}
        labelStepSize={0.25}
        labelRenderer={(value) => `${(value * 100).toString().replace(floatFormat, '')}%`}
      />
    </Wrapper>
  );
});

const Wrapper = styled.div`
  vertical-align: middle;
  display: inline-block;
  padding: 0 20px 4px 10px;
  align-items: center;
`;

const StyledRangeSlider = styled(RangeSlider)`
  height: 150px;
  margin: 16px 0px 8px 24px;
`;
