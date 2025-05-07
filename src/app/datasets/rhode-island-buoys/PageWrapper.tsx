import { BuoyPageSkeleton, ExploreForm, ExternalLink } from '@/components';
import { BuoySummary } from '@/components/visualizations/BuoySummary/BuoySummary';
import { BuoyVariablesCard } from '@/components/visualizations/BuoyVariablesCard';
import { BuoyLocations } from '@/components/visualizations/Maps/BuoyLocations';
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
  const buoyData = await fetchRiBuoyCoordinates();
  const parsedBuoyIds = parseParamBuoyIds(params ? params['buoys'] : undefined);
  const parsedVariables = parseParamBuoyVariablesRI(params ? params['vars'] : undefined);
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
    vars: parsedVariables.value as RiBuoyViewerVariable[],
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
            fetchRiBuoyData(ids, vars as RiBuoyViewerVariable[], start, end)
          }
          region="ri"
          weatherDataFetcher={fetchWeatherData}
          description={<CardDescription parsedParams={error || parsedParams} buoyData={buoyData} />}
        />
      }
      form={<ExploreFormWrapper parsed={error || parsedParams} />}
      map={<BuoyLocations fetcher={fetchRiBuoyCoordinates} />}
      summary={<BuoySummary location="ri" fetcher={fetchRiSummaryData} />}
      description={description}
    />
  );
}

function CardDescription({
  parsedParams,
  buoyData,
}: {
  parsedParams: string | { buoys: string[]; vars: string[]; start: Date; end: Date };
  buoyData: Awaited<ReturnType<typeof fetchRiBuoyCoordinates>>;
}) {
  if (typeof parsedParams === 'string') return undefined;
  return (
    <>
      This plot compares {makeCommaSepList(parsedParams.vars)} between{' '}
      {parsedParams.start.toLocaleDateString()} and {parsedParams.end.toLocaleDateString()} at{' '}
      {makeCommaSepList(
        parsedParams.buoys.map(
          (bid) => buoyData.find(({ buoyId }) => buoyId === bid)?.stationName || '???'
        )
      )}
      . You can hover over the lines to see more specific data. The weather data below is sourced
      from <ExternalLink href="https://www.rcc-acis.org/">NOAA</ExternalLink>.
    </>
  );
}

async function ExploreFormWrapper({
  parsed,
}: {
  parsed: string | { buoys: string[]; vars: string[]; start: Date; end: Date };
}) {
  const coordinates = await fetchRiBuoyCoordinates();
  return (
    <ExploreForm
      buoys={coordinates}
      location="ri"
      dateBounds={{
        startDate: new Date('2003-05-22'),
        endDate: new Date('2019-12-31'),
      }}
      init={typeof parsed === 'string' ? undefined : parsed}
    />
  );
}
