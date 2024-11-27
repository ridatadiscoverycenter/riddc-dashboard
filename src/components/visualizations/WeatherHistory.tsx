'use client';
import React from 'react';
import { Vega, VisualizationSpec } from 'react-vega';

import { Loading } from '@/components';
import { Size, useScreenSize } from '@/hooks/useScreenSize';
import type { WeatherData } from '@/utils/weather';

type WeatherHistoryProps = {
  data: WeatherData[];
  height?: number;
};

function getGraphicWidth(size: Size | undefined) {
  if (size === 'xs') return 200;
  if (size === 'sm') return 275;
  if (size === 'md') return 500;
  if (size === 'lg') return 425;
  if (size === 'xl') return 600;
  return 750;
}

export function WeatherHistory({ data, height = 150 }: WeatherHistoryProps) {
  const size = useScreenSize();
  const weatherHistorySpec = React.useMemo<VisualizationSpec>(
    () => ({
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      description: 'Weather History Chart',
      width: getGraphicWidth(size),
      //autosize: "fit-x",
      height,
      background: 'transparent',
      signals: [
        {
          name: 'hover',
          value: null,
          on: [
            { events: '@points_voronoi:mouseover', update: 'datum' },
            { events: '@points_voronoi:mouseout', update: 'null' },
          ],
        },
      ],
      data: [
        {
          name: 'weather',
          values: data,
          transform: [
            {
              type: 'formula',
              as: 'precipitation',
              expr: 'isNaN(datum.precipitation) ? 0 : datum.precipitation',
            },
          ],
        },
        {
          name: 'highlightedPoint',
          source: 'weather',
          transform: [
            {
              type: 'filter',
              expr: 'hover && hover.datum.date === datum.date',
            },
          ],
        },
      ],
      scales: [
        {
          name: 'xscale',
          type: 'time',
          domain: { fields: [{ data: 'weather', field: 'date' }] },
          range: 'width',
          round: true,
        },
        {
          name: 'tempScale',
          type: 'linear',
          domain: { data: 'weather', fields: ['minTemp', 'maxTemp'] },
          nice: true,
          zero: false,
          range: 'height',
        },
        {
          name: 'precipitationScale',
          type: 'linear',
          domain: { data: 'weather', field: 'precipitation' },
          nice: true,
          zero: false,
          range: 'height',
        },
        {
          name: 'colorScale',
          type: 'ordinal',
          domain: ['Range', 'Average'],
          range: ['pink', 'black'],
        },
      ],
      legends: [
        {
          stroke: 'colorScale',
          orient: 'bottom',
          direction: 'horizontal',
          title: 'Temperature',
          symbolType: 'stroke',
          titleFont: 'serif',
          labelFont: 'serif',
        },
      ],
      axes: [
        {
          orient: 'bottom',
          scale: 'xscale',
          title: 'Time',
          labelAngle: -45,
          labelAlign: "right",
          titleFont: 'serif',
          labelFont: 'serif',
        },
        {
          orient: 'left',
          scale: 'tempScale',
          title: 'Temperature (°C)',
          grid: false,
          titleFont: 'serif',
          labelFont: 'serif',
        },
        {
          orient: 'right',
          scale: 'precipitationScale',
          title: 'Precipitation (in/day)',
          grid: false,
          titleFont: 'serif',
          labelFont: 'serif',
        },
      ],
      marks: [
        {
          type: 'area',
          from: { data: 'weather' },
          encode: {
            enter: {
              x: { scale: 'xscale', field: 'date' },
              y: { scale: 'tempScale', field: 'minTemp' },
              y2: { scale: 'tempScale', field: 'maxTemp' },
              fill: { scale: 'colorScale', value: 'Range' },
            },
            update: {
              interpolate: { value: 'basis' },
              fillOpacity: { value: 0.7 },
            },
          },
        },
        {
          type: 'line',
          name: 'avgTempLine',
          from: { data: 'weather' },
          encode: {
            enter: {
              x: { scale: 'xscale', field: 'date' },
              y: { scale: 'tempScale', field: 'avgTemp' },
              stroke: { scale: 'colorScale', value: 'Average' },
              strokeWidth: { value: 1 },
            },
          },
        },
        {
          name: 'points_voronoi',
          type: 'path',
          from: { data: 'avgTempLine' },
          encode: {
            update: {
              fill: { value: 'transparent' },
              tooltip: {
                signal:
                  "{ 'Min. Temp': datum.datum.minTemp + ' °C', 'Avg. Temp': datum.datum.avgTemp + ' °C', 'Max. Temp': datum.datum.maxTemp + ' °C', 'Precipitation': datum.datum.precipitation + ' (in/day)', 'Date': utcFormat(datum.datum.date, '%Y-%m-%d'), }",
              },
            },
          },
          transform: [
            {
              type: 'voronoi',
              x: 'datum.x',
              y: 'datum.y',
              size: [{ signal: 'width' }, { signal: 'height' }],
            },
          ],
        },
        {
          from: { data: 'highlightedPoint' },
          type: 'symbol',
          interactive: false,
          encode: {
            update: {
              x: { scale: 'xscale', field: 'date' },
              y: { scale: 'tempScale', field: 'avgTemp' },
              stroke: { value: 'green' },
              strokeWidth: { value: 4 },
              fill: { value: 'white' },
              size: { value: 150 },
              strokeOpacity: { value: 0.3 },
            },
          },
        },
        {
          type: 'rect',
          from: { data: 'weather' },
          encode: {
            enter: {
              x: { scale: 'xscale', field: 'date' },
              y: { scale: 'precipitationScale', value: 0 },
              y2: { scale: 'precipitationScale', field: 'precipitation' },
              fill: { value: 'skyblue' },
              // "fill": {"scale": "rainScale", "value": "total"},
              width: { value: 1 },
              opacity: { value: 0.7 },
            },
          },
        },
      ],
    }),
    [data, size, height]
  );
  if (size === undefined) {
    return (
      <div className="h-[300px] flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  return <Vega spec={weatherHistorySpec} actions={false} />;
}
