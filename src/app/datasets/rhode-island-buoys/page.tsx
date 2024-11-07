import { RiBuoySummary } from '@/components/visualizations';
import { fetchRiSummaryData } from '@/utils/erddap/api/buoy';

export default async function RhodeIslandBuoys() {
  const buoyData = await fetchRiSummaryData();
  return (
    <>
      <div>Rhode Island Buoys</div>
      <RiBuoySummary data={buoyData} />
    </>
  );
}
