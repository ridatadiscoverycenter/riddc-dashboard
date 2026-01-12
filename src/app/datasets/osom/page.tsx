import React from 'react';

import {
  BuoyPageSkeleton,
  // DefaultBuoyPage,
  ExploreForm,
  ExternalLink,
  BuoyVariablesCard,
  BuoyLocationsMap,
  OsomBuoySummary,
} from '@/components';
import { DefaultBuoyPage } from '@/components/PageSkeletons/BuoyPageSkeleton';
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

export default async function Osom(props: PageProps) {
  const searchParams = await props.searchParams;
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
            startDate: new Date('2006-01-01'),
            endDate: new Date('2020-01-02'),
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
    href: '/datasets/osom?buoys=bid102,bid13&vars=SalinitySurface&start=2019-12-25&end=2020-01-01',
    description:
      'Predicted surface salinity in Taunton and Phillipsdale between late 2019 and early 2020',
  },
  {
    href: '/datasets/osom?buoys=bid3&vars=WaterTempBottom,WaterTempSurface&start=2006-01-01&end=2007-01-01',
    description: 'Predicted temperature in Conimicut Pt. during 2006',
  },
];

const DESCRIPTION = (
  <p>
    The Ocean State Ocean Model (OSOM), developed in a collaboration between the University of Rhode
    Island and Brown University, is an application of the Regional Ocean Modeling System (ROMS). The
    model spans Rhode Island&apos;s major waterways: Narragansett Bay, Mt. Hope Bay, larger rivers,
    and the Block Island Shelf circulation from Long Island to Nantucket. Data is available by the
    year at 1.5 hour increments. As the model covers the entire Narragansett Bay, data is always
    available at all buoy locations.
  </p>
);
