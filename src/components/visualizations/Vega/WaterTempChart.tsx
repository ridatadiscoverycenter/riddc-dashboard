'use client';
import React from 'react';
import { Vega, VisualizationSpec } from 'react-vega';

import { Size, useScreenSize } from '@/hooks/useScreenSize';
import { Loading } from '@/components';
import { Temperature } from '@/types';

type WaterTemperatureChartProps = {
  data: Temperature[];
  colors?: string[];
};

function getGraphicWidth(size: Size | undefined) {
  if (size === 'xs') return 200;
  if (size === 'sm') return 275;
  if (size === 'md') return 500;
  if (size === 'lg') return 425;
  if (size === 'xl') return 600;
  return 750;
}

//TODO: this is actually water temp *delta* from average -- needs an explainer!

export function WaterTempChart({ data }: WaterTemperatureChartProps) {
  const size = useScreenSize();

  const waterTempSpec = React.useMemo<VisualizationSpec>(
    () => ({
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      description: 'Water Temperature',
      background: 'transparent',
      width: getGraphicWidth(size),
      height: 300,
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
          name: 'data',
          values: data,
          // transform: [
          //   { type: 'formula', as: 'month', expr: `utcOffset("month", datum.timestamp)` },
          // ],
        },
        {
          name: 'filtered',
          values: data,
          transform: [{ type: 'filter', expr: 'datum.delta !== null' }],
        },
      ],
      scales: [
        { name: 'x', type: 'utc', range: 'width', domain: { data: 'data', field: 'timestamp' } },
        {
          name: 'y',
          type: 'linear',
          range: 'height',
          domain: { data: 'data', field: 'delta' },
          nice: true,
        },
        {
          name: 'color',
          type: 'ordinal',
          range: { scheme: 'tableau10' },
          domain: { data: 'data', field: 'station' },
        },
      ],
      marks: [
        {
          type: 'group',
          description: 'Water temperature',
          name: 'tempplot',
          encode: {
            enter: {
              y: { value: 0 },
              width: { signal: 'width' },
              height: { signal: 'height' },
            },
          },
          signals: [
            {
              name: 'hovered',
              value: null,
              on: [
                { events: '@voronoi:mouseover', update: 'datum' },
                { events: 'mouseout', update: 'null' },
              ],
            },
          ],
          axes: [
            {
              orient: 'bottom',
              scale: 'x',
              labelOverlap: true,
              title: 'Year',
              ticks: false,
            },
            {
              orient: 'left',
              scale: 'y',
              title: 'Surface °C Δ from Seasonally-Adjusted Mean',
              grid: false,
            },
          ],
          marks: [
            {
              type: 'symbol',
              name: 'points_on_line',
              from: { data: 'filtered' },
              zindex: 1,

              encode: {
                enter: {
                  strokeWidth: { value: 4 },
                  fill: { scale: 'color', field: 'station' },
                  x: { scale: 'x', field: 'timestamp' },
                  y: { scale: 'y', field: 'delta' },
                  tooltip: {
                    signal:
                      "{ 'Δ Temp (°C)': format(datum.delta, ',.3f'), 'Month': utcFormat(datum.timestamp, '%B %Y'), 'Station': datum.station }",
                  },
                  defined: {
                    signal: 'isNumber(datum.delta)',
                    // 'isValid(datum["x"]) && isFinite(+datum["x"]) && isValid(datum["y"]) && isFinite(+datum["y"])',
                  },
                },
                update: {
                  size: [
                    // this should be resizing on hover?
                    {
                      test: 'hovered && hovered.datum === datum',
                      value: 50,
                    },
                    { value: 25 },
                  ],
                },
              },
            },
            {
              type: 'path',
              name: 'voronoi',
              zindex: 2,
              from: { data: 'points_on_line' },
              encode: {
                enter: {
                  stroke: { value: 'transparent' },
                  fill: { value: 'transparent' },
                  tooltip: {
                    signal:
                      "{ 'Month': utcFormat(datum.datum.timestamp, '%B %Y'), 'Station': datum.datum.station, 'Δ Temp': format(datum.datum.delta, ',.3f') + '°C' }",
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
              type: 'group',
              from: {
                facet: {
                  name: 'series',
                  data: 'data',
                  groupby: ['station'],
                },
              },
              marks: [
                {
                  type: 'line',
                  from: { data: 'series' },
                  encode: {
                    enter: {
                      strokeWidth: { value: 2 },
                      x: { scale: 'x', field: 'timestamp' },
                      y: { scale: 'y', field: 'delta' },
                      stroke: { scale: 'color', field: 'station' },
                      opacity: { value: 0.8 },
                      // defined: {
                      //   signal:
                      //     'isValid(datum["x"]) && isFinite(+datum["x"]) && isValid(datum["y"]) && isFinite(+datum["y"])',
                      // },
                      defined: {
                        signal: 'isNumber(datum.delta)',
                        // 'isValid(datum["x"]) && isFinite(+datum["x"]) && isValid(datum["y"]) && isFinite(+datum["y"])',
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
    [data, size]
  );
  return (
    <>
      {size === undefined ? (
        <div className="w-[300px] h-[300px] flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <Vega
          className="flex flex-col items-center justify-center"
          actions={false}
          spec={waterTempSpec}
        />
      )}
    </>
  );
}
