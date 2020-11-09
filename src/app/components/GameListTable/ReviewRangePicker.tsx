import { Button, Popover } from '@blueprintjs/core';
import React from 'react';
import { BetweenFilterPicker } from '../../../fragments/BetweenFilterPicker';
import type { ComponentProps } from './container';

interface ReviewRangePickerProps extends Pick<ComponentProps, 'table' | 'indexes' | 'gameListInfo'> {}

export const ReviewRangePicker = ({
  table: { columns },
  indexes,
  gameListInfo: { minmax },
}: ReviewRangePickerProps) => {
  const popover = (
    <>
      <BetweenFilterPicker icon="thumbs-up" column={columns[indexes.up]} minmax={minmax.up} />
      <BetweenFilterPicker icon="flow-review" column={columns[indexes.comp]} minmax={minmax.comp} />
      <BetweenFilterPicker icon="thumbs-down" column={columns[indexes.down]} minmax={minmax.down} />
    </>
  );

  return <Popover content={popover} children={<Button text="レビューの範囲を指定" />} />;
};
