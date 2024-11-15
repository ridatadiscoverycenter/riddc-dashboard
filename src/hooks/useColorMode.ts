'use client';
import React from 'react';

function matchesToColorMode(mediaQueryList: { matches: boolean }) {
  return mediaQueryList.matches ? 'dark' : 'light';
}

export function useColorMode() {
  const [colorMode, setColorMode] = React.useState<'light' | 'dark'>(
    matchesToColorMode(window.matchMedia('(prefers-color-scheme: dark)'))
  );
  React.useEffect(() => {
    const colorSchemeListener = window.matchMedia('(prefers-color-scheme: dark)');
    function onMediaChange(event: MediaQueryListEvent) {
      setColorMode(matchesToColorMode(event));
    }
    colorSchemeListener.addEventListener('change', onMediaChange);
    return () => colorSchemeListener.removeEventListener('change', onMediaChange);
  }, [setColorMode]);
  return colorMode;
}
