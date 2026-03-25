'use client';
import React from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useMap } from '@/components/visualizations/Maps/useMap';

type BuoyLocationsProps = {
  locations: {
    longitude: number;
    latitude: number;
    stationName: string;
  }[];
};

export function BuoyLocationsMap({ locations }: BuoyLocationsProps) {
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
        paint: {
          'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 1, '#f1f075', 3, '#f28cb1'],
          'circle-radius': ['step', ['get', 'point_count'], 10, 2, 15, 3, 20],
        },
      });
      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'points',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Noto Sans Regular'],
          'text-size': 12,
        },
      });
      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'points',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 10,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
      });
      // inspect a cluster on click
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map.current.on('click', 'clusters', async (e: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        });
        const clusterId = features[0].properties.cluster_id;
        const zoom = await map.current.getSource('points').getClusterExpansionZoom(clusterId);
        map.current.easeTo({
          center: features[0].geometry.coordinates,
          zoom,
        });
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map.current.on('click', 'unclustered-point', (e: any) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const stationName = e.features[0].properties.stationName;

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new maplibregl.Popup().setLngLat(coordinates).setHTML(`${stationName}`).addTo(map.current);
      });
      map.current.on('mouseenter', 'clusters', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'clusters', () => {
        map.current.getCanvas().style.cursor = '';
      });
      map.current.on('mouseenter', 'unclustered-point', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'unclustered-point', () => {
        map.current.getCanvas().style.cursor = '';
      });
      return () => {
        map.current.removeLayer('unclustered-point');
        map.current.removeLayer('clusters');
        map.current.removeSource('points');
      };
    }
  }, [map, loaded, locations]);
  return <div ref={containerRef} className="h-full w-full rounded-md" />;
}
