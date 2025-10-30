'use client';

import React from 'react';
import { type LngLatBoundsLike } from 'maplibre-gl';
import { useMap } from '@/components';

export function MapGraph({
  onLoad,
  graph,
  children,
  syncOpenState,
  className = '',
  bounds = [
    [-71.5, 41.92],
    [-71.16, 41.32],
  ],
}: React.PropsWithChildren<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLoad: (map: React.MutableRefObject<any>, loaded: boolean) => (() => void) | void;
  graph: React.ReactNode;
  syncOpenState?: (open: boolean) => void;
  className?: string;
  bounds?: LngLatBoundsLike;
}>) {
  const [opened, setOpened] = React.useState(false);
  const { map, loaded, containerRef } = useMap(bounds);

  React.useEffect(() => {
    if (loaded) {
      const clearEffects = onLoad(map, loaded);
      if (clearEffects) {
        return clearEffects;
      }
    }
  }, [loaded, onLoad, map]);

  React.useEffect(() => {
    if (syncOpenState) {
      syncOpenState(opened);
    }
  }, [syncOpenState, opened]);

  return (
    <div className={`flex flex-row w-full text-base items-stretch ${className}`}>
      <div ref={containerRef} className={`relative md:w-[50%] w-[100%]`}>
        {children}
      </div>
      <div className={`bg-white dark:bg-black relative md:w-[50%] w-[100%]`}>{graph}</div>
    </div>
  );
}
