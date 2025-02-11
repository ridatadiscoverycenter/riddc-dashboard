import { Card, ExploreForm, ExternalLink, RiBuoyLocations, MaBuoySummary } from '@/components';
import { PageProps } from '@/types';
import { fetchMaSummaryData, fetchMaBuoyCoordinates } from '@/utils/data/api/buoy';
import { getParams } from '@/utils/fns/getParams';
import { DataGraph } from './DataGraph';

export default async function MassachusettsBuoyData({ searchParams }: PageProps) {
  const parsed = getParams(searchParams, 'ma');
  const buoyData = await fetchMaSummaryData();
  const buoyCoords = await fetchMaBuoyCoordinates();

  return (
    <div className="m-4 grid grid-cols-2 md:grid-cols-3 grid-flow-row gap-4">
      <Card className="bg-clear-900 md:col-span-2 col-span-3 flex flex-col items-center justify-around gap-3">
        <DataGraph params={parsed} buoys={buoyCoords} />
      </Card>
      <ExploreForm
        buoys={buoyCoords}
        location="ma"
        dateBounds={{
          startDate: new Date('2017-05-26'),
          endDate: new Date('2018-1-09'),
        }}
        init={typeof parsed === 'string' ? undefined : parsed}
      />
      <div className="flex flex-col items-center justify-around col-span-1">
        <h2 className="text-xl font-header font-bold">Where are these buoys?</h2>
        <RiBuoyLocations locations={buoyCoords} />
      </div>
      <Card className="bg-clear-900 col-span-2 items-center">
        <MaBuoySummary data={buoyData} />
      </Card>
      <div className="col-span-3 flex flex-col justify-center">
        <h2 className="font-header font-bold text-lg self-center">About this dataset</h2>
        <p>
          This dataset spans from 2017 to 2018 and was collected by the <LINKS.NBFSMN /> with{' '}
          <LINKS.MassDEP /> as the lead agency. The heatmap above summarizes the number of
          observations collected for each month for different variables. Use this heatmap to help
          you decide what data you want to visualize or download. When you have an idea, go ahead
          and select the buoys, variables and dates to explore. Or download the data in the most
          appropriate format for your analyses! To begin, select a variable to see what data is
          available.{' '}
        </p>
      </div>
    </div>
  );
}

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
