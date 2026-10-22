'use client';

import React from 'react';
import {
  AUTOPLAY_SPEED_MS,
  DATASET_OPTS,
  GRAY_GRADIENT,
  OSOM_BOUNDS,
  TIMEPOINTS_HURRICANE_IRENE,
  TIMEPOINTS_MONTHLY_AVG,
  VARIABLE_BOUNDS_IRENE,
  VARIABLE_BOUNDS_MONTHLY_AVG,
  VARIABLE_GRADIENTS,
  VARIABLE_OPTS,
  VARIABLE_UNITS,
} from './constants';
import { formatTimepointString, getRasterUrl, updateUrlParams } from './utils';
import { useMap } from '@/components/visualizations/Maps';
import { Header, Input, Label, Select } from '@/components';
import { useInterval } from '@/hooks/useInterval';

import { OsomExplorerVariable, OsomExplorerDataset } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';

type OsomExplorerMapProps = {
  dataset: OsomExplorerDataset;
  variable: OsomExplorerVariable;
  timepoint: number;
};

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

  // Note(AM): On Safari, an error is thrown if more than 100 calls to
  // update the URL are made in 10 seconds. Debouncing this ensures that
  // the URL is kept in sync with the visualization and also that the
  // visualization doesn't crash on Safari.
  const updateUrlDebounce = useDebounce(
    (newDataset: OsomExplorerDataset, newVariable: OsomExplorerVariable, newTimepoint: number) =>
      updateUrlParams(newDataset, newVariable, newTimepoint)
  );

  React.useEffect(() => {
    updateUrlDebounce(dataset, variable, timepoint);
  }, [dataset, variable, timepoint]);

  const timepoints = React.useMemo(
    () => (dataset === 'monthly_avg' ? TIMEPOINTS_MONTHLY_AVG : TIMEPOINTS_HURRICANE_IRENE),
    [dataset]
  );

  const variableBounds = React.useMemo(
    () => (dataset === 'monthly_avg' ? VARIABLE_BOUNDS_MONTHLY_AVG : VARIABLE_BOUNDS_IRENE),
    [dataset]
  );

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
        <div ref={containerRef} className="w-full h-full" style={{ position: 'absolute' }} />
        <div className="flex flex-col gap-2 absolute top-[3%] left-3 md:top-[8%] md:left-8 bg-white/90 dark:bg-slate-800/90 p-4 rounded-md w-72">
          <Header size="sm" tag="h3" variant="impact">
            {VARIABLE_OPTS.find(({ value }) => variable === value)?.label}
            <br />
          </Header>
          <span>{formatTimepointString(timepoints[timepoint], dataset)}</span>
          <div className="flex flex-row gap-2 items-center">
            <span>
              {variableBounds[variable].min} {VARIABLE_UNITS[variable]}
            </span>
            <div
              className="flex-1 h-4 rounded-md"
              style={{
                backgroundImage: VARIABLE_GRADIENTS[variable] || GRAY_GRADIENT,
              }}
            ></div>
            <span>
              {variableBounds[variable].max} {VARIABLE_UNITS[variable]}
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
            setTimepoint(0);
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
