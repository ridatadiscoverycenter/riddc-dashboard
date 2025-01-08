import { Card, ExploreForm, ExternalLink, RiBuoyMap, MaBuoySummary } from '@/components';
import { PageProps } from '@/types';
import { fetchMaSummaryData, fetchMaBuoyCoordinates } from '@/utils/data/api/buoy';
import { getParams } from './getParams';
import { DataGraph } from './DataGraph';

export default async function MassachusettsBuoyData({ searchParams }: PageProps) {
  const parsed = getParams(searchParams);
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
        init={typeof parsed === 'string' ? undefined : parsed}
      />
      <div className="flex flex-col items-center justify-around col-span-1">
        <h2 className="text-xl font-header font-bold">Where are these buoys?</h2>
        <RiBuoyMap locations={buoyCoords} />
      </div>
      <Card className="bg-clear-900 col-span-2 items-center">
        <MaBuoySummary data={buoyData} />
      </Card>
    </div>
  );
}
