import {
  GraphErrorPanel,
  DataGraph,
  ExternalLink,
  DownloadBuoyData,
  BuoyVariables,
  BuoyPageSkeleton,
  ExploreForm,
  RiBuoyLocations,
} from '@/components';
import { PlanktonSummary } from '@/components/visualizations/Vega/PlanktonSummary';
import type { PageProps } from '@/types';
import { fetchWeatherData } from '@/utils/data';
import { fetchBuoyTimeRange } from '@/utils/data/api/buoy';
import {
  fetchPlanktonCoordinates,
  fetchPlanktonData,
  fetchPlanktonSummary,
} from '@/utils/data/api/buoy/plankton';
import { ERROR_CODES, getPlanktonParams, makeCommaSepList } from '@/utils/fns';

export default async function Plankton({ searchParams }: PageProps) {
  const parsed = getPlanktonParams(searchParams);
  const buoyCoords = await fetchPlanktonCoordinates();
  const data = await fetchPlanktonSummary();

  let graphBlock: React.ReactNode;
  if (typeof parsed === 'string') {
    graphBlock = (
      <GraphErrorPanel
        error={parsed === ERROR_CODES.NO_SEARCH_PARAMS ? undefined : parsed}
        links={ERROR_LINKS}
      ></GraphErrorPanel>
    );
  } else {
    const planktonData = await fetchPlanktonData(
      parsed.buoys,
      parsed.vars,
      parsed.start,
      parsed.end
    );
    const weatherData = await fetchWeatherData(parsed.start, parsed.end);

    if (planktonData.length === 0) {
      graphBlock = (
        <GraphErrorPanel
          error="No data is available given the selected parameters."
          links={ERROR_LINKS}
        />
      );
    } else {
      graphBlock = (
        <DataGraph
          description={
            <>
              This plot compares {makeCommaSepList(parsed.vars)} between{' '}
              {parsed.start.toLocaleDateString()} and {parsed.end.toLocaleDateString()} at{' '}
              {makeCommaSepList(
                parsed.buoys.map(
                  (bid) => data.find(({ buoyId }) => buoyId === bid)?.stationName || '???'
                )
              )}
              . You can hover over the lines to see more specific data. The weather data below is
              sourced from <ExternalLink href="https://www.rcc-acis.org/">NOAA</ExternalLink>.
            </>
          }
          weather={weatherData}
          download={
            <DownloadBuoyData
              variables={parsed.vars}
              region="plankton"
              buoys={parsed.buoys}
              start={parsed.start}
              end={parsed.end}
            />
          }
        >
          <BuoyVariables data={planktonData} height={200} />
        </DataGraph>
      );
    }
  }
  return (
    <BuoyPageSkeleton
      graph={graphBlock}
      form={
        <ExploreForm
          buoys={buoyCoords}
          location="plankton"
          dateBounds={{
            startDate: new Date('2003-05-22'),
            endDate: new Date('2019-12-31'),
          }}
          init={typeof parsed === 'string' ? undefined : parsed}
        />
      }
      map={<RiBuoyLocations locations={buoyCoords} />}
      summary={<PlanktonSummary data={data} />}
      description={
        <p>
          {/* This dataset spans from 2003 to 2019 and was collected by the <LINKS.NBFSMN /> with{' '}
          <LINKS.RIDEM_OWR /> as the lead agency. Agencies involved in collection and maintenance of
          the data are:
          <LINKS.RIDEM_OWR />, <LINKS.URI_GSO_MERL />
          , <LINKS.NBC />, <LINKS.NBNERR />, and <LINKS.MASS_DEP />. The heatmap below summarizes
          the number of observations collected for each month for different variables. Use this
          heatmap to help you decide what data you want to visualize or download. When you have an
          idea, go ahead and select the buoys, variables and dates to explore. Or download the data
          in the most appropriate format for your analyses! To begin, select a variable to see what
          data is available. */}
        </p>
      }
    />
  );
}
// TODO put real links here
const ERROR_LINKS = [
  {
    href: '/datasets/plankton?buoys=bid21&vars=WaterTempSurface,WaterTempBottom&start=2017-01-01&end=2018-12-31',
    description: 'Changes in Water Temperature from 2017-2018',
  },
];
