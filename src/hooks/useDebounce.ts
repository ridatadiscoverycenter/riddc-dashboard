'use client';

import React from 'react';

const DEFAULT_DEBOUNCE_INTERVAL_MS = 250;

export function useDebounce<T, U extends unknown[]>(
  callback: (...args: U) => T,
  intervalMs: number = DEFAULT_DEBOUNCE_INTERVAL_MS
) {
  const [timeoutId, setTimeoutId] = React.useState<number | undefined>(undefined);

  const callCallbackOnTimer = React.useCallback(
    (...args: U) => {
      clearTimeout(timeoutId);
      const newTimeoutId = setTimeout(() => {
        setTimeoutId(undefined);
        callback(...args);
      }, intervalMs);
      // Note(AM): TS things that setTimeout is returning NodeJS.Timeout
      // when it's actually returning a number because this is always
      // running in the client (see "use client" at the top of the file).
      setTimeoutId(newTimeoutId as unknown as number);
    },
    [timeoutId, setTimeoutId, callback, intervalMs]
  );

  const invoke = React.useCallback(
    (...args: U) => {
      callCallbackOnTimer(...args);
    },
    [callCallbackOnTimer, callback, intervalMs]
  );

  return invoke;
}
