import React from 'react';

import { ExternalLink, FullBleedColumn, Header, Loading, StreamGageMapGraph } from '@/components';
import { downsampleStreamGageData, fetchStreamGageData } from '@/utils/data';

export const dynamic = 'force-dynamic';

export default async function StreamGage() {
  return (
    <React.Suspense fallback={<Loading />}>
      <PageWrapper />
    </React.Suspense>
  );
}

async function PageWrapper() {
  const streamData = await fetchStreamGageData(14, 'Gage height');
  const downsampledData = downsampleStreamGageData(streamData);

  return (
    <FullBleedColumn className="my-2 gap-4 w-full">
      <Header size="lg" variant="impact" tag="h1">
        Stream Gage
      </Header>
      <p>
        This map shows near-realtime data of stream heights in Rhode Island for the the most recent
        two weeks from the{' '}
        <ExternalLink href="https://waterservices.usgs.gov/docs/instantaneous-values/instantaneous-values-details/">
          USGS Instantaneous Values Service
        </ExternalLink>
        . USGS data collection occurs every 15 minutes and is transmitted every hour.
      </p>
      <section className="full-bleed w-full min-h-[70vh] relative p-0 my-0 min-w-full">
        <StreamGageMapGraph className="absolute w-full h-full" streamData={downsampledData} />
      </section>
    </FullBleedColumn>
  );
}
