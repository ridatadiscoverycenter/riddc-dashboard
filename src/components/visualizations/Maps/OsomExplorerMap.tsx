'use client';

import React from 'react';
import { useMap } from './useMap';
import { Header } from '@/components';

type OsomExplorerMapProps = {
  rasterUrl: string;
};

//const HALINE_GRADIENT = 'linear-gradient(0.25turn, #2a186e, #125e8e, #3c9486, #80cd64, #fbee97)';
const THERMAL_GRADIENT = 'linear-gradient(0.25turn, #032333, #634197, #b5607f, #fa973f, #e7fa5a)';

export function OsomExporerMap({ rasterUrl }: OsomExplorerMapProps) {
  const { map, loaded, containerRef } = useMap();

  React.useEffect(() => {
    if (loaded) {
      map.current.addSource('osom-data', {
        type: 'raster',
        tiles: [rasterUrl],
        attribution: 'Ocean State Ocean Model',
      });

      map.current.addLayer({
        id: 'osom-raster',
        type: 'raster',
        source: 'osom-data',
      });

      return () => {
        map.current.removeLayer('osom-raster');
        map.current.removeSource('osom-data');
      };
    }
  }, [loaded, rasterUrl]);

  return (
    <section className="full-bleed w-full min-h-[80vh] relative p-0 my-0">
      <div ref={containerRef} className="absolute w-full h-full" />
      <div className="flex flex-col absolute top-[3%] left-3 md:top-[8%] md:left-8 bg-white/90 dark:bg-slate-800/90 p-4 rounded-md w-72 overflow-auto">
        <Header size="sm">Surface Temperature</Header>
        <div className="flex flex-row gap-2 items-center">
          <span>0 ºC</span>
          <div className="flex-1 h-4" style={{ backgroundImage: THERMAL_GRADIENT }}></div>
          <span>30 ºC</span>
        </div>
      </div>
    </section>
  );
}
