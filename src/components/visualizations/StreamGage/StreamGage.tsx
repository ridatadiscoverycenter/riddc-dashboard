"use client";

import { useFetchWithCache } from "@/hooks/useFetchWithCache";
import { downsampleStreamGageData, fetchStreamGageData, StreamGageData } from "@/utils/data";
import { StreamGageMapGraph } from "./StreamGageMapGraph";

async function getStreamGageData() {
  const streamData = await fetchStreamGageData(14, 'Gage height');
  return downsampleStreamGageData(streamData);
}

export function StreamGage({ className = '' }) {
  const [streamGageData, /* setStreamGageData, { refetch } */] = useFetchWithCache<StreamGageData[]>([], "stream-gage-data", getStreamGageData);
  return <StreamGageMapGraph className={className} streamData={streamGageData} />;
}