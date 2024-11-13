'use client';
import React from 'react';

const SIZES = {
  xs: 400,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
/*
const SIZES = [
  {
    size: "2xl",
    breakpoint: 1536,
  },
  {
    size: "xl",
    breakpoint: 1280,
  },
  {
    size: "lg",
    breakpoint: 1024,
  },
  {
    size: "md",
    breakpoint: 768,
  },
  {
    size: "sm",
    breakpoint: 640,
  },
] as const;
 */

export type Size = keyof typeof SIZES;

/*
function checkSize() {
  const sizes = SIZES.map(({ size, breakpoint }) => window.matchMedia(`(min-width: ${breakpoint}px)`).matches ? size : undefined)//.filter((size) => size !== undefined);
  console.log({ sizes });
  return sizes[0];
}*/
/*
function listenToResize(callback: (event: unknown) => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}*/

function getScreenSize() {
  const { innerWidth } = window;
  if (innerWidth < SIZES.xs) return 'xs';
  if (innerWidth < SIZES.sm) return 'sm';
  if (innerWidth < SIZES.md) return 'md';
  if (innerWidth < SIZES.lg) return 'lg';
  if (innerWidth < SIZES.xl) return 'xl';
  return '2xl';
}

export function useScreenSize() {
  const [size, setSize] = React.useState<Size>(getScreenSize());

  const handleResizeEvent = React.useCallback(() => {
    const newSize = getScreenSize();
    if (size !== newSize) setSize(newSize);
  }, [size, setSize]);

  React.useEffect(() => {
    window.addEventListener('resize', handleResizeEvent);
    return () => window.removeEventListener('resize', handleResizeEvent);
  }, [handleResizeEvent]);

  React.useEffect(() => {
    console.log({ size });
  }, [size]);
  return size;
}
