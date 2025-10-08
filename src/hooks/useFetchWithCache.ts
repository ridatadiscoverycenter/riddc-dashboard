import React from 'react';
import { useLocalStorageState, type UseLocalStorageParams } from './useLocalStorage';

export function useFetchWithCache<T>(
  defaultValue: T,
  key: string,
  fetch: () => Promise<T>,
  useLocalStorageParams: UseLocalStorageParams<T> = {}
) {
  const [hasFetched, setHasFetched] = React.useState(false);
  const [data, setData] = useLocalStorageState<T>(defaultValue, key, useLocalStorageParams);

  React.useEffect(() => {
    if (!hasFetched) {
      setHasFetched(!hasFetched);
      fetch()
        .then((fetchedData) => {
          console.log({ fetchedData });
          setData(fetchedData);
        })
        .catch(() => console.error);
    }
  }, [fetch, hasFetched, setData]);

  const refetch = React.useCallback(() => setHasFetched(false), [setHasFetched]);

  return [data, setData, { refetch }] as const;
}
