import React from 'react';

import {
  ExternalLink,
  FullBleedColumn,
  Header,
  LoadingMapPlaceholder,
  StreamGageMapGraph,
} from '@/components';
import { downsampleStreamGageData, fetchStreamGageData } from '@/utils/data';

export const dynamic = 'force-dynamic';

export default function StreamGage() {
  return (
    <FullBleedColumn className="my-2 gap-4 w-full">
      <Header size="lg" variant="impact" tag="h1">
        Stream Gage
      </Header>
      <p>
        This map shows near-realtime data of gage height of streams in Rhode Island for the the most
        recent two weeks from the{' '}
        <ExternalLink href="https://waterservices.usgs.gov/docs/instantaneous-values/instantaneous-values-details/">
          USGS Instantaneous Values Service
        </ExternalLink>
        . USGS data collection occurs every 15 minutes and is transmitted every hour.
      </p>
      <p>
        Gage height is depicted by circle size and color. Select up to five circles to view a line
        graph over time.
      </p>
      <p className="md:hidden">Tap the arrow button to view the graph.</p>
      <section className="full-bleed w-full min-h-[70vh] relative p-0 my-0 min-w-full">
        <React.Suspense fallback={<LoadingMapPlaceholder title='Stream Gage Height' />}>
          <VisualizationWrapper />
        </React.Suspense>
      </section>
    </FullBleedColumn>
  );
}

async function VisualizationWrapper() {
  const streamData = await fetchStreamGageData(14, 'Gage height');
  const downsampledData = downsampleStreamGageData(streamData);

  return <StreamGageMapGraph className="absolute w-full h-full" streamData={downsampledData} />;
}
