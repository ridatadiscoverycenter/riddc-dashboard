import React from 'react';

import { BuoyMap, Loading } from '@/components';
import { fetchMulti, groupBy } from '@/utils/fns';
import {
  fetchRiBuoyCoordinates,
  fetchRiSummaryMeanData,
  RiBuoyCoordinate,
  RiBuoySummaryMeanData,
} from '@/utils/data/api/buoy';

export default async function BuoyMean() {
  return (
    <React.Suspense fallback={<Loading />}>
      <PageWrapper />
    </React.Suspense>
  );
}

async function PageWrapper() {
  return null;
  const { buoyData, summaryData } = await fetchMulti({
    buoyData: fetchRiBuoyCoordinates(),
    summaryData: fetchRiSummaryMeanData(),
  });

  const formattedSummaryMean = reshapeSummaryMeanData(summaryData, buoyData); //.filter(({ variableName }) => variableName === "O2PercentSurface");
  return <BuoyMap className="h-[75vh]" streamData={formattedSummaryMean} />;
  ///console.log(summaryData);
  ///console.log(formattedSummaryMean);
  //return <pre>{JSON.stringify(formattedSummaryMean, null, 2)}</pre>
}

function reshapeSummaryMeanData(
  summaryData: RiBuoySummaryMeanData[],
  buoyData: RiBuoyCoordinate[]
) {
  const groupedSummaryData = groupBy(
    summaryData,
    ({ buoyId, variable }) => `${buoyId}~${variable}`
  );
  return Object.entries(groupedSummaryData)
    .map(([groupKey, groupedValues]) => {
      const buoyId = groupKey.split('~')[0];
      const dataForBuoy = buoyData.find(({ buoyId: bid }) => bid === buoyId);
      if (dataForBuoy) {
        const { stationName: siteName, variable: variableName } = groupedValues[0];
        const values = groupedValues
          .filter(({ value }) => value !== null)
          .map(({ time, value }) => ({ value, dateTime: time })) as {
          dateTime: Date;
          value: number;
        }[];
        return {
          siteName,
          longitude: dataForBuoy.longitude,
          latitude: dataForBuoy.latitude,
          variableName,
          values,
        };
      }
    })
    .filter((groupOrUndefined) => groupOrUndefined !== undefined);
}
