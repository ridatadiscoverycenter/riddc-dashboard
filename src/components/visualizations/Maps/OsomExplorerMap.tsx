'use client';

import React from 'react';
import { addDays, format } from 'date-fns';
import { LngLatBoundsLike } from 'maplibre-gl';
import { useMap } from './useMap';
import { Header, Input, Label, Select } from '@/components';
import { useInterval } from '@/hooks/useInterval';

type Variable = 'salt' | 'temp' | 'akv';
type Dataset = 'annual-jan' | 'annual-jul';

type OsomExplorerMapProps = {
  dataset: Dataset;
  variable: Variable;
  rasterIndex: number;
};

const VARIABLE_OPTS: Array<{ label: string; value: Variable }> = [
  { label: 'Ocean Temperature', value: 'temp' },
  { label: 'Water Salinity', value: 'salt' },
  { label: 'Kinetic Energy', value: 'akv' },
];

const DATASET_OPTS: Array<{ label: string; value: Dataset }> = [
  { label: 'Annual (Jan.)', value: 'annual-jan' },
  { label: 'Annual (Jul.)', value: 'annual-jul' },
];

const VARIABLE_BOUNDS: Record<Variable, { min: number; max: number }> = {
  temp: {
    min: -6.7,
    max: 27.3,
  },
  salt: {
    min: 0,
    max: 33,
  },
  akv: {
    min: 0,
    max: 5.379223e-06,
  }
};

const HALINE_GRADIENT = 'linear-gradient(0.25turn, #2a186e, #125e8e, #3c9486, #80cd64, #fbee97)';
const THERMAL_GRADIENT = 'linear-gradient(0.25turn, #032333, #634197, #b5607f, #fa973f, #e7fa5a)';
const SPEED_GRADIENT = 'linear-gradient(0.25turn, #fcfccc, #c5ba4c, #538d1f, #0c5d2e, #172213)';

const AUTOPLAY_SPEED_MS = 2000;

const OSOM_BOUNDS: LngLatBoundsLike = [
  [-72.7, 41.9],
  [-69.96, 40.5],
];

export function OsomExporerMap({
  dataset: initialDataset = 'annual-jan',
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

  const timepoints = React.useMemo(
    () => (dataset === 'annual-jan' ? TIMEPOITS_ANNUAL_JAN : TIMEPOITS_ANNUAL_JUL),
    [dataset]
  );

  const incrementIndex = React.useCallback(() => {
    setRasterIndex((current) => (current + 1 >= timepoints.length ? 0 : current + 1));
  }, [setRasterIndex, timepoints]);

  useInterval(incrementIndex, autoplay ? AUTOPLAY_SPEED_MS : undefined);

  // Initialize the map with sources for all timepoints.

  React.useEffect(() => {
    if (loaded) {
      timepoints
        .map((_, index) => ({ index, url: getRasterUrl(dataset, index, variable) }))
        .forEach(({ index, url }) => {
          map.current.addSource(`osom-data-${index}`, {
            type: 'raster',
            tiles: [url],
            attribution: 'Ocean State Ocean Model',
          });
          map.current.addLayer({
            id: `osom-raster-${index}`,
            type: 'raster',
            source: `osom-data-${index}`,
            layout: {
              // Initially, set the selected layer to visible, with all others
              // being invisible.
              visibility: index === rasterIndex ? 'visible' : 'none',
            },
          });
        });

      return () => {
        timepoints.forEach((_, index) => {
          map.current.removeLayer(`osom-raster-${index}`);
          map.current.removeSource(`osom-data-${index}`);
        });
      };
    }
  }, [loaded, timepoints, dataset, variable]);

  // Hide all non-visible layers, and make the selected layer visible.

  React.useEffect(() => {
    if (loaded) {
      timepoints.forEach((_, index) =>
        map.current.setLayoutProperty(`osom-raster-${index}`, 'visibility', 'none')
      );
      map.current.setLayoutProperty(`osom-raster-${rasterIndex}`, 'visibility', 'visible');
    }
  }, [timepoints, rasterIndex]);

  return (
    <>
      <section className="full-bleed w-full min-h-[75vh] md:min-h-[80vh] relative p-0 my-0">
        <div ref={containerRef} className="absolute w-full h-full" />
        <div className="flex flex-col gap-2 absolute top-[3%] left-3 md:top-[8%] md:left-8 bg-white/90 dark:bg-slate-800/90 p-4 rounded-md w-72">
          <Header size="sm" tag="h3" variant="impact">
            {VARIABLE_OPTS.find(({ value }) => variable === value)?.label}
            <br />
          </Header>
          <span>{format(convertOsomIndexToDate(timepoints[rasterIndex]), 'MM/dd/yyyy')}</span>
          <div className="flex flex-row gap-2 items-center">
            <span>
              {VARIABLE_BOUNDS[variable].min} {variable === 'salt' ? 'PSU' : 'ºC'}
            </span>
            <div
              className="flex-1 h-4 rounded-md"
              style={{ backgroundImage: variable === 'salt' ? HALINE_GRADIENT : (variable === "temp" ? THERMAL_GRADIENT: SPEED_GRADIENT) }}
            ></div>
            <span>
              {VARIABLE_BOUNDS[variable].max} {variable === 'salt' ? 'PSU' : 'ºC'}
            </span>
          </div>
        </div>
      </section>
      <p>Customize your visualization by changing the dataset, variable, and timepoint:</p>
      <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
        <Label label="Timepoint">
          <Input
            type="range"
            min={0}
            max={timepoints.length - 1}
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
      </div>
      {dataset === 'annual-jan' && (
        <p>
          All timepoints for the Annual (Jan.) dataset are from noon on the first of January every
          year.
        </p>
      )}
      {dataset === 'annual-jul' && (
        <p>
          All timepoints for the Annual (Jul.) dataset are from noon on the first of July every
          year.
        </p>
      )}
    </>
  );
}

const TIMEPOITS_ANNUAL_JAN = [
  1, 366, 731, 1096, 1462, 1827, 2192, 2557, 2923, 3288, 3653, 4018, 4384, 4749, 5114, 5479, 5845,
  6210,
];
const TIMEPOITS_ANNUAL_JUL = [
  182, 547, 912, 1278, 1643, 2008, 2373, 2739, 3104, 3469, 3834, 4200, 4565, 4930, 5295, 5661, 6026,
  6391,
];

const ANNUAL_RASTER_URL =
  'https://tile-server.riddc.brown.edu/services/annual_<TIMEPOINT>_<VARIABLE>/tiles/{z}/{x}/{y}.png';


function getRasterUrl(dataset: Dataset, timepoint: number, variable: Variable) {
  const timepoints = dataset === 'annual-jan' ? TIMEPOITS_ANNUAL_JAN : TIMEPOITS_ANNUAL_JUL;
  const urlTemplate = ANNUAL_RASTER_URL;
  const boundedTimepoint =
    timepoint < 0 ? 0 : timepoint >= timepoints.length ? timepoints.length - 1 : timepoint;
  return urlTemplate
    .replace('<TIMEPOINT>', timepoints[boundedTimepoint].toString().padStart(4, '0'))
    .replace('<VARIABLE>', variable);
}

function convertOsomIndexToDate(index: number): Date {
  return addDays(new Date(/* Model Start Date */ '01/01/2005'), index - 1);
}
