import { subDays } from 'date-fns';

import { sensorInfo } from '@/assets/sensorInfo';
import { fetchBreatheData } from '@/utils/data/api/breathe-pvd/sensors';
import { BreatheMapGraph } from '@/components/visualizations/BreathePvd/BreatheMapGraph';

type PageWrapperProps = { ids: string[] };

export default async function BreathePvd() {
  return <PageWrapper ids={['250', '254']} />;
}

async function PageWrapper({ ids }: PageWrapperProps) {
  // TODO change data declaration
  //   const data = await fetchBreatheData(Object.keys(sensorInfo), subDays(new Date(), 90), new Date());
  const data = await fetchBreatheData(ids, subDays(new Date(), 1), new Date());
  return <BreatheMapGraph breatheData={data} />;
}
