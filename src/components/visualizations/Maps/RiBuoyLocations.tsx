'use client';
import React from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useMap } from './useMap';
import { RiBuoyCoordinate } from '@/utils/data/api/buoy';

type RiBuoyLocationsProps = {
  locations: RiBuoyCoordinate[];
};

export function RiBuoyLocations({ locations }: RiBuoyLocationsProps) {
  const { map, loaded, containerRef } = useMap();
  React.useEffect(() => {
    if (loaded) {
      locations.forEach(({ stationName, /*buoyId,*/ longitude, latitude }) => {
        const popup = new maplibregl.Popup().setHTML(`<p class="text-black">${stationName}</p>`);
        new maplibregl.Marker({ scale: 0.7, color: '#00008b' })
          .setLngLat([longitude, latitude])
          .setPopup(popup)
          .addTo(map.current);
      });
    }
  }, [map, loaded, locations]);
  return <div ref={containerRef} className="h-full w-full rounded-md" />;
}
