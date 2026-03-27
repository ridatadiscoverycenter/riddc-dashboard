'use client';
import React from 'react';
import maplibregl, { typeOf } from 'maplibre-gl';
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
    async function makeMap() {
      if (loaded) {
        const source = map.current.addSource('points', locationGeojson);
        // query features once loaded
        map.current.once('idle', function () {
          // todo we need to re-add markers
          const points = map.current.querySourceFeatures('points');
          points.map(({ properties, geometry, id }) => {
            if (properties.cluster) {
              const el = document.createElement('button');
              el.addEventListener('click', (e) =>
                zoomOnClick(e, map, properties.cluster_id, geometry)
              );
              el.textContent = properties.point_count;
              // el.tabIndex = 0;
              el.className =
                'grid bg-[#f1f075] h-10 w-10 rounded-full absolute place-content-center place-items-center';
              const marker = new maplibregl.Marker({ element: el });
              marker.setLngLat(geometry.coordinates).addTo(map.current);
            } else {
              const el = document.createElement('div');
              el.tabIndex = 0;
              el.className =
                'grid bg-[#f1f075] h-10 w-10 rounded-full absolute place-content-center place-items-center';
              const popup = new maplibregl.Popup().setHTML(
                `<div style={{backgroundColor: 'black'}}>${properties.stationName}</div>`
              );
              new maplibregl.Marker({ element: el })
                .setPopup(popup)
                .setLngLat(geometry.coordinates)
                .addTo(map.current);
            }
          });
        });

        map.current.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'points',
          filter: ['has', 'point_count'],
        });
        // inspect a cluster on click
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // map.current.on('click', 'unclustered-point', (e: any) => {
        //   const coordinates = e.features[0].geometry.coordinates.slice();
        //   const stationName = e.features[0].properties.stationName;

        //   // Ensure that if the map is zoomed out such that
        //   // multiple copies of the feature are visible, the
        //   // popup appears over the copy being pointed to.
        //   while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        //   }

        //   new maplibregl.Popup()
        //     .setLngLat(coordinates)
        //     .setHTML(`<div style={{backgroundColor: 'black'}}>${stationName}</div>`)
        //     .addTo(map.current);
        // });
        map.current.on('mouseenter', 'clusters', () => {
          map.current.getCanvas().style.cursor = 'pointer';
        });
        map.current.on('focus', 'clusters', () => {
          console.log('focused');
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
          map.current.removeLayer('cluster-count');
          map.current.removeLayer('clusters');
          map.current.removeSource('points');
        };
      }
    }
    makeMap();
  }, [map, loaded, locations]);
  return <div ref={containerRef} className="h-full w-full rounded-md" />;
}

async function zoomOnClick(e: any, map, clusterId, geometry) {
  console.log(geometry);
  const zoom = await map.current.getSource('points').getClusterExpansionZoom(clusterId);
  map.current.easeTo({
    center: geometry.coordinates,
    zoom,
  });
  // map.current.on('click', 'clusters', async (e: any) => {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const features = map.current.queryRenderedFeatures(e.point, {
  //     layers: ['clusters'],
  //   });
  //   const clusterId = features[0].properties.cluster_id;
  //   const zoom = await map.current.getSource('points').getClusterExpansionZoom(clusterId);
  //   map.current.easeTo({
  //     center: features[0].geometry.coordinates,
  //     zoom,
  //   });
  // });
}
