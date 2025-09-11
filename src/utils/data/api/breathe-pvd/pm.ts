import { z } from 'zod';

import { pmInfo } from '@/utils/data/api/breathe-pvd/pmInfo';
import { erddapAPIGet } from '../erddap';

export const BREATHE_PM_VIEWER_VARS = ['pm1', 'pm10', 'pm25'];

/**
 * Types
 */
type pmSensorInfo = {
  sn: string;
  description: string;
};
export const PM_SENSOR_VARIABLES = ['pm25', 'pm1', 'pm10', 'ws'];
export type BreathePmViewerVars = 'pm25' | 'pm1' | 'pm10';

export type PmSensorVariable = (typeof PM_SENSOR_VARIABLES)[number];

const ZodFetchedPmSensor = z.object({
  pm25: z.number(),
  pm1: z.number(),
  pm10: z.number(),
  ws: z.number(),
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
        await erddapAPIGet<unknown[]>(
          `breathepvd/pm/${id}/range?start=${formatDateForQueryParams(startDate)}&end=${formatDateForQueryParams(endDate)}`,
          false
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
    z.array(ZodFetchedPmSensor).safeParse(data);
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
    sensorName: sensors[id].description,
    latitude: fetchedData['geo.lat'],
    longitude: fetchedData['geo.lon'],
    time: new Date(fetchedData.timestamp),
    pm1: fetchedData.pm1,
    pm25: fetchedData.pm25,
    pm10: fetchedData.pm10,
    windspeed: fetchedData.ws,
  };
}

export type BreathePmData = ReturnType<typeof formatFetchedData>;
