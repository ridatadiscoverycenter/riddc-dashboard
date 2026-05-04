import React from 'react';
import { subDays } from 'date-fns';

import { sensorInfo } from '@/utils/data/api/breathe-pvd/sensorInfo';
import { fetchPmData } from '@/utils/data/api/breathe-pvd';
import { fetchBreatheData } from '@/utils/data/api/breathe-pvd/sensors';
import { pmInfo } from '@/utils/data/api/breathe-pvd/pmInfo';
import {
  ExternalLink,
  FullBleedColumn,
  Header,
  BreatheMapGraph,
  LoadingMapPlaceholder,
} from '@/components';

export const dynamic = 'force-dynamic';

const DATA_WINDOW = 30;

export default function BreathePvd() {
  return (
    <FullBleedColumn className="my-2 gap-4 w-full">
      <Header size="lg" variant="impact" tag="h2">
        Breathe PVD
      </Header>
      <p>
        This map shows recent Providence air quality data from{' '}
        <ExternalLink href="https://www.breatheprovidence.com/">Breathe Providence</ExternalLink>.
        Data include carbon dioxide, carbon monoxide, and particulate matter.
      </p>
      <p>
        Contaminant concentration is depicted by circle size and color. Select a contaminent and up
        to five circles to view a line graph over time.
      </p>
      <p className="md:hidden">Tap the arrow button to view the graph.</p>
      <section className="full-bleed w-full min-h-[70vh] relative p-0 my-0 min-w-full">
        <React.Suspense fallback={<LoadingMapPlaceholder title="Air Quality" />}>
          <VisualizationWrapper />
        </React.Suspense>
      </section>
    </FullBleedColumn>
  );
}

async function VisualizationWrapper() {
  const now = new Date();
  const sensorData = await fetchBreatheData(
    Object.keys(sensorInfo),
    subDays(now, DATA_WINDOW),
    now
  );
  const pmData = await fetchPmData(Object.keys(pmInfo), subDays(now, DATA_WINDOW), now);
  return (
    <BreatheMapGraph breatheSensorData={sensorData} breathePmData={pmData} className="h-[75vh]" />
  );
}
