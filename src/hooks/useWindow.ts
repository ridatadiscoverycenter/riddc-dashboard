"use client";
import React from 'react';

/**
 * A Hook to allow Window to be safely accessed from client components.
 * @returns window
 */
export function useWindow() {
  const [windowValue, setWindow] = React.useState<typeof window | undefined>(undefined);
  React.useEffect(() => {
    setWindow(window);
  }, [setWindow]);
  return windowValue;
}