'use server';

import React from 'react';

import { GraphErrorPanel, WaterTempChart } from '@/components';
import { ERROR_CODES } from '@/utils/fns';
import { Sample, Temperature } from '@/types';
import { FishLineChart } from '../Vega/FishLineChart';

type FishVariablesProps = {
  params: string | { buoys: string[]; vars: string[]; start: Date; end: Date };
  errorLinks: { href: string; description: string }[];
  data: Sample[];
  weatherData: Temperature[];
  description: React.ReactNode;
};

export async function FishVariablesCard({
  params,
  errorLinks,
  data,
  weatherData,
  description,
}: FishVariablesProps) {
  if (typeof params === 'string') {
    return (
      <GraphErrorPanel
        error={params === ERROR_CODES.NO_SEARCH_PARAMS ? undefined : params}
        links={errorLinks}
      />
    );
  }
  const startYear = params.start.getFullYear();
  const endYear = params.end.getFullYear();
  const fishData = data.filter(
    (sample) =>
      sample.year >= startYear &&
      sample.year <= endYear &&
      params.vars.includes(sample.title) &&
      params.buoys.includes(sample.station)
  );
  if (fishData.length === 0) {
    return (
      <GraphErrorPanel
        error="No data is available given the selected parameters."
        links={errorLinks}
      />
    );
  }
  // console.log(
  //   weatherData.filter(
  //     (sample) =>
  //       sample.year >= startYear &&
  //       sample.year <= endYear &&
  //       sample.level === 'Surface' &&
  //       params.buoys.includes(sample.station)
  //   )[168]
  // );
  console.log(fishData[239]);
  console.log(weatherData[2823]);

  return (
    <>
      <p className="text-black">{description}</p>
      <div className="flex-1 flex flex-col justify-start items-start">
        <FishLineChart data={fishData} />
        <WaterTempChart
          data={weatherData.filter(
            (sample) =>
              sample.year >= startYear &&
              sample.year <= endYear &&
              sample.level === 'Surface' &&
              params.buoys.includes(sample.station)
          )}
        />
      </div>
    </>
  );
}
