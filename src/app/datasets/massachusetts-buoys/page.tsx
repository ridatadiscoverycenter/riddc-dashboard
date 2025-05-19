import React from 'react';

import {
  BuoyPageSkeleton,
  DefaultBuoyPage,
  ExploreForm,
  ExternalLink,
  MaBuoySummary,
  BuoyVariablesCard,
  BuoyLocationsMap,
} from '@/components';
import { fetchWeatherData } from '@/utils/data';
import {
  fetchMaBuoyCoordinates,
  fetchMaBuoyData,
  fetchMaSummaryData,
  MaBuoyViewerVariable,
} from '@/utils/data/api/buoy';
import {
  ERROR_CODES,
  extractParams,
  fetchMulti,
  makeCommaSepList,
  parseParamBuoyIds,
  parseParamBuoyVariablesMA,
  parseParamDate,
} from '@/utils/fns';

import { PageProps } from '@/types';

export default async function MassachusettsBuoyData({ searchParams }: PageProps) {
  return (
    <React.Suspense fallback={<DefaultBuoyPage description={DESCRIPTION} />}>
      <PageWrapper params={searchParams} errorLinks={MA_BUOY_ERROR_LINKS} />
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
    buoyData: fetchMaBuoyCoordinates(),
    summaryData: fetchMaSummaryData(),
  });

  const paramsOrError = extractParams(
    {
      buoys: parseParamBuoyIds(params ? params['buoys'] : undefined),
      vars: parseParamBuoyVariablesMA(params ? params['vars'] : undefined),
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
            fetchMaBuoyData(ids, vars as MaBuoyViewerVariable[], start, end)
          }
          region="ma"
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
          location="ma"
          dateBounds={{
            startDate: new Date('2017-05-26'),
            endDate: new Date('2018-1-09'),
          }}
          init={typeof paramsOrError === 'string' ? undefined : paramsOrError}
        />
      }
      map={<BuoyLocationsMap locations={buoyData} />}
      summary={<MaBuoySummary data={summaryData} />}
      description={DESCRIPTION}
    />
  );
}

const MA_BUOY_ERROR_LINKS = [
  {
    href: '/datasets/massachusetts-buoys?buoys=bid101&vars=ChlorophyllSurface,ChlorophyllBottom&start=2017-06-01&end=2017-06-30',
    description: 'Changes in Chlorophyll at Cole in June 2017',
  },
  {
    href: '/datasets/massachusetts-buoys?buoys=bid102&vars=SalinityBottom,SalinitySurface&start=2018-05-01&end=2018-11-01',
    description: 'Changes in Salinity at Taunton from May through October 2018',
  },
];

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

const DESCRIPTION = (
  <p>
    This dataset spans from 2017 to 2018 and was collected by the <LINKS.NBFSMN /> with{' '}
    <LINKS.MassDEP /> as the lead agency. The heatmap above summarizes the number of observations
    collected for each month for different variables. Use this heatmap to help you decide what data
    you want to visualize or download. When you have an idea, go ahead and select the buoys,
    variables and dates to explore. Or download the data in the most appropriate format for your
    analyses! To begin, select a variable to see what data is available.
  </p>
);
