import {
  BuoyPageSkeleton,
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
  RiBuoyViewerVariable,
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

type PageWrapperProps = {
  description: React.ReactNode;
  params: PageProps['searchParams'];
  errorLinks: { href: string; description: string }[];
};

export async function PageWrapper({ description, params, errorLinks }: PageWrapperProps) {
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
            fetchRiBuoyData(ids, vars as RiBuoyViewerVariable[], start, end)
          }
          region="ri"
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
          location="ri"
          dateBounds={{
            startDate: new Date('2003-05-22'),
            endDate: new Date('2019-12-31'),
          }}
          init={typeof paramsOrError === 'string' ? undefined : paramsOrError}
        />
      }
      map={<BuoyLocationsMap locations={buoyData} />}
      summary={<RiBuoySummary data={summaryData} />}
      description={description}
    />
  );
}
