import React from 'react';
import { subDays } from 'date-fns';

import { sensorInfo } from '@/utils/data/api/breathe-pvd/sensorInfo';
import { fetchPmData } from '@/utils/data/api/breathe-pvd';
import { fetchBreatheData } from '@/utils/data/api/breathe-pvd/sensors';
import { BreatheMapGraph } from '@/components/visualizations/BreathePvd/BreatheMapGraph';
import { downsamplePmData } from '@/utils/data/api/breathe-pvd/downsample';
import { pmInfo } from '@/utils/data/api/breathe-pvd/pmInfo';
import { Loading } from '@/components';

export const dynamic = 'force-dynamic';

const DATA_WINDOW = 14;

export default async function BreathePvd() {
  return (
    <React.Suspense fallback={<Loading />}>
      <PageWrapper />
    </React.Suspense>
  );
}

async function PageWrapper() {
  const now = new Date();
  const sensorData = await fetchBreatheData(
    Object.keys(sensorInfo),
    subDays(now, DATA_WINDOW),
    now
  );
  const pmData = await fetchPmData(Object.keys(pmInfo), subDays(now, DATA_WINDOW), now);
  const filteredData = downsamplePmData(pmData);
  return (
    <BreatheMapGraph
      breatheSensorData={sensorData}
      breathePmData={filteredData}
      className="h-[75vh]"
    />
  );
}
