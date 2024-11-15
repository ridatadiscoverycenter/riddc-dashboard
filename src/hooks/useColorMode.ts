'use client';
import React from 'react';
import { useWindow } from './useWindow';

function matchesToColorMode(mediaQueryList: { matches: boolean }) {
  return mediaQueryList.matches ? 'dark' : 'light';
}

export function useColorMode() {
  const w = useWindow();
  const [colorMode, setColorMode] = React.useState<'light' | 'dark'>(
    w  === undefined ? "light" : matchesToColorMode(w.matchMedia('(prefers-color-scheme: dark)'))
  );
  React.useEffect(() => {
    function onMediaChange(event: MediaQueryListEvent) {
      setColorMode(matchesToColorMode(event));
    }
    if (w !== undefined) {
      const colorSchemeListener = w.matchMedia('(prefers-color-scheme: dark)');
      colorSchemeListener.addEventListener('change', onMediaChange);
      return () => colorSchemeListener.removeEventListener('change', onMediaChange);
    }
  }, [w, setColorMode]);
  return colorMode;
}
