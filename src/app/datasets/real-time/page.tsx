import { subDays } from 'date-fns';
import {
  fetchRealTimeBuoyCoordinates,
  fetchRealTimeBuoyData,
  fetchRealTimeSummaryData,
} from '@/utils/data/api/buoy';
import { fetchMulti } from '@/utils/fns';
import { BuoyLocationsMap, BuoyPageSkeleton, RealTimeBuoySummary } from '@/components';

export default async function RealTime() {
  const { summaryData, coordinates, waterTemperature } = await fetchMulti({
    summaryData: fetchRealTimeSummaryData(),
    coordinates: fetchRealTimeBuoyCoordinates(),
    waterTemperature: fetchRealTimeBuoyData(
      ['Buoy-720'],
      ['waterTemperature'],
      subDays(new Date(), 360),
      subDays(new Date(), 180)
    ),
  });

  console.log({ waterTemperature });

  return (
    <BuoyPageSkeleton
      graph={<div>graph</div>}
      form={<div>form</div>}
      map={<BuoyLocationsMap locations={coordinates} />}
      summary={<RealTimeBuoySummary data={summaryData} />}
      description={<div>descfitpion</div>}
    />
  );
}
