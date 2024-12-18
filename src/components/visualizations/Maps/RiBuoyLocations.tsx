'use client';
import React from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { RiBuoyCoordinate } from '@/utils/data/api/buoy';
import { useMap } from './useMap';

type RiBuoyLocationsProps = {
  locations: RiBuoyCoordinate[];
};

function formatCoordinatesAsGeoJson(locations: RiBuoyCoordinate[]) {
  return {
    type: 'FeatureCollection',
    features: locations.map(({ stationName, buoyId, longitude, latitude }) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude], // might need to be reversed?
      },
      properties: {
        stationName,
        buoyId,
      },
    })),
  };
}

async function doMapThings(map: any, locations: RiBuoyCoordinate[]) {
  console.log({ beep: locations });
  const image = await map.current.loadImage(
    'https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png'
  );
  map.current.addImage('cat', image.data);
  console.log(image);
  map.current.addSource('locations', {
    type: 'geojson',
    data: formatCoordinatesAsGeoJson(locations),
  });
  map.current.addLayer({
    id: 'buoys',
    type: 'symbol',
    source: 'locations',
    layout: {
      'icon-image': 'cat',
      'icon-size': 0.1,
    },
  });
}

export function RiBuoyLocations({ locations }: RiBuoyLocationsProps) {
  const { map, loaded, containerRef } = useMap();
  React.useEffect(() => {
    if (loaded) {
      //doMapThings(map, locations);
      locations.forEach(({ stationName, /*buoyId,*/ longitude, latitude }) => {
        console.log({ longitude, latitude });
        const popup = new maplibregl.Popup().setHTML(`<p class="text-black">${stationName}</p>`);
        new maplibregl.Marker().setLngLat([longitude, latitude]).setPopup(popup).addTo(map.current);
      });

      /*map.current.addSource("locations", {
        type: "geojson",
        data: formatCoordinatesAsGeoJson(locations),
       });
       map.current.addLayer({
        id: "buoys",
        type: "circle",
        source: "locations",
        paint: {
          "fill-color": "red",
          "circle-radius": 10,
        },
       });*/
    }
  }, [map, loaded, locations]);
  return <div ref={containerRef} className="h-full w-full rounded-md" />;
}
