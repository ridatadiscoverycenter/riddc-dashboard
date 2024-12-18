'use client';
import React from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { RiBuoyCoordinate } from '@/utils/data/api/buoy';
import { useMap } from './useMap';

type RiBuoyLocationsProps = {
  locations: RiBuoyCoordinate[];
};

export function RiBuoyLocations({ locations }: RiBuoyLocationsProps) {
  const { map, loaded, containerRef } = useMap();
  React.useEffect(() => {
    if (loaded) {
      locations.forEach(({ stationName, /*buoyId,*/ longitude, latitude }) => {
        console.log({ longitude, latitude });
        const popup = new maplibregl.Popup().setHTML(`<p class="text-black">${stationName}</p>`);
        new maplibregl.Marker().setLngLat([longitude, latitude]).setPopup(popup).addTo(map.current);
      });
    }
  }, [map, loaded, locations]);
  return <div ref={containerRef} className="h-full w-full rounded-md" />;
}
