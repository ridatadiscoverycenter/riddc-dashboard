'use client';
import React from 'react';
import maplibregl, { LngLatLike, type GeoJSONFeature } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useMap } from '@/components/visualizations/Maps/useMap';

type BuoyLocationsProps = {
  locations: {
    longitude: number;
    latitude: number;
    stationName: string;
  }[];
};

type Geometry = {
  coordinates: LngLatLike;
};
type MaplibreGeoJSONFeature<T> = T & {
  geometry: Geometry;
};

export function BuoyLocationsMap({ locations }: BuoyLocationsProps) {
  const markers = React.useRef<maplibregl.Marker[]>([]);
  const { map, loaded, containerRef } = useMap();
  const locationGeojson = {
    type: 'geojson',
    cluster: true,
    clusterRadius: 10,
    clusterMaxZoom: 15,
    data: {
      features: locations.map(({ stationName, longitude, latitude }) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [longitude, latitude] },
        properties: { stationName },
      })),
    },
  };
  React.useEffect(() => {
    if (loaded) {
      map.current.addSource('points', locationGeojson);
      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'points',
        filter: ['has', 'point_count'],
      });

      map.current.once('idle', () => {
        addMarkers();
      });

      map.current.on('zoomend', () => {
        removeMarkers();
        addMarkers();
      });

      return () => {
        map.current.removeLayer('clusters');
        map.current.removeSource('points');
      };
    }
  }, [map, loaded, locations]);

  async function addMarkers() {
    const currentMarkers: maplibregl.Marker[] = [];
    const points: MaplibreGeoJSONFeature<GeoJSONFeature>[] =
      await map.current.querySourceFeatures('points');
    points.map(({ properties, geometry }) => {
      // clustered point
      if (properties.cluster) {
        const el = document.createElement('div');
        el.textContent = properties.point_count;
        el.tabIndex = 0;
        el.className =
          'grid  h-8 w-8 bg-[#f1f075] ring-4 ring-solid ring-[#f1f075] ring-opacity-50 rounded-full absolute place-content-center place-items-center';
        const marker = new maplibregl.Marker({ element: el });
        marker.setLngLat(geometry.coordinates).addTo(map.current);

        el.addEventListener('click', () => {
          zoomOnClick(properties.cluster_id, geometry);
        });
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') zoomOnClick(properties.cluster_id, geometry);
        });
        currentMarkers.push(marker);
      } else {
        const el = document.createElement('div');
        el.tabIndex = 0;
        el.className =
          'grid bg-blue-900 ring-1 ring-solid  ring-blue-500 ring-inset h-4 w-4 rounded-full absolute place-content-center place-items-center';
        const popup = new maplibregl.Popup().setHTML(
          `<div style={{backgroundColor: 'black'}}>${properties.stationName}</div>`
        );
        const marker = new maplibregl.Marker({ element: el })
          .setPopup(popup)
          .setLngLat(geometry.coordinates)
          .addTo(map.current);
        currentMarkers.push(marker);
      }
    });

    markers.current = currentMarkers;
  }

  const removeMarkers = () => {
    markers.current.map((marker) => {
      const el = marker.getElement();
      marker.remove();
      el.remove();
    });
    markers.current = [];
  };

  async function zoomOnClick(clusterId: number, geometry: Geometry) {
    const zoom = await map.current.getSource('points').getClusterExpansionZoom(clusterId);
    map.current.easeTo({
      center: geometry.coordinates,
      zoom: zoom + 0.1,
    });
  }
  return <div ref={containerRef} className="h-full w-full rounded-md" />;
}
