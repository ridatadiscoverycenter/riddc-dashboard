import {
  BuoyPageSkeleton,
  DataGraph,
  DownloadBuoyData,
  ExploreForm,
  ExternalLink,
  GraphErrorPanel,
  RiBuoyLocations,
  RiBuoySummary,
  BuoyVariables,
} from '@/components';
import { PageProps } from '@/types';
import { fetchRiSummaryData, fetchRiBuoyCoordinates, fetchRiBuoyData } from '@/utils/data/api/buoy';
import { ERROR_CODES, getParams } from '@/utils/fns';
import { fetchWeatherData } from '@/utils/data';

export default async function RhodeIslandBuoyData({ searchParams }: PageProps) {
  const parsed = getParams(searchParams, 'ri');
  const buoyData = await fetchRiSummaryData();
  const buoyCoords = await fetchRiBuoyCoordinates();

  let graphBlock: React.ReactNode;
  if (typeof parsed === "string") {
    graphBlock = (
      <GraphErrorPanel
        error={parsed === ERROR_CODES.NO_SEARCH_PARAMS ? undefined : parsed}
        links={RI_BUOY_ERROR_LINKS}
      />
    );
  }
  else {
    const riBuoyData = await fetchRiBuoyData(parsed.buoys, parsed.vars, parsed.start, parsed.end);
    const weatherData = await fetchWeatherData(parsed.start, parsed.end);
    if (riBuoyData.length === 0)
      graphBlock = <GraphErrorPanel error="No data is available given the selected parameters." links={RI_BUOY_ERROR_LINKS} />;
    else {
      graphBlock = (
        <DataGraph
          description={(
            <>
              This plot compares {makeCommaSepList(parsed.vars)} between{' '}
              {parsed.start.toLocaleDateString()} and {parsed.end.toLocaleDateString()} at{' '}
              {makeCommaSepList(
                parsed.buoys.map(
                  (bid) => buoyData.find(({ buoyId }) => buoyId === bid)?.stationName || '???'
                )
              )}
              . You can hover over the lines to see more specific data. The weather data below is
              sourced from <ExternalLink href="https://www.rcc-acis.org/">NOAA</ExternalLink>.
            </>
          )}
          weather={weatherData}
          download={(
            <DownloadBuoyData
              variables={parsed.vars}
              region="ri"
              buoys={parsed.buoys}
              start={parsed.start}
              end={parsed.end}
            />
          )}
        >
          <BuoyVariables data={riBuoyData} height={200} />
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
          location="ri"
          dateBounds={{
            startDate: new Date('2003-05-22'),
            endDate: new Date('2019-12-31'),
          }}
          init={typeof parsed === 'string' ? undefined : parsed}
        />
        //<ExploreForm buoys={buoyCoords} init={typeof parsed === 'string' ? undefined : parsed} />
      }
      map={<RiBuoyLocations locations={buoyCoords} />}
      summary={<RiBuoySummary data={buoyData} />}
      description={
        <p>
          This dataset spans from 2003 to 2019 and was collected by the <LINKS.NBFSMN /> with{' '}
          <LINKS.RIDEM_OWR /> as the lead agency. Agencies involved in collection and maintenance of
          the data are:
          <LINKS.RIDEM_OWR />, <LINKS.URI_GSO_MERL />
          , <LINKS.NBC />, <LINKS.NBNERR />, and <LINKS.MASS_DEP />. The heatmap below summarizes
          the number of observations collected for each month for different variables. Use this
          heatmap to help you decide what data you want to visualize or download. When you have an
          idea, go ahead and select the buoys, variables and dates to explore. Or download the data
          in the most appropriate format for your analyses! To begin, select a variable to see what
          data is available.
        </p>
      }
    />
  );
}

function makeCommaSepList(list: string[]) {
  return list.reduce(
    (prev, next, index) =>
      `${prev}${index === 0 ? '' : `${index === list.length - 1 ? '' : ','} `}${index === list.length - 1 ? 'and ' : ''}${next}`,
    ''
  );
}

const RI_BUOY_ERROR_LINKS = [
  { href: "/datasets/rhode-island-buoys?buoys=bid2,bid3&vars=temperatureBottom,temperatureSurface&start=2010-01-22&end=2011-01-22", description: "Changes in Water Temperature at N. Prudence and Conimicut Pt. from 2010 - 2011" },
  { href: "/datasets/rhode-island-buoys?buoys=bid15,bid17&vars=depthBottom,depthSurface&start=2008-01-22&end=2009-01-22", description: "Changes in Depth at Greenwich Bay and GSO Dock from 2008 - 2009" },
];

const LINKS = {
  NBFSMN: () => (
    <ExternalLink href="https://dem.ri.gov/environmental-protection-bureau/water-resources/research-monitoring/narraganset-bay-assessment-fixed-site-monitoring">
      Narragansett Bay Fixed Station Monitoring Network (NBFSMN)
    </ExternalLink>
  ),
  RIDEM_OWR: () => (
    <ExternalLink href="https://dem.ri.gov/environmental-protection-bureau/water-resources">
      RIDEM-OWR
    </ExternalLink>
  ),
  URI_GSO_MERL: () => (
    <ExternalLink href="https://web.uri.edu/gso/research/marine-ecosystems-research-laboratory">
      URI/GSO MERL
    </ExternalLink>
  ),
  NBC: () => <ExternalLink href="https://www.narrabay.com/">NBC</ExternalLink>,
  NBNERR: () => <ExternalLink href="http://nbnerr.org/">NBNERR</ExternalLink>,
  MASS_DEP: () => (
    <ExternalLink href="https://www.mass.gov/orgs/massachusetts-department-of-environmental-protection">
      MassDEP
    </ExternalLink>
  ),
};
