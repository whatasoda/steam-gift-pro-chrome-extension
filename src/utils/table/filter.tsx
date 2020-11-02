import { useMemo } from 'react';
import { ColumnInstance } from 'react-table';

interface FilterHelper {
  filter: Set<string>;
  hasNoFilter: boolean;
  clearFilter: () => void;
  switchSelection: (key: string, checked: boolean) => void;
}
export const useFilterHelper = <T extends object = {}>(column: ColumnInstance<T>): FilterHelper => {
  const setFilter = column.setFilter as (value: string[]) => void;
  const filterValue = column.filterValue as string[] | undefined;

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
  }, []);

  const hasNoFilter = useMemo(() => {
    internalFilterSet.clear();
    if (filterValue) {
      filterValue.forEach((value) => {
        internalFilterSet.add(value);
      });
    }
    return !internalFilterSet.size;
  }, [filterValue, column.id, internalFilterSet]);

  return {
    filter: internalFilterSet,
    hasNoFilter,
    clearFilter,
    switchSelection,
  };
};
