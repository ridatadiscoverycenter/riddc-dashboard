import React from 'react';

import {
  BuoyPageSkeleton,
  DefaultBuoyPage,
  ExploreForm,
  ExternalLink,
  RiBuoySummary,
  BuoyVariablesCard,
  BuoyLocationsMap,
} from '@/components';
import { PageProps } from '@/types';
import { fetchWeatherData } from '@/utils/data';
import {
  fetchRiBuoyCoordinates,
  fetchRiBuoyData,
  fetchRiSummaryData,
  type RiBuoyVariable,
} from '@/utils/data/api/buoy';
import {
  ERROR_CODES,
  extractParams,
  fetchMulti,
  makeCommaSepList,
  parseParamBuoyIds,
  parseParamBuoyVariablesRI,
  parseParamDate,
} from '@/utils/fns';

export default async function RhodeIslandBuoyData(props: PageProps) {
  const searchParams = await props.searchParams;
  return (
    <React.Suspense fallback={<DefaultBuoyPage description={DESCRIPTION} />}>
      <PageWrapper params={searchParams} errorLinks={RI_BUOY_ERROR_LINKS} />
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
    buoyData: fetchRiBuoyCoordinates(),
    summaryData: fetchRiSummaryData(),
  });

  const paramsOrError = extractParams(
    {
      buoys: parseParamBuoyIds(params ? params['buoys'] : undefined),
      vars: parseParamBuoyVariablesRI(params ? params['vars'] : undefined),
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
            fetchRiBuoyData(ids, vars as RiBuoyVariable[], start, end)
          }
          dataset="ri"
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
          dataset="ri"
          dateBounds={{
            startDate: new Date('2003-05-22'),
            endDate: new Date('2022-12-31'),
          }}
          init={typeof paramsOrError === 'string' ? undefined : paramsOrError}
        />
      }
      map={<BuoyLocationsMap locations={buoyData} />}
      summary={<RiBuoySummary data={summaryData} />}
      description={DESCRIPTION}
    />
  );
}

const RI_BUOY_ERROR_LINKS = [
  {
    href: '/datasets/rhode-island-buoys?buoys=bid2,bid3&vars=WaterTempBottom,WaterTempSurface&start=2010-01-22&end=2011-01-22',
    description: 'Changes in Water Temperature at N. Prudence and Conimicut Pt. from 2010 - 2011',
  },
  {
    href: '/datasets/rhode-island-buoys?buoys=bid15,bid17&vars=DepthBottom,depth&start=2008-01-22&end=2009-01-22',
    description: 'Changes in Depth at Greenwich Bay and GSO Dock from 2008 - 2009',
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
    This dataset spans from 2003 to 2022 and was collected by the <LINKS.NBFSMN /> with{' '}
    <LINKS.RIDEM_OWR /> as the lead agency. Agencies involved in collection and maintenance of the
    data are:
    <LINKS.RIDEM_OWR />, <LINKS.URI_GSO_MERL />
    , <LINKS.NBC />, <LINKS.NBNERR />, and <LINKS.MASS_DEP />. The heatmap below summarizes the
    number of observations collected for each month for different variables. Use this heatmap to
    help you decide what data you want to visualize or download. When you have an idea, go ahead and
    select the buoys, variables and dates to explore. Or download the data in the most appropriate
    format for your analyses! To begin, select a variable to see what data is available.
  </p>
);
