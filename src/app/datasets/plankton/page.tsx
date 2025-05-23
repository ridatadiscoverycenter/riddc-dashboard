import React from 'react';

import {
  BuoyPageSkeleton,
  DefaultBuoyPage,
  ExploreForm,
  ExternalLink,
  PlanktonSummary,
  BuoyVariablesCard,
  BuoyLocationsMap,
} from '@/components';
import type { PageProps } from '@/types';
import { fetchWeatherData } from '@/utils/data';
import {
  fetchPlanktonCoordinates,
  fetchPlanktonData,
  fetchPlanktonSummary,
  PlanktonVariable,
} from '@/utils/data/api/buoy/plankton';
import {
  ERROR_CODES,
  extractParams,
  fetchMulti,
  makeCommaSepList,
  parseParamBuoyIds,
  parseParamBuoyVariablesPlankton,
  parseParamDate,
} from '@/utils/fns';

export default async function PlanktonBuoyData({ searchParams }: PageProps) {
  return (
    <React.Suspense fallback={<DefaultBuoyPage description={DESCRIPTION} />}>
      <PageWrapper params={searchParams} errorLinks={PLANKTON_ERROR_LINKS} />
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
    buoyData: fetchPlanktonCoordinates(),
    summaryData: fetchPlanktonSummary(),
  });

  const paramsOrError = extractParams(
    {
      buoys: parseParamBuoyIds(params ? params['buoys'] : undefined),
      vars: parseParamBuoyVariablesPlankton(params ? params['vars'] : undefined),
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
            fetchPlanktonData(ids, vars as PlanktonVariable[], start, end)
          }
          dataset="plankton"
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
          dataset="plankton"
          dateBounds={{
            startDate: new Date('2003-05-22'),
            endDate: new Date('2019-12-31'),
          }}
          init={typeof paramsOrError === 'string' ? undefined : paramsOrError}
        />
      }
      map={<BuoyLocationsMap locations={buoyData} />}
      summary={<PlanktonSummary data={summaryData} />}
      description={DESCRIPTION}
    />
  );
}

const PLANKTON_ERROR_LINKS = [
  {
    href: '/datasets/plankton?buoys=bid21&vars=WaterTempSurface,WaterTempBottom&start=2017-01-01&end=2018-12-31',
    description: 'Changes in Water Temperature from 2017-2018',
  },
  {
    href: '/datasets/plankton?buoys=bid21&vars=SilicaBottom,SilicaSurface&start=2003-01-01&end=2009-12-31',
    description: 'Changes in Silica Levels from 2003-2009',
  },
];

const LINKS = {
  NBFSMN: () => (
    <ExternalLink href="https://dem.ri.gov/environmental-protection-bureau/water-resources/research-monitoring/narraganset-bay-assessment-fixed-site-monitoring">
      Narragansett Bay Fixed Station Monitoring Network (NBFSMN)
    </ExternalLink>
  ),
  RIDEM_OWR: () => (
    <ExternalLink href="https://dem.ri.gov/environmental-protection-bureau/water-resources">
      RIDEM-OWR
    </ExternalLink>
  ),
  URI_GSO_MERL: () => (
    <ExternalLink href="https://web.uri.edu/gso/research/marine-ecosystems-research-laboratory">
      URI/GSO MERL
    </ExternalLink>
  ),
  NBC: () => <ExternalLink href="https://www.narrabay.com/">NBC</ExternalLink>,
  NBNERR: () => <ExternalLink href="http://nbnerr.org/">NBNERR</ExternalLink>,
  MASS_DEP: () => (
    <ExternalLink href="https://www.mass.gov/orgs/massachusetts-department-of-environmental-protection">
      MassDEP
    </ExternalLink>
  ),
};

const DESCRIPTION = (
  <p>
    This dataset spans from 2003 to 2019 and was collected by the <LINKS.NBFSMN /> with{' '}
    <LINKS.RIDEM_OWR /> as the lead agency. Agencies involved in collection and maintenance of the
    data are: <LINKS.RIDEM_OWR />, <LINKS.URI_GSO_MERL />
    , <LINKS.NBC />, <LINKS.NBNERR />, and <LINKS.MASS_DEP />. The heatmap below summarizes the
    number of observations collected for each month for different variables. Use this heatmap to
    help you decide what data you want to visualize or download. When you have an idea, go ahead and
    select the buoys, variables and dates to explore. Or download the data in the most appropriate
    format for your analyses! To begin, select a variable to see what data is available.
  </p>
);
