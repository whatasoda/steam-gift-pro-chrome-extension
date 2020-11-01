import { useMemo } from 'react';
import { FilterProps } from 'react-table';

interface FilterHelper {
  filter: Set<string>;
  hasNoFilter: boolean;
  clearFilter: () => void;
  switchSelection: (key: string, checked: boolean) => void;
}
export const useFilterHelper = <T extends object = {}>({ column, state }: FilterProps<T>): FilterHelper => {
  const setFilter = column.setFilter as (value: string[]) => void;

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
  };
};
