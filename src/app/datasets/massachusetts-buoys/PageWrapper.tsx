import {
  BuoyPageSkeleton,
  ExploreForm,
  ExternalLink,
  MaBuoySummary,
  BuoyVariablesCard,
  BuoyLocationsMap,
} from '@/components';
import { PageProps } from '@/types';
import { fetchWeatherData } from '@/utils/data';
import {
  fetchMaBuoyCoordinates,
  fetchMaBuoyData,
  fetchMaSummaryData,
  MaBuoyViewerVariable,
} from '@/utils/data/api/buoy';
import {
  ERROR_CODES,
  makeCommaSepList,
  parseParamBuoyIds,
  parseParamBuoyVariablesMA,
  parseParamDate,
} from '@/utils/fns';

type PageWrapperProps = {
  description: React.ReactNode;
  params: PageProps['searchParams'];
  errorLinks: { href: string; description: string }[];
};

async function fetchDatasets(datasets: { [key: string]: Promise<any> }, errorCodes: string[]) {
  Object.entries;
}

export async function PageWrapper({ description, params, errorLinks }: PageWrapperProps) {
  const buoyData = await fetchMaBuoyCoordinates();
  const summaryData = await fetchMaSummaryData();

  const parsedBuoyIds = parseParamBuoyIds(params ? params['buoys'] : undefined);
  const parsedVariables = parseParamBuoyVariablesMA(params ? params['vars'] : undefined);
  const parsedStartDate = parseParamDate(params ? params['start'] : undefined, 'start');
  const parsedEndDate = parseParamDate(params ? params['end'] : undefined, 'end');

  const allErrors = [
    parsedBuoyIds.error,
    parsedVariables.error,
    parsedStartDate.error,
    parsedEndDate.error,
  ].filter((e) => e !== undefined);
  const error =
    allErrors.includes(ERROR_CODES.NO_BUOYS) &&
    allErrors.includes(ERROR_CODES.NO_VARS) &&
    allErrors.includes(ERROR_CODES.MISSING_START_DATE) &&
    allErrors.includes(ERROR_CODES.MISSING_END_DATE)
      ? ERROR_CODES.NO_SEARCH_PARAMS
      : allErrors.pop();
  const parsedParams = {
    buoys: parsedBuoyIds.value as string[],
    vars: parsedVariables.value as MaBuoyViewerVariable[],
    start: parsedStartDate.value as Date,
    end: parsedEndDate.value as Date,
  };

  return (
    <BuoyPageSkeleton
      graph={
        <BuoyVariablesCard
          params={error || parsedParams}
          errorLinks={errorLinks}
          buoyDataFetcher={(ids, vars, start, end) =>
            fetchMaBuoyData(ids, vars as MaBuoyViewerVariable[], start, end)
          }
          region="ma"
          weatherDataFetcher={fetchWeatherData}
          description={
            typeof (error || parsedParams) === 'string' ? undefined : (
              <>
                This plot compares {makeCommaSepList(parsedParams.vars)} between{' '}
                {parsedParams.start.toLocaleDateString()} and{' '}
                {parsedParams.end.toLocaleDateString()} at{' '}
                {makeCommaSepList(
                  parsedParams.buoys.map(
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
          init={typeof (error || parsedParams) === 'string' ? undefined : parsedParams}
        />
      }
      map={<BuoyLocationsMap locations={buoyData} />}
      summary={<MaBuoySummary data={summaryData} />}
      description={description}
    />
  );
}
