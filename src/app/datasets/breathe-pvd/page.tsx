import { subDays } from 'date-fns';

import { sensorInfo } from '@/assets/sensorInfo';
import type { SensorInfo } from '@/utils/data/api/breathe-pvd';
import { fetchBreatheData } from '@/utils/data/api/breathe-pvd/sensors';
import { BreatheMapGraph } from '@/components/visualizations/BreathePvd/BreatheMapGraph';

type PageWrapperProps = { sensors: Record<number, SensorInfo> };

export default async function BreathePvd() {
  return <PageWrapper sensors={sensorInfo} />;
}

async function PageWrapper({ sensors }: PageWrapperProps) {
  // TODO change data declaration
  //   const data = await fetchBreatheData(Object.keys(sensorInfo), subDays(new Date(), 90), new Date());
  //   const data = await fetchBreatheData(ids, subDays(new Date(), 1), new Date());
  //   const data = await fetchBreatheData(ids, subDays(new Date(), 1), new Date());
  const data = await fetchBreatheData(
    // Object.keys(sensorInfo),
    ['250', '254'],
    subDays(new Date('2025-08-08'), 1),
    new Date('2025-08-25')
  );
  return <BreatheMapGraph breatheData={data} className="h-[75vh]" />;
}
