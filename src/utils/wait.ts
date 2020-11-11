export const waitFor = async <T extends any>(maxRetryCount: number, timeout: number, query: () => T | null) => {
  for (let i = 0; i < maxRetryCount; i++) {
    const value = query();
    if (value) return value;
    await new Promise((resolve) => setTimeout(resolve, timeout));
  }
  return null;
};
