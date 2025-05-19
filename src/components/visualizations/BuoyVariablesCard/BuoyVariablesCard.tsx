'use server';

import React from 'react';

import { BuoyVariables, DataGraph, DownloadBuoyData, GraphErrorPanel } from '@/components';
import type { WeatherData } from '@/utils/data';
import type { MaBuoyData, MaBuoyViewerVariable, RiBuoyData } from '@/utils/data/api/buoy';
import { ERROR_CODES } from '@/utils/fns';
import { PlanktonData } from '@/utils/data/api/buoy/plankton';

type BuoyVariablesProps = {
  params: string | { buoys: string[]; vars: string[]; start: Date; end: Date };
  region: 'ri' | 'ma' | 'plankton';
  errorLinks: { href: string; description: string }[];
  buoyDataFetcher: (
    buoys: string[],
    variables: string[],
    start: Date,
    end: Date
  ) => Promise<RiBuoyData[] | MaBuoyData[] | PlanktonData[]>;
  weatherDataFetcher: (start: Date, end: Date) => Promise<WeatherData[]>;
  description: React.ReactNode;
};

export async function BuoyVariablesCard({
  params,
  region,
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
          variables={params.vars as MaBuoyViewerVariable[]}
          region={region}
          buoys={params.buoys}
          start={params.start}
          end={params.end}
        />
      }
    >
      <BuoyVariables data={buoyData} height={200} />
    </DataGraph>
  );
}
