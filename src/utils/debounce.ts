export const debounce = <T extends any[]>(fn: (...args: T) => void, timeout: number) => {
  let id: ReturnType<typeof setTimeout> | null = null;
  return (...args: T) => {
    if (id) clearTimeout(id);
    id = setTimeout(() => {
      fn(...args);
      id = null;
    }, timeout);
  };
};
