'use client';

import React from 'react';
import { addDays, format } from 'date-fns';
import { LngLatBoundsLike } from 'maplibre-gl';
import { useMap } from './useMap';
import { Header, Input, Label, Select } from '@/components';
import { useInterval } from '@/hooks/useInterval';

type Variable = 'salt' | 'temp';
type Dataset = 'annual';

type OsomExplorerMapProps = {
  dataset: Dataset;
  variable: Variable;
  rasterIndex: number;
};

const VARIABLE_OPTS: Array<{ label: string; value: Variable }> = [
  { label: 'Ocean Temperature', value: 'temp' },
  { label: 'Water Salinity', value: 'salt' },
];

const DATASET_OPTS: Array<{ label: string; value: Dataset }> = [
  { label: 'Annual (Jan.)', value: 'annual' },
];

const VARIABLE_BOUNDS: Record<Dataset, Record<Variable, { min: number; max: number }>> = {
  annual: {
    temp: {
      min: -6.7,
      max: 12.1,
    },
    salt: {
      min: 0,
      max: 33,
    },
  },
};

const HALINE_GRADIENT = 'linear-gradient(0.25turn, #2a186e, #125e8e, #3c9486, #80cd64, #fbee97)';
const THERMAL_GRADIENT = 'linear-gradient(0.25turn, #032333, #634197, #b5607f, #fa973f, #e7fa5a)';

const OSOM_BOUNDS: LngLatBoundsLike = [
  [-72.7, 41.9],
  [-69.96, 40.5],
];

export function OsomExporerMap({
  dataset: initialDataset = 'annual',
  variable: initialVariable = 'temp',
  rasterIndex: initialRasterIndex = 0,
}: OsomExplorerMapProps) {
  const { map, loaded, containerRef } = useMap(OSOM_BOUNDS);
  const [dataset, setDataset] = React.useState<Dataset>(initialDataset);
  const [variable, setVariable] = React.useState<Variable>(initialVariable);
  const [rasterIndex, setRasterIndex] = React.useState(initialRasterIndex);
  const [autoplay, setAutoplay] = React.useState(false);

  React.useEffect(() => {
    // Sync visualization state with URL params
    const url = new URL(window.location.href);
    url.searchParams.set('dataset', dataset);
    url.searchParams.set('var', variable);
    url.searchParams.set('index', rasterIndex.toString());
    window.history.replaceState({}, '', url);
  }, [dataset, variable, rasterIndex]);

  const rasterUrl = React.useMemo(
    () => getRasterUrl(dataset, rasterIndex, variable),
    [dataset, rasterIndex, variable]
  );

  React.useEffect(() => {
    if (loaded) {
      map.current.addSource('osom-data', {
        type: 'raster',
        tiles: [rasterUrl],
        attribution: 'Ocean State Ocean Model',
      });

      map.current.addLayer({
        id: 'osom-raster',
        type: 'raster',
        source: 'osom-data',
      });

      return () => {
        map.current.removeLayer('osom-raster');
        map.current.removeSource('osom-data');
      };
    }
  }, [loaded, rasterUrl]);

  const incrementIndex = React.useCallback(() => {
    setRasterIndex((current) => (current + 1 >= YEARLY_VALUE_INDECIES.length ? 0 : current + 1));
  }, [setRasterIndex, YEARLY_VALUE_INDECIES]);

  useInterval(incrementIndex, autoplay ? 2000 : undefined);

  return (
    <>
      <section className="full-bleed w-full min-h-[80vh] relative p-0 my-0">
        <div ref={containerRef} className="absolute w-full h-full" />
        {/*<div className="flex flex-col items-center gap-2 h-48 absolute top-[3%] right-3 md:top-[8%] md:right-8 bg-white/90 dark:bg-slate-800/90 p-4 rounded-md overflow-auto">
        <span>
          {VARIABLE_BOUNDS[variable].min} {variable === 'salt' ? 'PSU' : 'ºC'}
        </span>
        <div
          className="flex-1 w-2 rounded-md"
          style={{ backgroundImage: variable === 'salt' ? HALINE_GRADIENT : THERMAL_GRADIENT }}
        ></div>
        <span>
          {VARIABLE_BOUNDS[variable].max} {variable === 'salt' ? 'PSU' : 'ºC'}
        </span>
      </div>*/}
        <div className="flex flex-col gap-2 absolute top-[3%] left-3 md:top-[8%] md:left-8 bg-white/90 dark:bg-slate-800/90 p-4 rounded-md overflow-auto">
          <Header size="sm" tag="h3">
            {VARIABLE_OPTS.find(({ value }) => variable === value)?.label} on{' '}
            {format(convertOsomIndexToDate(YEARLY_VALUE_INDECIES[rasterIndex]), 'MM/dd/yyyy')}
          </Header>
          <div className="flex flex-row gap-2 items-center">
            <span>
              {VARIABLE_BOUNDS[dataset][variable].min} {variable === 'salt' ? 'PSU' : 'ºC'}
            </span>
            <div
              className="flex-1 h-4 rounded-md"
              style={{ backgroundImage: variable === 'salt' ? HALINE_GRADIENT : THERMAL_GRADIENT }}
            ></div>
            <span>
              {VARIABLE_BOUNDS[dataset][variable].max} {variable === 'salt' ? 'PSU' : 'ºC'}
            </span>
          </div>
        </div>
      </section>
      <p>Customize your visualization by changing the dataset, variable, and timepoint:</p>
      <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
        <Select
          label="Dataset"
          options={DATASET_OPTS}
          defaultValue={DATASET_OPTS[0]}
          value={DATASET_OPTS.find(({ value }) => value === dataset)}
          onChange={(e) => {
            const selectedDataset = e as { value: Dataset; label: string };
            setDataset(selectedDataset.value);
          }}
        />
        <Select
          label="Model Variable"
          options={VARIABLE_OPTS}
          defaultValue={VARIABLE_OPTS[0]}
          value={VARIABLE_OPTS.find(({ value }) => value === variable)}
          onChange={(e) => {
            const selectedVariable = e as { value: Variable; label: string };
            setVariable(selectedVariable.value);
          }}
        />
        <Label label="Timepoint">
          <Input
            type="range"
            min={0}
            max={YEARLY_VALUE_INDECIES.length - 1}
            value={rasterIndex}
            onChange={(e) => {
              e.preventDefault();
              setRasterIndex(Number(e.target.value));
              setAutoplay(false);
            }}
          />
        </Label>
        <Label label="Autoplay?">
          <Input
            type="checkbox"
            checked={autoplay}
            onChange={(e) => setAutoplay(e.target.checked)}
          />
        </Label>
      </div>
      <div className="flex flex-row items-center justify-around w-full"></div>
    </>
  );
}

const YEARLY_VALUE_INDECIES = [
  1096, 1462, 1827, 2192, 2557, 2923, 3288, 3653, 4018, 4384, 4749, 5114, 5479, 5845, 6210,
];

const ANNUAL_RASTER_URL =
  'https://qa-tile-server.riddc.brown.edu/services/ocean_his_<TIMEPOINT>_<VARIABLE>@1/tiles/{z}/{x}/{y}.png';


function getRasterUrl(dataset: Dataset, timepoint: number, variable: Variable) {
  const boundedTimepoint =
    timepoint < 0
      ? 0
      : timepoint >= YEARLY_VALUE_INDECIES.length
        ? YEARLY_VALUE_INDECIES.length - 1
        : timepoint;
  return ANNUAL_RASTER_URL.replace(
    '<TIMEPOINT>',
    YEARLY_VALUE_INDECIES[boundedTimepoint].toString()
  ).replace('<VARIABLE>', variable);
}

function convertOsomIndexToDate(index: number): Date {
  return addDays(new Date('01/01/2005'), index - 1);
}
