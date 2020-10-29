import React from 'react';
import { ColumnInstance } from 'react-table';
import { Button } from '@blueprintjs/core';

export const renderSortHeader = <T extends object = {}>({
  isSorted,
  isSortedDesc,
  getSortByToggleProps,
  render,
}: ColumnInstance<T>) => (
  <Button
    {...getSortByToggleProps()}
    className="bp3-minimal bp3-fill"
    text={render('Header')}
    rightIcon={isSorted ? (isSortedDesc ? 'caret-down' : 'caret-up') : 'double-caret-vertical'}
  />
);
