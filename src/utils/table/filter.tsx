import React, { useContext, useMemo } from 'react';
import { FilterProps, Column } from 'react-table';
import { Button, Card, Checkbox, Popover } from '@blueprintjs/core';

type CollectValidTargets<T extends object> = {
  [K in keyof T]: NonNullable<T[K]> extends string | string[] ? K : never;
}[keyof T];
type SelectionType<T extends string | string[]> = T extends string[] ? T[number] : T;
type Selections<T extends string | string[]> = SelectionType<T>[] | React.Context<SelectionType<T>[]>;

export const createSimpleFilter = <T extends object, U extends CollectValidTargets<T>>(
  isArray: Extract<T[U], string | string[]> extends string[] ? true : false,
  selections: Selections<Extract<T[U], string | string[]>>,
  renderLabel: (key: SelectionType<Extract<T[U], string | string[]>>) => React.ReactNode,
): Partial<Column<T>> => {
  const useSelections = Array.isArray(selections) ? () => selections : () => useContext(selections);
  return {
    filter: isArray ? 'includesAll' : 'includesValue',
    Filter: (props: FilterProps<T>) => {
      const helper = useFilterHelper(props);
      const selectionList = useSelections();
      return renderFilterHeader(selectionList, helper, renderLabel);
    },
    disableSortBy: true,
  };
};

interface FilterHelper {
  filter: Set<string>;
  hasNoFilter: boolean;
  clearFilter: () => void;
  switchSelection: (key: string, checked: boolean) => void;
  render: (type: string, props?: object | undefined) => React.ReactNode;
}
export const useFilterHelper = <T extends object = {}>({ column, state }: FilterProps<T>): FilterHelper => {
  const setFilter = column.setFilter as (value: string[]) => void;

  // immutable values
  const [internalFilterSet, clearFilter, switchSelection] = useMemo(() => {
    const internalFilterSet = new Set<string>();
    const clearFilter = () => setFilter([]);
    const switchSelection = (key: string, checked: boolean) => {
      if (checked) {
        if (internalFilterSet.has(key)) return;
        internalFilterSet.add(key);
      } else {
        if (!internalFilterSet.has(key)) return;
        internalFilterSet.delete(key);
      }
      setFilter([...internalFilterSet]);
    };
    return [internalFilterSet, clearFilter, switchSelection] as const;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hasNoFilter = useMemo(() => {
    const filter = state.filters.find(({ id }) => id === column.id);
    internalFilterSet.clear();
    if (filter) {
      (filter.value as string[]).forEach((value) => {
        internalFilterSet.add(value);
      });
    }
    return !internalFilterSet.size;
  }, [state.filters, column.id, internalFilterSet]);

  return {
    filter: internalFilterSet,
    hasNoFilter,
    clearFilter,
    switchSelection,
    render: column.render,
  };
};

const renderFilterHeader = <T extends string | string[]>(
  selectionList: SelectionType<T>[],
  { filter, hasNoFilter, clearFilter, switchSelection, render }: FilterHelper,
  renderLabel: (key: SelectionType<T>) => React.ReactNode,
) => {
  const menu = (
    <Card>
      <Button
        className="bp3-fill bp3-minimal"
        rightIcon="filter-remove"
        text="Clear Filter"
        disabled={hasNoFilter}
        onClick={clearFilter}
      />
      <hr />
      {selectionList.map((key) => (
        <Checkbox
          key={key}
          labelElement={renderLabel(key)}
          checked={filter.has(key)}
          onChange={(event) => switchSelection(key, event.currentTarget.checked)}
        />
      ))}
    </Card>
  );
  return (
    <Popover content={menu} fill position="right">
      <Button
        className="bp3-minimal bp3-fill"
        text={render('Header')}
        rightIcon={hasNoFilter ? 'filter-list' : 'filter-keep'}
      />
    </Popover>
  );
};
