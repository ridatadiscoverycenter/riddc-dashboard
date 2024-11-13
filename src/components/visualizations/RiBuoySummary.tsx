'use client';
import React from 'react';
import { Vega, VisualizationSpec } from 'react-vega';

import type { RiBuoySummaryData, RiBuoyViewerVariable } from '@/utils/erddap/api/buoy';
import { RI_BUOY_VIEWER_VARIABLES } from '@/utils/erddap/api/buoy';
import { Size, useScreenSize } from '@/hooks/useScreenSize';
import { Label } from '../Label';

type RiBuoySummaryProps = {
  data: RiBuoySummaryData[];
};

function getGraphicWidth(size: Size) {
  if (size === 'xs') return 60;
  if (size === 'sm') return 120;
  if (size === 'md') return 340;
  if (size === 'lg') return 440;
  return 700;
}

export function RiBuoySummary({ data }: RiBuoySummaryProps) {
  const size = useScreenSize();
  const [variable, setVariable] = React.useState<RiBuoyViewerVariable>('chlorophyll');
  const buoySummarySpec = React.useMemo<VisualizationSpec>(
    () => ({
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      description: 'Buoy Data Summary Chart',
      width: getGraphicWidth(size),
      height: 300,
      data: [
        {
          name: 'rawData',
          values: data,
          transform: [
            {
              type: 'formula',
              as: 'date',
              expr: `utcOffset("month", datum.time)`,
            },
          ],
        },
        {
          name: 'data',
          source: 'rawData',
          transform: [{ type: 'filter', expr: `datum.${variable} > 1` }],
        },
      ],
      scales: [
        {
          name: 'x',
          type: 'utc',
          domain: {
            fields: [{ data: 'data', field: 'date' }],
          },
          range: 'width',
          nice: 'month',
        },
        {
          name: 'y',
          type: 'band',
          domain: { data: 'data', field: 'stationName' },
          range: 'height',
          padding: 0.02,
        },
        {
          name: 'color',
          type: 'linear',
          range: { scheme: 'tealblues' },
          domain: { data: 'data', field: variable },
          reverse: false,
          zero: false,
          nice: true,
        },
      ],
      axes: [
        {
          orient: 'bottom',
          scale: 'x',
          domain: false,
          title: 'Month/Year',
          labelOverlap: 'parity',
        },
        { orient: 'left', scale: 'y', domain: false, title: 'Buoy' },
      ],
      legends: [
        {
          title: ['Number of', 'Observations'],
          fill: 'color',
          type: 'gradient',
          gradientLength: { signal: 'height' },
        },
      ],
      marks: [
        {
          type: 'rect',
          from: { data: 'data' },
          encode: {
            enter: {
              x: { scale: 'x', field: 'date' },
              y: { scale: 'y', field: 'stationName' },
              width: {
                signal: "scale('x', timeOffset('month', now())) - scale('x', now())",
              },
              height: { scale: 'y', band: 1 },
              tooltip: {
                signal: `{'Date': utcFormat(toDate(datum.date), '%B %Y'), 'Buoy': datum.stationName, 'Count': datum.${variable}}`,
              },
            },
            update: { fill: { scale: 'color', field: variable } },
          },
        },
      ],
    }),
    [data, variable, size]
  );
  return (
    <>
      <form className="self-stretch">
        <Label label="Data:" forceLight>
          <select
            value={variable}
            className="p-2 rounded-md"
            onChange={(e) => setVariable(e.target.value as RiBuoyViewerVariable)}
          >
            <option disabled>~~Select a variable~~</option>
            {RI_BUOY_VIEWER_VARIABLES.map((key) => (
              <option key={key} value={key}>
                {key
                  .replace(/([a-z])([A-Z])/g, '$1 $2')
                  .split(' ')
                  .map(
                    (word, index, total) =>
                      `${index === total.length - 1 && total.length > 1 ? '(' : ''}${word[0].toLocaleUpperCase()}${word.slice(1)}${index === total.length - 1 && total.length > 1 ? ')' : ''}`
                  )
                  .join(' ')}
              </option>
            ))}
          </select>
        </Label>
      </form>
      <Vega
        className="flex  flex-col items-center justify-center"
        actions={false}
        spec={buoySummarySpec}
        data={{ table: data }}
      />
    </>
  );
}
