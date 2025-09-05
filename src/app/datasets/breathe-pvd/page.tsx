import { subDays } from 'date-fns';

import { sensorInfo } from '@/assets/sensorInfo';
import { fetchPmData, type SensorInfo } from '@/utils/data/api/breathe-pvd';
import { fetchBreatheData } from '@/utils/data/api/breathe-pvd/sensors';
import { BreatheMapGraph } from '@/components/visualizations/BreathePvd/BreatheMapGraph';
import { downsamplePmData } from '@/utils/data/api/breathe-pvd/downsample';
import { pmInfo } from '@/assets/pmInfo';

export default async function BreathePvd() {
  return <PageWrapper />;
}

async function PageWrapper() {
  const sensorData = await fetchBreatheData(
    Object.keys(sensorInfo),
    // ['250', '254'],
    subDays(new Date('2025-08-20'), 1),
    new Date('2025-08-25')
  );
  const pmData = await fetchPmData(
    Object.keys(pmInfo),
    subDays(new Date('2025-08-20'), 1),
    new Date('2025-08-25')
  );
  const filteredData = downsamplePmData(pmData);
  return (
    <BreatheMapGraph
      breatheSensorData={sensorData}
      breathePmData={filteredData}
      className="h-[75vh]"
    />
  );
}
