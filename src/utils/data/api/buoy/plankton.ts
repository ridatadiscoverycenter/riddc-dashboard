import { z } from 'zod';

import { fetchBuoyData, fetchBuoyCoordinates, fetchSummaryData } from './buoy';

export const PLANKTON_VARIABLES = [
  'SilicaBottom',
  'NH4Surface',
  'SalinityBottom',
  'ChlorophyllSurface',
  'WaterTempBottom',
  'NH4Bottom',
  'NO3Bottom',
  'NO2Surface',
  'DINSurface',
  'DIPSurface',
  'NO2Bottom',
  'WaterTempSurface',
  'ChlorophyllBottom',
  'PhaeoBottom',
  'SilicaSurface',
  'SalinitySurface',
  'NO3Surface',
  'DINBottom',
  'PhaeoSurface',
  'DIPBottom',
] as const;
export type PlanktonVariable = (typeof PLANKTON_VARIABLES)[number];

type FetchedPlanktonData = {
  variable: PlanktonVariable;
  value: number | null;
  station_name: string;
  time: string;
  units: string;
};

const ZodFetchedPlanktonData = z.object({
  data: z.array(
    z.object({
      variable: z.enum(PLANKTON_VARIABLES),
      value: z.union([z.number(), z.null()]),
      station_name: z.string(),
      time: z.string().datetime(),
      units: z.string(),
    })
  ),
});

function validateFetchedPlanktonData(
  planktonData: unknown
): planktonData is { data: FetchedPlanktonData[] } {
  try {
    ZodFetchedPlanktonData.parse(planktonData);
    return true;
  } catch (ex) {
    return false;
  }
}

function formatData(planktonData: FetchedPlanktonData) {
  return {
    variable: planktonData.variable,
    value: planktonData.value || undefined,
    stationName: planktonData.station_name,
    time: new Date(planktonData.time),
    units: planktonData.units,
  };
}

export type PlanktonData = ReturnType<typeof formatData>;

export async function fetchPlanktonData(
  ids: string[],
  vars: PlanktonVariable[],
  startDate: Date,
  endDate: Date
) {
  const planktonData = await fetchBuoyData('plankton', ids, vars, startDate, endDate);
  if (validateFetchedPlanktonData(planktonData)) {
    return planktonData.data.map(formatData);
  } else {
    throw new Error('Invalid data received when fetching plankton data.');
  }
}

export type FetchedBuoyCoordinate = {
  station_name: string;
  longitude: number;
  latitude: number;
  buoyId: string;
};

const ZodFetchedBuoyCoordinate = z.object({
  station_name: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  buoyId: z.string(),
});

function validateFetchedBuoyCoordinate(
  coordinates: unknown[]
): coordinates is FetchedBuoyCoordinate[] {
  try {
    z.array(ZodFetchedBuoyCoordinate).parse(coordinates);
    return true;
  } catch (ex) {
    return false;
  }
}

function formatBuoyCoordinate(fetchedData: FetchedBuoyCoordinate) {
  return {
    stationName: fetchedData.station_name,
    buoyId: fetchedData.buoyId,
    longitude: fetchedData.longitude,
    latitude: fetchedData.latitude,
  };
}

export type BuoyCoordinate = ReturnType<typeof formatBuoyCoordinate>;

export async function fetchPlanktonCoordinates() {
  const fetchedCoordinates = await fetchBuoyCoordinates('plankton');
  if (validateFetchedBuoyCoordinate(fetchedCoordinates)) {
    return fetchedCoordinates.map(formatBuoyCoordinate);
  } else {
    throw new Error('Invalid data received when fetching MA Buoy Coordinates');
  }
}

/**
 * Buoy Summary Data
 */

export type FetchedPlanktonSummary = {
  SilicaBottom: number;
  NH4Surface: number;
  SalinityBottom: number;
  ChlorophyllSurface: number;
  WaterTempBottom: number;
  NH4Bottom: number;
  NO3Bottom: number;
  NO2Surface: number;
  DINSurface: number;
  DIPSurface: number;
  NO2Bottom: number;
  WaterTempSurface: number;
  ChlorophyllBottom: number;
  PhaeoBottom: number;
  SilicaSurface: number;
  SalinitySurface: number;
  NO3Surface: number;
  DINBottom: number;
  PhaeoSurface: number;
  DIPBottom: number;
  station_name: string;
  time: string;
  buoyId: string;
};

const ZodFetchedPlanktonSummary = z.object({
  SilicaBottom: z.number(),
  NH4Surface: z.number(),
  SalinityBottom: z.number(),
  ChlorophyllSurface: z.number(),
  WaterTempBottom: z.number(),
  NH4Bottom: z.number(),
  NO3Bottom: z.number(),
  NO2Surface: z.number(),
  DINSurface: z.number(),
  DIPSurface: z.number(),
  NO2Bottom: z.number(),
  WaterTempSurface: z.number(),
  ChlorophyllBottom: z.number(),
  PhaeoBottom: z.number(),
  SilicaSurface: z.number(),
  SalinitySurface: z.number(),
  NO3Surface: z.number(),
  DINBottom: z.number(),
  PhaeoSurface: z.number(),
  DIPBottom: z.number(),
  station_name: z.string(),
  time: z.string(),
  buoyId: z.string(),
});

function validateFetchedSummary(summary: unknown[]): summary is FetchedPlanktonSummary[] {
  try {
    z.array(ZodFetchedPlanktonSummary).parse(summary);
    return true;
  } catch (ex) {
    return false;
  }
}

function formatSummaryData(fetchedData: FetchedPlanktonSummary) {
  return {
    stationName: fetchedData.station_name,
    time: new Date(fetchedData.time),
    buoyId: fetchedData.buoyId,
    SilicaBottom: fetchedData.SilicaBottom,
    NH4Surface: fetchedData.NH4Surface,
    SalinityBottom: fetchedData.SalinityBottom,
    ChlorophyllSurface: fetchedData.ChlorophyllSurface,
    WaterTempBottom: fetchedData.WaterTempBottom,
    NH4Bottom: fetchedData.NH4Bottom,
    NO3Bottom: fetchedData.NO3Bottom,
    NO2Surface: fetchedData.NO2Surface,
    DINSurface: fetchedData.DINSurface,
    DIPSurface: fetchedData.DIPSurface,
    NO2Bottom: fetchedData.NO2Bottom,
    WaterTempSurface: fetchedData.WaterTempSurface,
    ChlorophyllBottom: fetchedData.ChlorophyllBottom,
    PhaeoBottom: fetchedData.PhaeoBottom,
    SilicaSurface: fetchedData.SilicaSurface,
    SalinitySurface: fetchedData.SalinitySurface,
    NO3Surface: fetchedData.NO3Surface,
    DINBottom: fetchedData.DINBottom,
    PhaeoSurface: fetchedData.PhaeoSurface,
    DIPBottom: fetchedData.DIPBottom,
  };
}

export type PlanktonSummaryData = ReturnType<typeof formatSummaryData>;

export async function fetchPlanktonSummary(bustCache = false) {
  const fetchedSummaryData = await fetchSummaryData('plankton', bustCache);
  
  if (validateFetchedSummary(fetchedSummaryData)) {
    return fetchedSummaryData.map(formatSummaryData);
  } else {
    throw new Error('Invalid data received when fetching Summary Data.');
  }
}
