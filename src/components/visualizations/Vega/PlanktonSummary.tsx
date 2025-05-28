'use client';
import React from 'react';
import { Vega, VisualizationSpec } from 'react-vega';

import {
  PLANKTON_VARIABLES,
  type PlanktonSummaryData,
  type PlanktonVariable,
} from '@/utils/data/api/buoy/plankton';
import { Size, useScreenSize } from '@/hooks/useScreenSize';
import { Loading, Select } from '@/components';

type PlanktonBuoySummaryProps = {
  data: PlanktonSummaryData[];
};

function getGraphicWidth(size: Size | undefined) {
  if (size === 'sm' || size === 'xs') return 175;
  if (size === 'md') return 350;
  if (size === 'lg') return 250;
  if (size === 'xl') return 400;
  return 550;
}

export function PlanktonSummary({ data }: PlanktonBuoySummaryProps) {
  const size = useScreenSize();
  const [variable, setVariable] = React.useState<PlanktonVariable>('SilicaBottom');
  const buoySummarySpec = React.useMemo<VisualizationSpec>(
    () => ({
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      description: 'Buoy Data Summary Chart',
      background: 'transparent',
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
          padding: 0.02,
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
          labelAngle: -45,
          labelAlign: 'right',
          domain: false,
          title: 'Month/Year',
          labelOverlap: 'parity',
          titleFont: 'serif',
          labelFont: 'serif',
        },
        {
          orient: 'left',
          scale: 'y',
          domain: false,
          labelFont: 'serif',
        },
      ],
      legends: [
        {
          title: 'Observations',
          fill: 'color',
          type: 'gradient',
          gradientLength: { signal: 'height' },
          titleFont: 'serif',
          labelFont: 'serif',
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
        <Select
          forceLight
          label="Data:"
          value={variable}
          onChange={(e) => setVariable(e.target.value as PlanktonVariable)}
          options={PLANKTON_VARIABLES.map((key) => ({
            label: key
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .split(' ')
              .map(
                (word, index, total) =>
                  `${index === total.length - 1 && total.length > 1 ? '(' : ''}${word[0].toLocaleUpperCase()}${word.slice(1)}${index === total.length - 1 && total.length > 1 ? ')' : ''}`
              )
              .join(' '),
            value: key,
          }))}
        />
      </form>
      {size === undefined ? (
        <div className="w-[300px] h-[300px] flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <Vega
          className="flex flex-col items-center justify-center"
          actions={false}
          spec={buoySummarySpec}
        />
      )}
    </>
  );
}
