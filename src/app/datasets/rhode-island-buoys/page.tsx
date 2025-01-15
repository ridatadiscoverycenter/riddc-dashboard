import {
  BuoyPageSkeleton,
  ExploreForm,
  ExternalLink,
  RiBuoyLocations,
  RiBuoySummary,
} from '@/components';
import { PageProps } from '@/types';
import { fetchRiSummaryData, fetchRiBuoyCoordinates } from '@/utils/data/api/buoy';
import { getParams } from '@/utils/fns';
import { DataGraph } from './DataGraph';

export default async function RhodeIslandBuoyData({ searchParams }: PageProps) {
  const parsed = getParams(searchParams, 'ri');
  const buoyData = await fetchRiSummaryData();
  const buoyCoords = await fetchRiBuoyCoordinates();

  return (
    <BuoyPageSkeleton
      graph={<DataGraph params={parsed} buoys={buoyCoords} />}
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

  /*
  return (
    <div className="m-4 grid grid-cols-2 md:grid-cols-3 grid-flow-row gap-4">
      <Card className="bg-clear-900 md:col-span-2 col-span-3 flex flex-col items-center justify-around gap-3">
        <DataGraph params={parsed} buoys={buoyCoords} />
      </Card>
      <div className="flex flex-col items-center justify-around col-span-1">
        <h2 className="text-xl font-header font-bold">Where are these buoys?</h2>
        <RiBuoyLocations locations={buoyCoords} />
      </div>
      <Card className="bg-clear-900 col-span-2 items-center">
        <RiBuoySummary data={buoyData} />
      </Card>
      <div className="col-span-3 flex flex-col items-center justify-center">
        <h2 className="font-header font-bold text-lg">About this dataset</h2>
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
      </div>
    </div>
  );
  */
}

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
