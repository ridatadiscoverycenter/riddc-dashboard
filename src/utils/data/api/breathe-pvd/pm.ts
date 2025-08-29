import { z } from 'zod';

import { pmInfo } from '@/assets/pmInfo';
import { APIGet } from '../erddap';

export const BREATHE_PM_VIEWER_VARS = [
  'pm25', 'pm1', 'pm10'
]

/**
 * Types
 */
type pmSensorInfo = {
  sn: string;
  description: string;
};
export const PM_SENSOR_VARIABLES = ['pm25', 'pm1', 'pm10', 'ws'];

export type PmSensorVariable = (typeof PM_SENSOR_VARIABLES)[number];

const ZodFetchedPmSensor = z.object({
  pm25: z.union([z.number(), z.null()]),
  pm1: z.union([z.number(), z.null()]),
  pm10: z.union([z.number(), z.null()]),
  ws: z.union([z.number(), z.null()]),
  timestamp: z.string().datetime({ local: true }),
  sn: z.string(),
  'geo.lat': z.number(),
  'geo.lon': z.number(),
});
export type FetchedPmSensor = z.infer<typeof ZodFetchedPmSensor>;

function formatDateForQueryParams(d: Date) {
  //   return d;
  return d.toISOString().split('T')[0];
}

export async function fetchPmData(ids: string[], startDate: Date, endDate: Date) {
  const fetchedData = await Promise.all(
    ids.map(
      async (id) =>
        await APIGet<unknown[]>(
          `breathepvd/pm/${id}/range?start=${formatDateForQueryParams(startDate)}&end=${formatDateForQueryParams(endDate)}`
        )
    )
  );
  const flattenedData = fetchedData.flat();
  if (validateFetchedData(flattenedData)) {
    return (flattenedData as FetchedPmSensor[]).map(formatFetchedData);
  } else {
    throw new Error('Invalid data received when fetching pm data');
  }
}

function validateFetchedData(data: unknown): data is FetchedPmSensor {
  try {
    z.array(ZodFetchedPmSensor).parse(data);
    return true;
  } catch (ex) {
    if (ex instanceof z.ZodError) {
      console.log(ex.issues);
    }
    return false;
  }
}

function formatFetchedData(fetchedData: FetchedPmSensor) {
  const sensors = pmInfo as Record<string, pmSensorInfo>;
  const id = fetchedData.sn.replace('MOD-', '');
  return {
    id: id,
    sensor_name: sensors[id].description,
    latitude: fetchedData['geo.lat'],
    longitude: fetchedData['geo.lon'],
    time: new Date(fetchedData.timestamp),
    pm25: fetchedData.pm25,
    pm1: fetchedData.pm1,
    pm10: fetchedData.pm10,
    windspeed: fetchedData.ws,
  };
}

export type BreathePmData = ReturnType<typeof formatFetchedData>;
