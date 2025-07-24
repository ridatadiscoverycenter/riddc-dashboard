import { subDays, subMonths } from 'date-fns';
import {
  fetchRealTimeBuoyCoordinates,
  fetchRealTimeBuoyData,
  fetchRealTimeSummaryData,
  type RealTimeBuoyVariable,
} from '@/utils/data/api/buoy';
import {
  ERROR_CODES,
  extractParams,
  fetchMulti,
  parseParamBuoyIds,
  parseParamBuoyVariablesRT,
  parseParamDate,
} from '@/utils/fns';
import {
  BuoyLocationsMap,
  BuoyPageSkeleton,
  BuoyVariablesCard,
  ExploreForm,
  ExternalLink,
  RealTimeBuoySummary,
} from '@/components';
import { fetchWeatherData } from '@/utils/data';
import { PageProps } from '@/types';
import { ERDDAP_URL } from '@/static/urls';

export default async function RealTime({ searchParams }: PageProps) {
  const { summaryData, coordinates } = await fetchMulti({
    summaryData: fetchRealTimeSummaryData(),
    coordinates: fetchRealTimeBuoyCoordinates(),
  });

  const timeRange = summaryData.map(({ time }) => time.valueOf());

  const paramsOrError = extractParams(
    {
      buoys: parseParamBuoyIds(searchParams ? searchParams['buoys'] : undefined),
      vars: parseParamBuoyVariablesRT(searchParams ? searchParams['vars'] : undefined),
      start: parseParamDate(searchParams ? searchParams['start'] : undefined, 'start'),
      end: parseParamDate(searchParams ? searchParams['end'] : undefined, 'end'),
    },
    [
      ERROR_CODES.NO_BUOYS,
      ERROR_CODES.NO_VARS,
      ERROR_CODES.MISSING_START_DATE,
      ERROR_CODES.MISSING_END_DATE,
    ]
  );

  return (
    <>
      <p className="mt-6">
        The real time buoys are currently undergoing maintenance, and have not reported data since
        December 2024. Data will appear here as soon as they are re-deployed.
      </p>
      <BuoyPageSkeleton
        graph={
          <BuoyVariablesCard
            params={paramsOrError}
            dataset="real-time"
            errorLinks={[
              {
                description: 'Changes in Phosphate and Nitrate levels over the last month',
                href: `/datasets/real-time?buoys=Buoy-620,Buoy-720&vars=PhosphateSurface,NitrateNSurface&end=${new Date().toISOString().split('T')[0]}&start=${subMonths(new Date(), 1).toISOString().split('T')[0]}`,
              },
              {
                description: 'Changes in dissolved oxygen and salinity levels over the two months',
                href: `/datasets/real-time?buoys=Buoy-620,Buoy-720&vars=O2Surface,SalinitySurface&end=${new Date().toISOString().split('T')[0]}&start=${subMonths(new Date(), 2).toISOString().split('T')[0]}`,
              },
              {
                description:
                  'Changes in dissolved oxygen and nitrate levels over the last three months',
                href: `/datasets/real-time?buoys=Buoy-620,Buoy-720&vars=O2Surface,NitrateNSurface&end=${new Date().toISOString().split('T')[0]}&start=${subMonths(new Date(), 3).toISOString().split('T')[0]}`,
              },
            ]}
            buoyDataFetcher={(ids, vars, start, end) =>
              fetchRealTimeBuoyData(ids, vars as RealTimeBuoyVariable[], start, end)
            }
            weatherDataFetcher={fetchWeatherData}
            description={undefined}
          />
        }
        form={
          <ExploreForm
            buoys={coordinates}
            dataset="real-time"
            dateBounds={{
              startDate: new Date(Math.min(...timeRange) || subDays(new Date(), 360).valueOf()),
              endDate: new Date(Math.max(...timeRange) || subDays(new Date(), 180).valueOf()),
            }}
          />
        }
        map={<BuoyLocationsMap locations={coordinates} />}
        summary={<RealTimeBuoySummary data={summaryData} />}
        description={
          <div className="w-full flex flex-col gap-2 my-2">
            <p>
              Learn more about the{' '}
              <ExternalLink href="https://web.uri.edu/rinsfepscor/research/">
                NSF-funded RI-C-AIM program
              </ExternalLink>
              .
            </p>
            <p>
              The full dataset used to power this app is available on{' '}
              <ExternalLink
                href={`${ERDDAP_URL}/erddap/search/index.html?page=1&itemsPerPage=1000&searchFor=Buoy+Telemetry`}
              >
                ERDDAP
              </ExternalLink>
              .
            </p>
            <p>
              Additional information about the data variables and QC tests can be found in the{' '}
              <ExternalLink
                href={`${ERDDAP_URL}/erddap/info/buoy_telemetry_0ffe_2dc0_916e/index.html`}
              >
                ERDDAP dataset info page
              </ExternalLink>
              .
            </p>
            <iframe
              width="100%"
              height="500"
              src="https://www.youtube.com/embed/uPXvtlrC7Rs?si=trr7Ib1JQbCTevXk"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        }
      />
    </>
  );
}
