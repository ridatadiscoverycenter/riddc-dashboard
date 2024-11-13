'use client';
import React from 'react';
import { Vega, VisualizationSpec } from 'react-vega';
import { RiBuoyCoordinate } from '@/utils/erddap/api/buoy';

import { RiGeoJson, RiGeoJsonOutlines } from '@/static/ri.geojson';

type RiBuoyMapProps = {
  locations: RiBuoyCoordinate[];
};

export function RiBuoyMap({ locations }: RiBuoyMapProps) {
  const buoyMapSpec = React.useMemo<VisualizationSpec>(
    () => ({
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      background: 'transparent',
      height: 300,
      width: 300,
      data: [
        {
          name: 'outlines',
          values: RiGeoJsonOutlines,
        },
        {
          name: 'ri',
          values: RiGeoJson,
          format: { type: 'topojson', mesh: 'ri' },
        },
        {
          name: 'points',
          values: locations,
          transform: [
            {
              type: 'geopoint',
              projection: 'projection',
              fields: ['longitude', 'latitude'],
            },
          ],
        },
      ],
      projections: [
        {
          name: 'projection',
          type: 'mercator',
          size: { signal: '[width, height]' },
          fit: { signal: '[data("ri"), data("outlines")]' },
        },
      ],
      scales: [
        {
          name: 'color',
          type: 'ordinal',
          range: [
            '#2e0d93',
            '#fd5925',
            '#3f6f94',
            '#daa4f9',
            '#6fcf1d',
            '#801967',
            '#f1d438',
            '#1dfee1',
            '#f35c79',
            '#faa566',
            '#456fe7',
            '#9f6c3b',
            '#87c4c1',
          ],
          domain: locations
            .map(({ stationName }) => stationName)
            .sort((s1, s2) => s1.localeCompare(s2)),
        },
      ],
      legends: [
        {
          title: 'Buoys',
          orient: 'bottom',
          type: 'symbol',
          symbolType: 'circle',
          fill: 'color',
          columns: 2,
        },
      ],
      marks: [
        {
          type: 'shape',
          from: { data: 'outlines' },
          encode: {
            enter: { strokeWidth: { value: 1 }, stroke: { value: '#d3d3d3' } },
          },
          transform: [{ type: 'geoshape', projection: 'projection' }],
        },
        {
          type: 'shape',
          from: { data: 'ri' },
          encode: {
            enter: {
              strokeWidth: { value: 1 },
              stroke: { value: '#d3d3d3' },
              fill: { value: 'whitesmoke' },
            },
          },
          transform: [{ type: 'geoshape', projection: 'projection' }],
        },
        {
          type: 'symbol',
          from: { data: 'points' },
          encode: {
            enter: {
              size: { value: 100 },
              stroke: { scale: 'color', field: 'stationName' },
              fill: { scale: 'color', field: 'stationName' },
              tooltip: {
                signal:
                  '{"Buoy ID": datum.buoyId, "Station Name": datum.stationName, "Latitude": format(datum.latitude, ".4f"), "Longitude": format(datum.longitude, ".4f")}',
              },
            },
            update: { x: { field: 'x' }, y: { field: 'y' } },
          },
        },
      ],
    }),
    [locations]
  );
  return <Vega actions={false} spec={buoyMapSpec} />;
}
