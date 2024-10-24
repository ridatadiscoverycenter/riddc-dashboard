import { RiBuoyVariables, WeatherHistory } from '@/components/visualizations';
import { PageProps } from '@/types';
import { fetchRiBuoyData } from '@/utils/erddap/api/buoy';
import { fetchWeatherData } from '@/utils/weather';

function parseSearchParams(searchParams: PageProps["searchParams"]) {
  const failcase = new Error("Looks like something went wrong!");
  if (searchParams === undefined) throw failcase;
  // const ids = searchParams["ids"];
  // const variables = searchParams["variables"];
  const startDateParam = searchParams["start"];
  const endDateParam = searchParams["end"];
  if (startDateParam instanceof Array || endDateParam instanceof Array) throw failcase;
  if (startDateParam !== undefined && endDateParam !== undefined) {
    const start = new Date(startDateParam);
    if (isNaN(start.valueOf())) throw failcase;
    const end = new Date(endDateParam);
    if (isNaN(end.valueOf())) throw failcase;
    return {
      start,
      end,
    };
  }
  else {
    throw failcase;
  }
}

export default async function RiBuoyExplore({ searchParams }: PageProps) {
  try {
    const { start, end } = parseSearchParams(searchParams);
    const weatherData = await fetchWeatherData(start, end);
    const buoyData = await fetchRiBuoyData(["bid2", "bid3"], ["WaterTempSurface", "WaterTempBottom"], start, end);
    //console.log({ buoyData });
    return (
      <div>
        <p>Rhode Island Buoy Explore</p>
        <RiBuoyVariables data={buoyData} />
        <WeatherHistory data={weatherData} />
        <pre>{JSON.stringify(weatherData, null, 2)}</pre>
      </div>
    );
  }
  catch (ex) {
    const { message } = ex as { message: string }
    console.error(message);
    return (
      <div>
        <p>{message}</p>
      </div>
    )
  }
}
