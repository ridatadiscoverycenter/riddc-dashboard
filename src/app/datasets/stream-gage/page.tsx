import React from 'react';

import { Loading } from '@/components';
import { fetchStreamGageData } from '@/utils/data';

export default async function StreamGage() {
  return (
    <React.Suspense fallback={<Loading />}>
      <PageWrapper />
    </React.Suspense>
  );
}

async function PageWrapper() {
  const streamData = await fetchStreamGageData(30, 'Gage height');
  return <pre>{JSON.stringify(streamData, null, 2)}</pre>;
}
