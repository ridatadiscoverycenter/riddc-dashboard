import { z } from 'zod';
import { compareAsc } from 'date-fns';

import { erddapAPIGet } from '../erddap';
import { formatDateForQueryParams } from '../shared';
import { sensorInfo } from '@/utils/data/api/breathe-pvd/sensorInfo';

export const BREATHE_SENSOR_VIEWER_VARS = ['co', 'co2'];
export type BreatheSensorViewerVars = 'co' | 'co2';
type Sensors = keyof typeof sensorInfo;

/**
 * Types
 */
export type SensorInfo = {
  'Sensor ID': string;
  node_id: number;
  Location: string;
  Latitude: string;
  Longitude: string;
  'Installation Date': string;
};
export type BreatheSensorVariable = ['co_corrected', 'co2_corrected_avg_t_drift_applied'];

const ZodFetchedBreatheSensor = z.object({
  co_corrected: z.union([z.number(), z.null()]),
  co2_corrected_avg_t_drift_applied: z.union([z.number(), z.null()]),
  datetime: z.string().datetime({ local: true }),
  node_file_id: z.number(),
  node_id: z.number(),
});
export type FetchedBreatheSensor = z.infer<typeof ZodFetchedBreatheSensor>;

export async function fetchBreatheData(ids: string[], startTime: Date, endTime: Date) {
  const fetchedData = await Promise.all(
    ids.map(
      async (id) =>
        await erddapAPIGet<unknown[]>(
          `breathepvd/sensor/${id}/hourly?start=${formatDateForQueryParams(startTime)}&end=${formatDateForQueryParams(endTime)}`,
          false
        )
    )
  );
  const flattenedData = fetchedData.flat();
  if (validateFetchedData(flattenedData)) {
    return (flattenedData as FetchedBreatheSensor[])
      .map(formatFetchedData)
      .sort((a, b) => compareAsc(a.time, b.time));
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

function getSensor(sensor: unknown) {
  return sensorInfo[sensor as Sensors];
}

function formatFetchedData(fetchedData: FetchedBreatheSensor) {
  return {
    node: fetchedData.node_id,
    sensorName: getSensor(fetchedData.node_id).Location,
    latitude: getSensor(fetchedData.node_id).Latitude.replace(' N', ''),
    longitude: `-${getSensor(fetchedData.node_id).Longitude.replace(' W', '')}`,
    time: new Date(fetchedData.datetime),
    co: fetchedData.co_corrected,
    co2: fetchedData.co2_corrected_avg_t_drift_applied,
  };
}

export type BreatheSensorData = ReturnType<typeof formatFetchedData>;
