import { DownloadBuoyData } from '@/components';
import { RiBuoyViewerVariable } from '@/utils/data/api/buoy';

type BuoyGraphProps = {
  description: React.ReactNode;
  variables: RiBuoyViewerVariable[];
  buoys: string[];
  startDate?: Date;
  endDate?: Date;
};

export function DataGraph({
  description,
  variables,
  buoys,
  startDate,
  endDate,
  children,
}: React.PropsWithChildren<BuoyGraphProps>) {
  return (
    <>
      <p className="text-black">{description}</p>
      <div className="flex-1 flex flex-col justify-start items-start">
        {children}
        {/*<RiBuoyVariables data={riBuoyData} height={200} />
        <WeatherHistory data={weatherData} height={100} />*/}
      </div>
      <DownloadBuoyData variables={variables} buoys={buoys} start={startDate} end={endDate} />
    </>
  );
  /*if (typeof params === 'string') {
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
        <div className="flex-1 flex flex-col justify-start items-start">
          <RiBuoyVariables data={riBuoyData} height={200} />
          <WeatherHistory data={weatherData} height={100} />
        </div>
        <DownloadBuoyData
          variables={params.vars}
          buoys={params.buoys}
          start={params.start}
          end={params.end}
        />
      </>
    );
  } catch (ex) {
    return <ErrorPanel err={(ex as { message: string }).message} />;
  }*/
}
