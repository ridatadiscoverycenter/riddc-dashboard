import React from 'react';

import { Loading, MapGraph } from '@/components';
import { fetchStreamGageData } from '@/utils/data';

export default async function StreamGage() {
  return (
    <React.Suspense fallback={<Loading />}>
      <PageWrapper />
    </React.Suspense>
  );
}

async function PageWrapper() {
  const streamData = await fetchStreamGageData(10, 'Gage height');
  return <MapGraph className="h-[75vh]" streamData={streamData} />;
}
