import React from 'react';

import { Loading, StreamGageMapGraph } from '@/components';
import { downsampleStreamGageData, fetchStreamGageData } from '@/utils/data';

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

  return <StreamGageMapGraph className="h-[75vh]" streamData={downsampledData} />;
}
