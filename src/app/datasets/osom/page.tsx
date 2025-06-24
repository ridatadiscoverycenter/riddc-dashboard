import React from 'react';

import {
  BuoyPageSkeleton,
  DefaultBuoyPage,
  ExploreForm,
  ExternalLink,
  BuoyVariablesCard,
  BuoyLocationsMap,
  Loading,
  OsomBuoySummary,
} from '@/components';
import { fetchWeatherData } from '@/utils/data';
import {
  fetchOsomBuoyCoordinates,
  fetchOsomBuoyData,
  fetchOsomSummaryData,
  OsomBuoyVariable,
} from '@/utils/data/api/buoy';
import {
  ERROR_CODES,
  extractParams,
  fetchMulti,
  makeCommaSepList,
  parseParamBuoyIds,
  parseParamBuoyVariablesOsom,
  parseParamDate,
} from '@/utils/fns';

import { PageProps } from '@/types';

export default async function Osom({ searchParams }: PageProps) {
  return (
    <React.Suspense fallback={<DefaultBuoyPage description={DESCRIPTION} />}>
      <PageWrapper params={searchParams} errorLinks={OSOM_BUOY_ERROR_LINKS} />
    </React.Suspense>
  );
}

async function PageWrapper({
  params,
  errorLinks,
}: {
  params: PageProps['searchParams'];
  errorLinks: { href: string; description: string }[];
}) {
  const { buoyData, summaryData } = await fetchMulti({
    buoyData: fetchOsomBuoyCoordinates(),
    summaryData: fetchOsomSummaryData(),
  });

  const paramsOrError = extractParams(
    {
      buoys: parseParamBuoyIds(params ? params['buoys'] : undefined),
      vars: parseParamBuoyVariablesOsom(params ? params['vars'] : undefined),
      start: parseParamDate(params ? params['start'] : undefined, 'start'),
      end: parseParamDate(params ? params['end'] : undefined, 'end'),
    },
    [
      ERROR_CODES.NO_BUOYS,
      ERROR_CODES.NO_VARS,
      ERROR_CODES.MISSING_START_DATE,
      ERROR_CODES.MISSING_END_DATE,
    ]
  );

  return (
    <BuoyPageSkeleton
      graph={
        <BuoyVariablesCard
          params={paramsOrError}
          errorLinks={errorLinks}
          buoyDataFetcher={(ids, vars, start, end) =>
            fetchOsomBuoyData(ids, vars as OsomBuoyVariable[], start, end)
          }
          dataset="osom"
          weatherDataFetcher={fetchWeatherData}
          description={
            typeof paramsOrError === 'string' ? undefined : (
              <>
                This plot compares {makeCommaSepList(paramsOrError.vars)} between{' '}
                {paramsOrError.start.toLocaleDateString()} and{' '}
                {paramsOrError.end.toLocaleDateString()} at{' '}
                {makeCommaSepList(
                  paramsOrError.buoys.map(
                    (bid) => buoyData.find(({ buoyId }) => buoyId === bid)?.stationName || '???'
                  )
                )}
                . You can hover over the lines to see more specific data. The weather data below is
                sourced from <ExternalLink href="https://www.rcc-acis.org/">NOAA</ExternalLink>.
              </>
            )
          }
        />
      }
      form={
        <ExploreForm
          buoys={buoyData}
          dataset="osom"
          dateBounds={{
            /* Subject to change? */
            startDate: new Date('2017-05-26'),
            endDate: new Date('2018-1-09'),
          }}
          init={typeof paramsOrError === 'string' ? undefined : paramsOrError}
        />
      }
      map={<BuoyLocationsMap locations={buoyData} />}
      summary={<OsomBuoySummary data={summaryData} />}
      description={DESCRIPTION}
    />
  );
}

const OSOM_BUOY_ERROR_LINKS = [
  {
    href: '/datasets/osom?example=oopsies',
    description: 'Example Link 2!',
  },
  {
    href: '/datasets/osom?example2=oopsies',
    description: 'Example Link 2!',
  },
];

/*
const LINKS = {
  NBFSMN: () => (
    <ExternalLink href="https://dem.ri.gov/environmental-protection-bureau/water-resources/research-monitoring/narraganset-bay-assessment-fixed-site-monitoring">
      Narragansett Bay Fixed Station Monitoring Network (NBFSMN)
    </ExternalLink>
  ),
  MassDEP: () => (
    <ExternalLink href="https://www.mass.gov/orgs/massachusetts-department-of-environmental-protections">
      RIDEM-OWR
    </ExternalLink>
  ),
};
*/

const DESCRIPTION = <p>Put a description here!</p>;
