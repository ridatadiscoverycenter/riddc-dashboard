import { z } from 'zod';
import { fetchSummaryData, fetchBuoyData, fetchBuoyCoordinates } from './buoy';

export const OSOM_VARIABLES = [
  'SalinityBottom',
  'WaterTempBottom',
  'SalinitySurface',
  'WaterTempSurface',
] as const;
export type OsomBuoyVariable = (typeof OSOM_VARIABLES)[number];

/**
 * OSOM Summary Data
 */

export async function fetchOsomSummaryData(bustCache = false) {
  const fetchedSummaryData = await fetchSummaryData('osom', bustCache);
  if (validateFetchedOsomSummary(fetchedSummaryData)) {
    return fetchedSummaryData.map(formatOsomSummaryData);
  } else {
    throw new Error('Invalid data received when fetching OSOM Summary Data');
  }
}

const ZodFetchedOsomSummary = z.object({
  SalinityBottom: z.number(),
  SalinitySurface: z.number(),
  WaterTempBottom: z.number(),
  WaterTempSurface: z.number(),
  station_name: z.string(),
  buoyId: z.string(),
  time: z.string().datetime(),
});
type FetchedOsomSummary = z.infer<typeof ZodFetchedOsomSummary>;

function validateFetchedOsomSummary(summary: unknown[]): summary is FetchedOsomSummary[] {
  try {
    z.array(ZodFetchedOsomSummary).parse(summary);
    return true;
  } catch (ex) {
    return false;
  }
}

function formatOsomSummaryData({
  SalinityBottom,
  SalinitySurface,
  WaterTempBottom,
  WaterTempSurface,
  station_name,
  buoyId,
  time,
}: FetchedOsomSummary) {
  return {
    SalinityBottom,
    SalinitySurface,
    WaterTempBottom,
    WaterTempSurface,
    buoyId,
    time: new Date(time),
    stationName: station_name,
  };
}

export type OsomSummary = ReturnType<typeof formatOsomSummaryData>;

/**
 * OSOM Buoy Data
 */

export async function fetchOsomBuoyData(
  ids: string[],
  vars: OsomBuoyVariable[],
  startDate: Date,
  endDate: Date
) {
  const fetchedOsomBuoyData = await fetchBuoyData('osom', ids, vars, startDate, endDate);
  if (validateFetchedOsomBuoyData(fetchedOsomBuoyData)) {
    return fetchedOsomBuoyData.data.map(formatOsomBuoyData);
  } else {
    throw new Error('Invalid data received when fetching OSOM Buoy Data.');
  }
}

const ZodFetchedOsomBuoyData = z.object({
  data: z.array(
    z.object({
      variable: z.enum(OSOM_VARIABLES),
      value: z.union([z.number(), z.null()]),
      station_name: z.string(),
      time: z.union([z.string().datetime(), z.number()]),
      units: z.string(),
    })
  ),
});
type FetchedOsomBuoyData = z.infer<typeof ZodFetchedOsomBuoyData>['data'][number];

function validateFetchedOsomBuoyData(
  buoyData: unknown
): buoyData is { data: FetchedOsomBuoyData[] } {
  try {
    ZodFetchedOsomBuoyData.parse(buoyData);
    return true;
  } catch (ex) {
    return false;
  }
}

function formatOsomBuoyData({ station_name, value, variable, units }: FetchedOsomBuoyData) {
  return {
    units,
    variable,
    value,
    stationName: station_name,
  };
}

export type OsomBuoyData = ReturnType<typeof formatOsomBuoyData>;

/**
 * OSOM Buoy Coordinates
 */

export async function fetchOsomBuoyCoordinates() {
  const fetchedCoordinates = await fetchBuoyCoordinates('osom');
  if (validateFetchedOsomBuoyCoordinate(fetchedCoordinates)) {
    return fetchedCoordinates.map(formatOsomBuoyCoordinate);
  } else {
    throw new Error('Invalid data received when fetching OSOM Buoy Coordinates');
  }
}

const ZodFetchedOsomBuoyCoordinate = z.object({
  station_name: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  buoyId: z.string(),
});
type FetchedOsomBuoyCoordinate = z.infer<typeof ZodFetchedOsomBuoyCoordinate>;

function validateFetchedOsomBuoyCoordinate(
  coordinates: unknown[]
): coordinates is FetchedOsomBuoyCoordinate[] {
  try {
    z.array(ZodFetchedOsomBuoyCoordinate).parse(coordinates);
    return true;
  } catch (ex) {
    return false;
  }
}

function formatOsomBuoyCoordinate({
  station_name,
  longitude,
  latitude,
  buoyId,
}: FetchedOsomBuoyCoordinate) {
  return {
    stationName: station_name,
    longitude,
    latitude,
    buoyId,
  };
}

export type OsomCoordinate = ReturnType<typeof formatOsomBuoyCoordinate>;
