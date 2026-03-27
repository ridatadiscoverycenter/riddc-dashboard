import React from 'react';

export function useInterval(callback: () => void, interval: number | undefined) {
  React.useEffect(() => {
    // Don't schedule for undefined intervals.
    if (interval === undefined) return;
    const intervalId = setInterval(callback, interval);
    return () => clearInterval(intervalId);
  }, [callback, interval]);
}
