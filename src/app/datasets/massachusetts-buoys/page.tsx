import {
  ExploreForm,
  ExternalLink,
  RiBuoyLocations,
  MaBuoySummary,
  BuoyPageSkeleton,
  DataGraph,
  GraphErrorPanel,
  BuoyVariables,
  DownloadBuoyData,
} from '@/components';
import { PageProps } from '@/types';
import { fetchWeatherData } from '@/utils/data';
import { fetchMaSummaryData, fetchMaBuoyCoordinates, fetchMaBuoyData } from '@/utils/data/api/buoy';
import { makeCommaSepList } from '@/utils/fns';
import { ERROR_CODES, getParams } from '@/utils/fns/getParams';

export default async function MassachusettsBuoyData({ searchParams }: PageProps) {
  const parsed = getParams(searchParams, 'ma');
  const buoyData = await fetchMaSummaryData();
  const buoyCoords = await fetchMaBuoyCoordinates();

  let graphBlock: React.ReactNode;
  if (typeof parsed === 'string') {
    graphBlock = (
      <GraphErrorPanel
        error={parsed === ERROR_CODES.NO_SEARCH_PARAMS ? undefined : parsed}
        links={MA_BUOY_ERROR_LINKS}
      />
    );
  } else {
    const maBuoyData = await fetchMaBuoyData(parsed.buoys, parsed.vars, parsed.start, parsed.end);
    const weatherData = await fetchWeatherData(parsed.start, parsed.end);
    if (maBuoyData.length === 0) {
      graphBlock = (
        <GraphErrorPanel
          error="No data is available given the selected parameters."
          links={MA_BUOY_ERROR_LINKS}
        />
      );
    } else {
      graphBlock = (
        <DataGraph
          description={
            <p className="text-black">
              This plot compares {makeCommaSepList(parsed.vars)} between{' '}
              {parsed.start.toLocaleDateString()} and {parsed.end.toLocaleDateString()} at{' '}
              {makeCommaSepList(
                parsed.buoys.map(
                  (bid) => buoyCoords.find(({ buoyId }) => buoyId === bid)?.stationName || '???'
                )
              )}
              . You can hover over the lines to see more specific data. The weather data below is
              sourced from <ExternalLink href="https://www.rcc-acis.org/">NOAA</ExternalLink>.
            </p>
          }
          weather={weatherData}
          download={
            <DownloadBuoyData
              variables={parsed.vars}
              region="ma"
              buoys={parsed.buoys}
              start={parsed.start}
              end={parsed.end}
            />
          }
        >
          <BuoyVariables data={maBuoyData} height={200} />
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
          location="ma"
          dateBounds={{
            startDate: new Date('2017-05-26'),
            endDate: new Date('2018-1-09'),
          }}
          init={typeof parsed === 'string' ? undefined : parsed}
        />
      }
      map={<RiBuoyLocations locations={buoyCoords} />}
      summary={<MaBuoySummary data={buoyData} />}
      description={
        <p>
          This dataset spans from 2017 to 2018 and was collected by the <LINKS.NBFSMN /> with{' '}
          <LINKS.MassDEP /> as the lead agency. The heatmap above summarizes the number of
          observations collected for each month for different variables. Use this heatmap to help
          you decide what data you want to visualize or download. When you have an idea, go ahead
          and select the buoys, variables and dates to explore. Or download the data in the most
          appropriate format for your analyses! To begin, select a variable to see what data is
          available.
        </p>
      }
    />
  );
}

const MA_BUOY_ERROR_LINKS = [
  {
    href: '/datasets/massachusetts-buoys?buoys=bid101&vars=ChlorophyllSurface,ChlorophyllBottom&start=2017-06-01&end=2017-06-30',
    description: 'Changes in Chlorophyll at Cole in June 2017',
  },
  {
    href: '/datasets/massachusetts-buoys?buoys=bid102&vars=SalinityBottom,SalinitySurface&start=2018-05-01&end=2018-11-01',
    description: 'Changes in Salinity at Taunton from May through October 2018',
  },
];

const LINKS = {
  NBFSMN: () => (
    <ExternalLink href="https://dem.ri.gov/environmental-protection-bureau/water-resources/research-monitoring/narraganset-bay-assessment-fixed-site-monitoring">
      Narragansett Bay Fixed Station Monitoring Network (NBFSMN)
    </ExternalLink>
  ),
  MassDEP: () => (
    <ExternalLink href="https://www.mass.gov/orgs/massachusetts-department-of-environmental-protections">
      RIDEM-OWR
    </ExternalLink>
  ),
};
