'use client';

import React from 'react';
import { format, eachMonthOfInterval } from 'date-fns';
import { LngLatBoundsLike } from 'maplibre-gl';
import { useMap } from './useMap';
import { Header, Input, Label, Select } from '@/components';
import { useInterval } from '@/hooks/useInterval';

import { OsomExplorerVariable, OsomExplorerDataset } from '@/types';

type OsomExplorerMapProps = {
  dataset: OsomExplorerDataset;
  variable: OsomExplorerVariable;
  timepoint: number;
};

const VARIABLE_OPTS: Array<{ label: string; value: OsomExplorerVariable }> = [
  { label: 'Salinity (Bottom)', value: 'SalinityBottom' },
  { label: 'Salinity (Surface)', value: 'SalinitySurface' },
  { label: 'Water Temperature (Bottom)', value: 'WaterTempBottom' },
  { label: 'Water Temperature (Surface)', value: 'WaterTempSurface' },
  { label: 'Surface Height', value: 'SurfaceHeight' },
  { label: 'Velocity East (Bottom)', value: 'VelocityEastwardBottom' },
  { label: 'Velocity East (Surface)', value: 'VelocityEastwardSurface' },
  { label: 'Velocity North (Bottom)', value: 'VelocityNorthwardBottom' },
  { label: 'Velocity North (Surface)', value: 'VelocityNorthwardSurface' },
  { label: 'Kinetic Energy (Bottom)', value: 'KineticEnergyBottom' },
  { label: 'Kinetic Energy (Surface)', value: 'KineticEnergySurface' },
];

const DATASET_OPTS: Array<{ label: string; value: OsomExplorerDataset }> = [
  { label: 'Monthly Averages', value: 'monthly_avg' },
];

const VARIABLE_UNITS: Record<OsomExplorerVariable, string> = {
  WaterTempBottom: 'ºC',
  WaterTempSurface: 'ºC',
  SalinityBottom: 'PSU',
  SalinitySurface: 'PSU',
  KineticEnergyBottom: 'J/Kg',
  KineticEnergySurface: 'J/Kg',
  SurfaceHeight: '???',
  VelocityEastwardBottom: '???',
  VelocityEastwardSurface: '???',
  VelocityNorthwardBottom: '???',
  VelocityNorthwardSurface: '???',
};

const VARIABLE_BOUNDS: Record<OsomExplorerVariable, { min: string; max: string }> = {
  WaterTempBottom: {
    min: '-0.03',
    max: '8.11',
  },
  WaterTempSurface: {
    min: '-0.05',
    max: '7.14',
  },
  SalinityBottom: {
    min: '0',
    max: '33',
  },
  SalinitySurface: {
    min: '0',
    max: '33',
  },
  KineticEnergyBottom: {
    min: '3.33e-07',
    max: '0.52',
  },
  KineticEnergySurface: {
    min: '9,49e-07',
    max: '1.54',
  },
  SurfaceHeight: {
    min: '-0.24',
    max: '0.418',
  },
  VelocityEastwardBottom: {
    min: '-0.36',
    max: '0.36',
  },
  VelocityEastwardSurface: {
    min: '-0.53',
    max: '0.63',
  },
  VelocityNorthwardBottom: {
    min: '-0.35',
    max: '0.39',
  },
  VelocityNorthwardSurface: {
    min: '-0.74',
    max: '0.57',
  },
};

const HALINE_GRADIENT = 'linear-gradient(0.25turn, #2a186e, #125e8e, #3c9486, #80cd64, #fbee97)';
const THERMAL_GRADIENT = 'linear-gradient(0.25turn, #032333, #634197, #b5607f, #fa973f, #e7fa5a)';
const SPEED_GRADIENT = 'linear-gradient(0.25turn, #fcfccc, #c5ba4c, #538d1f, #0c5d2e, #172213)';
const AMP_GRADIENT = 'linear-gradient(0.25turn, #f0ebea, #d59d8a, #be5437, #7e0d29, #3d0912)';
const DEEP_GRADIENT = 'linear-gradient(0.25turn, #fdfdcc, #61bea3, #46889c, #41417c, #281a2d)';
const GRAY_GRADIENT = 'linear-gradient(0.25turn, #000000, #fcfbfa)';

const VARIABLE_GRADIENTS: Record<OsomExplorerVariable, string> = {
  SalinityBottom: HALINE_GRADIENT,
  SalinitySurface: HALINE_GRADIENT,
  WaterTempBottom: THERMAL_GRADIENT,
  WaterTempSurface: THERMAL_GRADIENT,
  SurfaceHeight: DEEP_GRADIENT,
  VelocityEastwardBottom: SPEED_GRADIENT,
  VelocityEastwardSurface: SPEED_GRADIENT,
  VelocityNorthwardBottom: SPEED_GRADIENT,
  VelocityNorthwardSurface: SPEED_GRADIENT,
  KineticEnergyBottom: AMP_GRADIENT,
  KineticEnergySurface: AMP_GRADIENT,
};

const AUTOPLAY_SPEED_MS = 2000;

const OSOM_BOUNDS: LngLatBoundsLike = [
  [-72.7, 41.9],
  [-69.96, 40.5],
];

export function OsomExporerMap({
  dataset: initialDataset = 'monthly_avg',
  variable: initialVariable = 'WaterTempSurface',
  timepoint: initalTimepoint = 0,
}: OsomExplorerMapProps) {
  const { map, loaded, containerRef } = useMap(OSOM_BOUNDS);
  const [dataset, setDataset] = React.useState<OsomExplorerDataset>(initialDataset);
  const [variable, setVariable] = React.useState<OsomExplorerVariable>(initialVariable);
  const [timepoint, setTimepoint] = React.useState(initalTimepoint);
  const [autoplay, setAutoplay] = React.useState(false);

  React.useEffect(() => {
    // Sync visualization state with URL params
    const url = new URL(window.location.href);
    url.searchParams.set('dataset', dataset);
    url.searchParams.set('var', variable);
    url.searchParams.set('index', timepoint.toString());
    window.history.replaceState({}, '', url);
  }, [dataset, variable, timepoint]);

  const timepoints = TIMEPOINTS;

  const incrementIndex = React.useCallback(() => {
    setTimepoint((current) => (current + 1 >= timepoints.length ? 0 : current + 1));
  }, [setTimepoint, timepoints]);

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
              visibility: index === timepoint ? 'visible' : 'none',
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
      map.current.setLayoutProperty(`osom-raster-${timepoint}`, 'visibility', 'visible');
    }
  }, [timepoints, timepoint]);

  return (
    <>
      <section className="full-bleed w-full min-h-[75vh] md:min-h-[80vh] relative p-0 my-0">
        <div ref={containerRef} className="absolute w-full h-full" />
        <div className="flex flex-col gap-2 absolute top-[3%] left-3 md:top-[8%] md:left-8 bg-white/90 dark:bg-slate-800/90 p-4 rounded-md w-72">
          <Header size="sm" tag="h3" variant="impact">
            {VARIABLE_OPTS.find(({ value }) => variable === value)?.label}
            <br />
          </Header>
          <span>{formatTimepointString(timepoints[timepoint], dataset)}</span>
          <div className="flex flex-row gap-2 items-center">
            <span>
              {VARIABLE_BOUNDS[variable].min} {VARIABLE_UNITS[variable]}
            </span>
            <div
              className="flex-1 h-4 rounded-md"
              style={{
                backgroundImage: VARIABLE_GRADIENTS[variable] || GRAY_GRADIENT,
              }}
            ></div>
            <span>
              {VARIABLE_BOUNDS[variable].max} {VARIABLE_UNITS[variable]}
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
            value={timepoint}
            onChange={(e) => {
              e.preventDefault();
              setTimepoint(Number(e.target.value));
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
            const selectedDataset = e as { value: OsomExplorerDataset; label: string };
            setDataset(selectedDataset.value);
          }}
        />
        <Select
          label="Model Variable"
          options={VARIABLE_OPTS}
          defaultValue={VARIABLE_OPTS[0]}
          value={VARIABLE_OPTS.find(({ value }) => value === variable)}
          onChange={(e) => {
            const selectedVariable = e as { value: OsomExplorerVariable; label: string };
            setVariable(selectedVariable.value);
          }}
        />
      </div>
    </>
  );
}

const TIMEPOINTS = eachMonthOfInterval({
  start: new Date(2004, 12, 1),
  end: new Date(2023, 1, 1),
}).map((date) => format(date, 'yyyy-MM-dd'));

const ANNUAL_RASTER_URL =
  'https://qa-tile-server.riddc.brown.edu/services/monthly_avg_<VARIABLE>_<TIMEPOINT>/tiles/{z}/{x}/{y}.png';

function getRasterUrl(
  dataset: OsomExplorerDataset,
  timepoint: number,
  variable: OsomExplorerVariable
) {
  const timepoints = TIMEPOINTS; //dataset === 'annual-jan' ? TIMEPOITS_ANNUAL_JAN : TIMEPOITS_ANNUAL_JUL;
  const urlTemplate = ANNUAL_RASTER_URL;
  const boundedTimepoint =
    timepoint < 0 ? 0 : timepoint >= timepoints.length ? timepoints.length - 1 : timepoint;
  return urlTemplate
    .replace('<TIMEPOINT>', TIMEPOINTS[boundedTimepoint])
    .replace('<VARIABLE>', variable);
}

function formatTimepointString(timepoint: string, dataset: OsomExplorerDataset): string {
  if (dataset === 'monthly_avg') {
    return format(new Date(timepoint), 'MMMM yyyy');
  }
  return timepoint;
}
