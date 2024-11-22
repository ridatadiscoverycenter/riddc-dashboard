'use client';
import React from 'react';
import { useWindow } from './useWindow';

function getColorMode(w: ReturnType<typeof useWindow>) {
  if (w === undefined) return undefined;
  return w.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useColorMode() {
  const w = useWindow();
  const [colorMode, setColorMode] = React.useState<'light' | 'dark' | undefined>(getColorMode(w));
  React.useEffect(() => {
    function onMediaChange() {
      setColorMode(getColorMode(w));
    }
    if (w !== undefined) {
      onMediaChange();
      const colorSchemeListener = w.matchMedia('(prefers-color-scheme: dark)');
      colorSchemeListener.addEventListener('change', onMediaChange);
      return () => colorSchemeListener.removeEventListener('change', onMediaChange);
    }
  }, [w, setColorMode, colorMode]);
  return colorMode;
}
