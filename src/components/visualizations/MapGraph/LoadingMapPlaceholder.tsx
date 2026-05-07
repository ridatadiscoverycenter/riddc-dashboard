'use client';

import React from 'react';

import { MapGraphMenu } from './MapGraphMenu';
import { Loading, MapGraph } from '@/components';

export function LoadingMapPlaceholder({ title }: { title: string }) {
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
      <MapGraphMenu header={title} opened={opened} />
      <div className="absolute top-[50%] left-[50%]">
        <Loading />
      </div>
    </MapGraph>
  );
}
