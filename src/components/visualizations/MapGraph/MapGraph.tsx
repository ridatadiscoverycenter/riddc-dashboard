'use client';

import React from 'react';
import { useMap } from '@/components';
import { ToggleMenuButton } from './ToggleMenuButton';

const COMPONENT_TRANSITION_STYLES = 'transition-[width] duration-500 ease-in-out';
const MAP_SIZE_STYLES = (opened: boolean) =>
  `${COMPONENT_TRANSITION_STYLES} ${opened ? 'md:w-[50%] w-0' : 'w-[100%]'}`;
const GRAPH_SIZE_STYLES = (opened: boolean) =>
  `${COMPONENT_TRANSITION_STYLES} ${opened ? 'md:w-[50%] w-[100%]' : 'w-0'}`;

export function MapGraph({
  onLoad,
  graph,
  children,
  syncOpenState,
  className = '',
}: React.PropsWithChildren<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLoad: (map: React.MutableRefObject<any>, loaded: boolean) => (() => void) | void;
  graph: React.ReactNode;
  syncOpenState?: (open: boolean) => void;
  className?: string;
}>) {
  const [opened, setOpened] = React.useState(false);
  const { map, loaded, containerRef } = useMap();

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
      <div ref={containerRef} className={`relative ${MAP_SIZE_STYLES(opened)}`}>
        <ToggleMenuButton opened={opened} setOpened={setOpened} position="right-2 top-2" />
        {children}
      </div>
      <div className={`bg-white dark:bg-black relative ${GRAPH_SIZE_STYLES(opened)}`}>
        <ToggleMenuButton opened={opened} setOpened={setOpened} position="md:hidden left-2 top-2" />
        {graph}
      </div>
    </div>
  );
}
