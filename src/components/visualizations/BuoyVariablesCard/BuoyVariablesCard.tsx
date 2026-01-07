'use server';

import React from 'react';

import { DataGraph, GraphErrorPanel } from '@/components';
import { DownloadBuoyData } from '@/components/DownloadBuoyData/DownloadBuoyData';
import { BuoyVariables } from '@/components/visualizations/BuoyVariables';
import type { WeatherData } from '@/utils/data';
import type {
  MaBuoyData,
  MaBuoyVariable,
  RealTimeBuoyData,
  RiBuoyData,
  PlanktonData,
  OsomBuoyData,
} from '@/utils/data/api/buoy';
import { ERROR_CODES } from '@/utils/fns';
import type { Dataset } from '@/utils/data/api/buoy/types';

type BuoyVariablesProps = {
  params: string | { buoys: string[]; vars: string[]; start: Date; end: Date };
  dataset: Dataset;
  errorLinks: { href: string; description: string }[];
  buoyDataFetcher: (
    buoys: string[],
    variables: string[],
    start: Date,
    end: Date
  ) => Promise<RiBuoyData[] | MaBuoyData[] | RealTimeBuoyData[] | PlanktonData[] | OsomBuoyData[]>;
  weatherDataFetcher: (start: Date, end: Date) => Promise<WeatherData[]>;
  description: React.ReactNode;
};

export async function BuoyVariablesCard({
  params,
  dataset,
  errorLinks,
  buoyDataFetcher,
  weatherDataFetcher,
  description,
}: BuoyVariablesProps) {
  // If params parsed found no params or returned an error,
  // display error in place of visualization.
  if (typeof params === 'string') {
    return (
      <GraphErrorPanel
        error={params === ERROR_CODES.NO_SEARCH_PARAMS ? undefined : params}
        links={errorLinks}
      />
    );
  }

  const buoyData = await buoyDataFetcher(params.buoys, params.vars, params.start, params.end);
  // If no data was found, display an error.
  if (buoyData.length === 0) {
    return (
      <GraphErrorPanel
        error="No data is available given the selected parameters."
        links={errorLinks}
      />
    );
  }

  const weatherData = await weatherDataFetcher(params.start, params.end);
  return (
    <DataGraph
      description={description}
      weather={weatherData}
      download={
        <DownloadBuoyData
          variables={params.vars as MaBuoyVariable[]}
          dataset={dataset}
          buoys={params.buoys}
          start={params.start}
          end={params.end}
        />
      }
    >
      <BuoyVariables data={buoyData} dataset={dataset} />
    </DataGraph>
  );
}
