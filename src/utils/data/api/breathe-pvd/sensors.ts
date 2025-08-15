import { z } from 'zod';

import { sensorInfo } from '@/assets/sensorInfo';
import { APIGet } from '../erddap';

/**
 * Types
 */
type SensorInfo = {
  'Sensor ID': string;
  node_id: number;
  Location: string;
  Latitude: string;
  Longitude: string;
  'Installation Date': string;
};
export const BREATHE_SENSOR_VARIABLES = ['co_corrected', 'co2_corrected_avg_t_drift_applied'];

export type BreatheSensorVariable = (typeof BREATHE_SENSOR_VARIABLES)[number];

const ZodFetchedBreatheSensor = z.object({
  co_corrected: z.union([z.number(), z.null()]),
  co2_corrected_avg_t_drift_applied: z.union([z.number(), z.null()]),
  local_timestamp: z.string().datetime({ local: true }),
  node_file_id: z.number(),
  node_id: z.number(),
});
export type FetchedBreatheSensor = z.infer<typeof ZodFetchedBreatheSensor>;

function formatDateForQueryParams(d: Date) {
  //   return d;
  return d.toISOString().split('T')[0];
}

export async function fetchBreatheData(ids: string[], startDate: Date, endDate: Date) {
  //   const fetchedData = await APIGet<unknown[]>(
  //     `breathepvd/sensor/${ids.join(',')}&start=${formatDateForQueryParams(startDate)}&end=${formatDateForQueryParams(endDate)}`
  //   );
  const fetchedData = await Promise.all(
    ids.map(
      async (id) =>
        //   console.log(`breathepvd/sensor/${id}/range?start=${startDate}&end=${endDate}`)
        await APIGet<unknown[]>(
          `breathepvd/sensor/${id}/range?start=${formatDateForQueryParams(startDate)}&end=${formatDateForQueryParams(endDate)}`
        )
    )
  );
  const flattenedData = fetchedData.flat();
  if (validateFetchedData(flattenedData)) {
    return (flattenedData as FetchedBreatheSensor[]).map(formatFetchedData);
  } else {
    throw new Error('Invalid data received when fetching sensor data');
  }
}

function validateFetchedData(data: unknown): data is FetchedBreatheSensor {
  try {
    z.array(ZodFetchedBreatheSensor).parse(data);
    return true;
  } catch (ex) {
    if (ex instanceof z.ZodError) {
      console.log(ex.issues);
    }
    return false;
  }
}

function formatFetchedData(fetchedData: FetchedBreatheSensor) {
  const sensors = sensorInfo as Record<string, SensorInfo>;
  return {
    node: fetchedData.node_id,
    sensor_name: sensors[fetchedData.node_id.toString()].Location,
    latitude: sensors[fetchedData.node_id.toString()].Latitude,
    longitude: sensors[fetchedData.node_id.toString()].Longitude,
    time: new Date(fetchedData.local_timestamp),
    co: fetchedData.co_corrected,
    co2: fetchedData.co2_corrected_avg_t_drift_applied,
  };
}

export type BreatheSensorData = ReturnType<typeof formatFetchedData>;
