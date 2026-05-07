'use client';

import React from 'react';

import { Loading, MapGraph } from '@/components';

export function LoadingMapPlaceholder() {
  const [opened, setOpen] = React.useState(false);
  return (
    <MapGraph
      className="absolute w-full h-full"
      onLoad={() => {}}
      graph={
        <div className="hidden sm:flex w-full h-full flex-col items-center justify-center">
          <Loading />
        </div>
      }
      syncOpenState={(isMapOpen) => setOpen(isMapOpen)}
      bounds={[
        [-72.25, 42.1],
        [-71.17, 41.1],
      ]}
    >
      <div className="absolute w-full h-full bg-slate-100/50" />
      <div
        className={`z-50 absolute top-6 left-2 bg-slate-100/90 dark:bg-slate-800/90 rounded-md font-light p-2 flex flex-col gap-4 max-w-28 md:max-w-56 ${opened ? 'translate-x-[-24rem] md:translate-x-0 transition-transform duration-500' : ''}`}
      >
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-lg md:text-xl leading-none md:leading-normal">Stream Gage Height</h1>
        </div>
      </div>
      <div className="absolute top-[50%] left-[50%]">
        <Loading />
      </div>
    </MapGraph>
  );
}
