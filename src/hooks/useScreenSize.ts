'use client';
import React from 'react';
import { useWindow } from './useWindow';

const SIZES = {
  xs: 400,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Size = keyof typeof SIZES;

function getScreenSize(w: ReturnType<typeof useWindow>) {
  if (w === undefined) return undefined;
  const { innerWidth } = w;
  if (innerWidth < SIZES.xs) return 'xs';
  if (innerWidth < SIZES.sm) return 'sm';
  if (innerWidth < SIZES.md) return 'md';
  if (innerWidth < SIZES.lg) return 'lg';
  if (innerWidth < SIZES.xl) return 'xl';
  return '2xl';
}

export function useScreenSize() {
  const w = useWindow();
  const [size, setSize] = React.useState<Size | undefined>(getScreenSize(w));

  const handleResizeEvent = React.useCallback(() => {
    const newSize = getScreenSize(w);
    if (size !== newSize) setSize(newSize);
  }, [w, size, setSize]);

  React.useEffect(() => {
    if (w !== undefined) {
      setSize(getScreenSize(w));
      w.addEventListener('resize', handleResizeEvent);
      return () => window.removeEventListener('resize', handleResizeEvent);
    }
  }, [handleResizeEvent, w]);
  return size;
}
