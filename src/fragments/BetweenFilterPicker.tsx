import React, { memo, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Button, RangeSlider, IconName } from '@blueprintjs/core';
import type { ColumnInstance } from 'react-table';
import { debounce } from '../utils/debounce';

interface ReviewRangePickerProps {
  className?: string;
  icon: IconName;
  column: ColumnInstance<any>;
  minmax: MinMax;
}

const floatFormat = /(?<=\.\d{2})\d+$/;

export const useBetweenFilter = <T extends object = {}>(column: ColumnInstance<T>, minmax: MinMax) => {
  const [propotion, setPropotion] = useState<MinMax>([0.0, 1.0]);
  const [setFilter, setFilterRef] = useMemo(() => {
    const ref = { current: column.setFilter as (value: MinMax | null) => void };
    const func = debounce((value: MinMax | null) => ref.current(value), 200);
    return [func, ref] as const;
  }, []);
  setFilterRef.current = column.setFilter;

  useEffect(() => {
    setPropotion([0.0, 1.0]);
    setFilter(null);
  }, minmax);

  const setRange = (next: MinMax) => {
    setPropotion(next);
    const [min, max] = minmax;
    const range = max - min;
    setFilter([min + range * next[0], min + range * next[1]]);
  };

  const clearRange = () => {
    setPropotion([0, 1.0]);
    setFilter(null);
  };

  return { propotion, setRange, clearRange };
};

export const BetweenFilterPicker = memo(({ icon, column, minmax }: ReviewRangePickerProps) => {
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
  padding: 0 26px 4px 10px;
  align-items: center;
`;

const StyledRangeSlider = styled(RangeSlider)`
  height: 150px;
  margin: 16px 0px 8px 24px;
`;
