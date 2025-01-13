import {
  DownloadBuoyData,
  ExternalLink,
  HardRefreshLink,
  RiBuoyVariables,
  WeatherHistory,
} from '@/components';
import { fetchMaBuoyData, MaBuoyCoordinate } from '@/utils/data/api/buoy';
import { fetchWeatherData } from '@/utils/data';
import { makeCommaSepList } from '@/utils/fns';

import { getParams, ERROR_CODES } from '@/utils/fns'; // TO_REVIEW should this be in like @/utils/params

type DataGraphProps = {
  params: ReturnType<typeof getParams>;
  buoys: MaBuoyCoordinate[];
};

export async function DataGraph({ params, buoys }: DataGraphProps) {
  if (typeof params === 'string') {
    return <ErrorPanel err={params} />;
  }
  try {
    const riBuoyData = await fetchMaBuoyData(params.buoys, params.vars, params.start, params.end);
    const weatherData = await fetchWeatherData(params.start, params.end);
    if (riBuoyData.length === 0)
      return <ErrorPanel err="No data is available given the selected parameters." />;
    return (
      <>
        <p className="text-black">
          This plot compares {makeCommaSepList(params.vars)} between{' '}
          {params.start.toLocaleDateString()} and {params.end.toLocaleDateString()} at{' '}
          {makeCommaSepList(
            params.buoys.map(
              (bid) => buoys.find(({ buoyId }) => buoyId === bid)?.stationName || '???'
            )
          )}
          . You can hover over the lines to see more specific data. The weather data below is
          sourced from <ExternalLink href="https://www.rcc-acis.org/">NOAA</ExternalLink>.
        </p>
        <div className="flex-1 flex flex-col justify-start items-start">
          <RiBuoyVariables data={riBuoyData} height={200} />
          <WeatherHistory data={weatherData} height={100} />
        </div>
        {/* <DownloadBuoyData
          variables={params.vars}
          buoys={params.buoys}
          start={params.start}
          end={params.end}
        /> */}
      </>
    );
  } catch (ex) {
    return <ErrorPanel err={(ex as { message: string }).message} />;
  }
}

const EXPLORE_STYLES =
  'no-underline w-full bg-cyan-300 hover:bg-cyan-400 focus:bg-cyan-400 dark:bg-cyan-700 hover:dark:bg-cyan-600 focus:dark:bg-cyan-600 p-2 rounded-md drop-shadow-md hover:drop-shadow-lg focus:drop-shadow-lg';

function ErrorPanel({ err }: { err: string }) {
  return (
    <>
      {err === ERROR_CODES.NO_SEARCH_PARAMS ? (
        <p className="text-black">
          Generate a line plot using the dropdown menus to compare data points from buoys in the
          dataset! Select some buoys, up to four variables, and a time range to start exploring. Or,
          choose one of the examples below.
        </p>
      ) : (
        <div className="w-full rounded-md under p-4 bg-rose-400 dark:bg-rose-600">{err}</div>
      )}
      <p className="text-black">Want some examples?</p>
      <HardRefreshLink
        href="/datasets/massachusetts-buoys?buoys=bid101&vars=ChlorophyllSurface,ChlorophyllBottom&start=2017-06-01&end=2017-06-30"
        className={EXPLORE_STYLES}
      >
        Changes in Chlorophyll at Cole in June 2017
      </HardRefreshLink>

      <HardRefreshLink
        href="/datasets/massachusetts-buoys?buoys=bid102&vars=SalinityBottom,SalinitySurface&start=2018-05-01&end=2018-11-01"
        className={EXPLORE_STYLES}
      >
        Changes in Salinity at Taunton from May through October 2018
      </HardRefreshLink>
    </>
  );
}
