import { Button, ExternalLink, Link, RiBuoyVariables, WeatherHistory } from '@/components';
import { fetchRiBuoyData, RiBuoyCoordinate } from '@/utils/erddap/api/buoy';
import { fetchWeatherData } from '@/utils/weather';

import { getParams, ERROR_CODES } from './getParams';

type DataGraphProps = {
  params: ReturnType<typeof getParams>;
  buoys: RiBuoyCoordinate[];
};

function makeCommaSepList(list: string[]) {
  return list.reduce(
    (prev, next, index) =>
      `${prev}${index === 0 ? '' : `${index === list.length - 1 ? '' : ','} `}${index === list.length - 1 ? 'and ' : ''}${next}`,
    ''
  );
}

export async function DataGraph({ params, buoys }: DataGraphProps) {
  if (typeof params === 'string') {
    return <ErrorPanel err={params} />;
  }
  try {
    const riBuoyData = await fetchRiBuoyData(params.buoys, params.vars, params.start, params.end);
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
        <div className='flex-1 flex flex-col justify-start items-start'>
          <RiBuoyVariables data={riBuoyData} height={200} />
          <WeatherHistory data={weatherData} height={100} />
        </div>
        <Button>Download Data</Button>
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
      <Link
        href="/datasets/rhode-island-buoys?buoys=bid2,bid3&vars=temperatureBottom,temperatureSurface&start=2010-01-22&end=2011-01-22"
        className={EXPLORE_STYLES}
      >
        Changes in Water Temperature at N. Prudence and Conimicut Pt. from 2010 - 2011
      </Link>
      <Link
        href="/datasets/rhode-island-buoys?buoys=bid15,bid17&vars=depthBottom,depthSurface&start=2008-01-22&end=2009-01-22"
        className={EXPLORE_STYLES}
      >
        Changes in Depth at Greenwich Bay and GSO Dock from 2008 - 2009
      </Link>
    </>
  );
}
