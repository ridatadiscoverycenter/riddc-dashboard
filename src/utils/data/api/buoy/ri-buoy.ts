import { z } from 'zod';
import {
  fetchSummaryData,
  fetchBuoyData,
  fetchBuoyCoordinates,
  fetchBuoyVariables,
  fetchBuoyTimeRange,
  fetchSummaryMeanData,
} from './buoy';

export const RI_BUOY_VARIABLES = [
  'O2PercentSurface',
  'O2PercentBottom',
  'DepthBottom',
  'depth',
  'pHBottom',
  'pHSurface',
  'SpCondSurface',
  'SpCondBottom',
  'WaterTempBottom',
  'WaterTempSurface',
  'O2Surface',
  'O2Bottom',
  'SalinityBottom',
  'SalinitySurface',
  'DensitySurface',
  'DensityBottom',
  'TurbidityBottom',
  'ChlorophyllSurface',
  'FSpercentSurface',
] as const;

export type RiBuoyVariable = (typeof RI_BUOY_VARIABLES)[number];

type FetchedRiBuoyData = {
  variable: RiBuoyVariable;
  value: number | null;
  station_name: string;
  time: string;
  units: string;
};

const ZodFetchedRiBuoyData = z.object({
  data: z.array(
    z.object({
      variable: z.enum(RI_BUOY_VARIABLES),
      value: z.union([z.number(), z.null()]),
      station_name: z.string(),
      time: z.string().datetime(),
      units: z.string(),
    })
  ),
});

function validateFetchedRiBuoyData(buoyData: unknown): buoyData is { data: FetchedRiBuoyData[] } {
  try {
    ZodFetchedRiBuoyData.parse(buoyData);
    return true;
  } catch (ex) {
    console.error(ex);
    return false;
  }
}

function formatRiBuoyData(buoyData: FetchedRiBuoyData) {
  return {
    variable: buoyData.variable,
    value: buoyData.value || undefined,
    stationName: buoyData.station_name,
    time: new Date(buoyData.time),
    units: buoyData.units,
  };
}

export type RiBuoyData = ReturnType<typeof formatRiBuoyData>;

export async function fetchRiBuoyData(
  ids: string[],
  vars: RiBuoyVariable[],
  startDate: Date,
  endDate: Date
) {
  const fetchedRiBuoyData = await fetchBuoyData('ri-buoy', ids, vars, startDate, endDate);
  if (validateFetchedRiBuoyData(fetchedRiBuoyData)) {
    return fetchedRiBuoyData.data.map(formatRiBuoyData);
  } else {
    throw new Error('Invalid data received when fetching RI Buoy Summary Data.');
  }
}

/**
 * Buoy Summary Data
 */

export type FetchedRiSummaryData = {
  O2PercentSurface: number;
  O2PercentBottom: number;
  depth: number;
  SalinityBottom: number;
  pHBottom: number;
  DepthBottom: number;
  TurbidityBottom: number;
  ChlorophyllSurface: number;
  pHSurface: number;
  SpCondSurface: number;
  SpCondBottom: number;
  FSpercentSurface: number;
  WaterTempBottom: number;
  O2Surface: number;
  O2Bottom: number;
  WaterTempSurface: number;
  SalinitySurface: number;
  DensitySurface: number;
  DensityBottom: number;
  station_name: string;
  time: string;
  buoyId: string;
};

const ZodFetchedRiSummaryData = z.object({
  O2PercentSurface: z.number(),
  O2PercentBottom: z.number(),
  depth: z.number(),
  SalinityBottom: z.number(),
  pHBottom: z.number(),
  DepthBottom: z.number(),
  TurbidityBottom: z.number(),
  ChlorophyllSurface: z.number(),
  pHSurface: z.number(),
  SpCondSurface: z.number(),
  SpCondBottom: z.number(),
  FSpercentSurface: z.number(),
  WaterTempBottom: z.number(),
  O2Surface: z.number(),
  O2Bottom: z.number(),
  WaterTempSurface: z.number(),
  SalinitySurface: z.number(),
  DensitySurface: z.number(),
  DensityBottom: z.number(),
  station_name: z.string(),
  time: z.string().datetime(),
  buoyId: z.string(),
});

function validateFetchedRiBuoySummary(summary: unknown[]): summary is FetchedRiSummaryData[] {
  try {
    z.array(ZodFetchedRiSummaryData).parse(summary);
    return true;
  } catch (ex) {
    console.error(ex);
    return false;
  }
}

function formatRiSummaryData(fetchedData: FetchedRiSummaryData) {
  return {
    stationName: fetchedData.station_name,
    time: new Date(fetchedData.time),
    buoyId: fetchedData.buoyId,
    O2PercentSurface: fetchedData.O2PercentSurface,
    O2PercentBottom: fetchedData.O2PercentBottom,
    DepthBottom: fetchedData.DepthBottom,
    depth: fetchedData.depth,
    pHBottom: fetchedData.pHBottom,
    pHSurface: fetchedData.pHSurface,
    SpCondSurface: fetchedData.SpCondSurface,
    SpCondBottom: fetchedData.SpCondBottom,
    WaterTempBottom: fetchedData.WaterTempBottom,
    WaterTempSurface: fetchedData.WaterTempSurface,
    O2Surface: fetchedData.O2Surface,
    O2Bottom: fetchedData.O2Bottom,
    SalinityBottom: fetchedData.SalinityBottom,
    SalinitySurface: fetchedData.SalinitySurface,
    DensitySurface: fetchedData.DensitySurface,
    DensityBottom: fetchedData.DensityBottom,
    TurbidityBottom: fetchedData.TurbidityBottom,
    ChlorophyllSurface: fetchedData.ChlorophyllSurface,
    FSpercentSurface: fetchedData.FSpercentSurface,
  };
}

export type RiBuoySummaryData = ReturnType<typeof formatRiSummaryData>;

export async function fetchRiSummaryData(bustCache = false) {
  const fetchedRiSummaryData = await fetchSummaryData('ri-buoy', bustCache);
  if (validateFetchedRiBuoySummary(fetchedRiSummaryData)) {
    return fetchedRiSummaryData.map(formatRiSummaryData);
  } else {
    throw new Error('Invalid data received when fetching RI Buoy Summary Data.');
  }
}

/**
 * Buoy Summary Mean
 */

export async function fetchRiSummaryMeanData(bustCache = false) {
  const fetchedRiSummaryMeanData = await fetchSummaryMeanData('ri-buoy', bustCache);
  if (validateFetchedRiBuoySummaryMeanData(fetchedRiSummaryMeanData)) {
    return fetchedRiSummaryMeanData.map(formatRiSummaryMeanData).flat();
  } else {
    throw new Error('Invalid data received when fetching RI Buoy Summary Mean Data.');
  }
}

export type FetchedRiSummaryMeanData = {
  O2PercentSurface: number | null;
  O2PercentBottom: number | null;
  depth: number | null;
  SalinityBottom: number | null;
  pHBottom: number | null;
  DepthBottom: number | null;
  TurbidityBottom: number | null;
  ChlorophyllSurface: number | null;
  pHSurface: number | null;
  SpCondSurface: number | null;
  SpCondBottom: number | null;
  FSpercentSurface: number | null;
  WaterTempBottom: number | null;
  O2Surface: number | null;
  O2Bottom: number | null;
  WaterTempSurface: number | null;
  SalinitySurface: number | null;
  DensitySurface: number | null;
  DensityBottom: number | null;
  station_name: string;
  time: string;
  buoyId: string;
};

const ZodFetchedRiSummaryMeanData = z.object({
  O2PercentSurface: z.union([z.number(), z.null()]),
  O2PercentBottom: z.union([z.number(), z.null()]),
  depth: z.union([z.number(), z.null()]),
  SalinityBottom: z.union([z.number(), z.null()]),
  pHBottom: z.union([z.number(), z.null()]),
  DepthBottom: z.union([z.number(), z.null()]),
  TurbidityBottom: z.union([z.number(), z.null()]),
  ChlorophyllSurface: z.union([z.number(), z.null()]),
  pHSurface: z.union([z.number(), z.null()]),
  SpCondSurface: z.union([z.number(), z.null()]),
  SpCondBottom: z.union([z.number(), z.null()]),
  FSpercentSurface: z.union([z.number(), z.null()]),
  WaterTempBottom: z.union([z.number(), z.null()]),
  O2Surface: z.union([z.number(), z.null()]),
  O2Bottom: z.union([z.number(), z.null()]),
  WaterTempSurface: z.union([z.number(), z.null()]),
  SalinitySurface: z.union([z.number(), z.null()]),
  DensitySurface: z.union([z.number(), z.null()]),
  DensityBottom: z.union([z.number(), z.null()]),
  station_name: z.string(),
  time: z.string().datetime(),
  buoyId: z.string(),
});

function validateFetchedRiBuoySummaryMeanData(
  summary: unknown[]
): summary is FetchedRiSummaryData[] {
  try {
    z.array(ZodFetchedRiSummaryMeanData).parse(summary);
    return true;
  } catch (ex) {
    return false;
  }
}

function formatRiSummaryMeanData(fetchedData: FetchedRiSummaryData) {
  const { station_name, time, buoyId } = fetchedData;
  const MEAN_VARS = [
    'O2PercentSurface',
    'O2PercentBottom',
    'DepthBottom',
    'depth',
    'pHBottom',
    'pHSurface',
    'SpCondSurface',
    'SpCondBottom',
    'WaterTempBottom',
    'WaterTempSurface',
    'O2Surface',
    'O2Bottom',
    'SalinityBottom',
    'SalinitySurface',
    'DensitySurface',
    'DensityBottom',
    'TurbidityBottom',
    'ChlorophyllSurface',
    'FSpercentSurface',
  ];
  return MEAN_VARS.map((variableName) => ({
    stationName: station_name,
    time: new Date(time),
    buoyId,
    variable: variableName,
    value: (fetchedData as unknown as Record<string, number | null>)[variableName],
  }));
  /*return {
    stationName: fetchedData.station_name,
    time: new Date(fetchedData.time),
    buoyId: fetchedData.buoyId,
    O2PercentSurface: fetchedData.O2PercentSurface,
    O2PercentBottom: fetchedData.O2PercentBottom,
    DepthBottom: fetchedData.DepthBottom,
    depth: fetchedData.depth,
    pHBottom: fetchedData.pHBottom,
    pHSurface: fetchedData.pHSurface,
    SpCondSurface: fetchedData.SpCondSurface,
    SpCondBottom: fetchedData.SpCondBottom,
    WaterTempBottom: fetchedData.WaterTempBottom,
    WaterTempSurface: fetchedData.WaterTempSurface,
    O2Surface: fetchedData.O2Surface,
    O2Bottom: fetchedData.O2Bottom,
    SalinityBottom: fetchedData.SalinityBottom,
    SalinitySurface: fetchedData.SalinitySurface,
    DensitySurface: fetchedData.DensitySurface,
    DensityBottom: fetchedData.DensityBottom,
    TurbidityBottom: fetchedData.TurbidityBottom,
    ChlorophyllSurface: fetchedData.ChlorophyllSurface,
    FSpercentSurface: fetchedData.FSpercentSurface,
  };*/
}

export type RiBuoySummaryMeanData = ReturnType<typeof formatRiSummaryMeanData>[number];

/**
 * Buoy Coordinates
 */

export type FetchedRiBuoyCoordinate = {
  station_name: string;
  longitude: number;
  latitude: number;
  buoyId: string;
};

const ZodFetchedRiBuoyCoordinate = z.object({
  station_name: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  buoyId: z.string(),
});

function validateFetchedRiBuoyCoordinate(
  coordinates: unknown[]
): coordinates is FetchedRiBuoyCoordinate[] {
  try {
    z.array(ZodFetchedRiBuoyCoordinate).parse(coordinates);
    return true;
  } catch (ex) {
    console.error(ex);
    return false;
  }
}

function formatRiBuoyCoordinate(fetchedData: FetchedRiBuoyCoordinate) {
  return {
    stationName: fetchedData.station_name,
    buoyId: fetchedData.buoyId,
    longitude: fetchedData.longitude,
    latitude: fetchedData.latitude,
  };
}

export type RiBuoyCoordinate = ReturnType<typeof formatRiBuoyCoordinate>;

export async function fetchRiBuoyCoordinates() {
  const fetchedCoordinates = await fetchBuoyCoordinates('ri-buoy');
  if (validateFetchedRiBuoyCoordinate(fetchedCoordinates)) {
    return fetchedCoordinates.map(formatRiBuoyCoordinate);
  } else {
    throw new Error('Invalid data received when fetching RI Buoy Coordinates');
  }
}

export async function fetchRiStationCoordinates(siteName: string) {
  const coordinates = await fetchRiBuoyCoordinates();
  const coordinatesWithSite = coordinates.filter(({ stationName }) => stationName === siteName);
  if (coordinatesWithSite.length > 0) {
    const { longitude, latitude } = coordinatesWithSite[0];
    return [longitude, latitude];
  } else throw new Error(`No RI coordinates found for "${siteName}"`);
}

/**
 * Buoy Variables
 */

/**
 * Note (AM): This might be better as a static list?
 */

export type FetchedRiBuoyVariables = {
  name: string;
  units: string;
};

const ZodFetchedRiBuoyVariables = z.object({
  name: z.string(),
  units: z.union([z.string(), z.null()]),
});

function validateFetchedRiBuoyVariables(
  variables: unknown[]
): variables is FetchedRiBuoyVariables[] {
  try {
    z.array(ZodFetchedRiBuoyVariables).parse(variables);
    return true;
  } catch (ex) {
    console.error(ex);
    return false;
  }
}

function formatRiBuoyVariables(fetchedData: FetchedRiBuoyVariables) {
  return fetchedData;
}

export type RiBuoyVariables = ReturnType<typeof formatRiBuoyVariables>;

export async function fetchRiBuoyVariables() {
  const fetchedVariables = await fetchBuoyVariables('ri-buoy');
  if (validateFetchedRiBuoyVariables(fetchedVariables)) {
    return fetchedVariables.map(formatRiBuoyVariables);
  } else {
    throw new Error('Invalid data received when fetching RI Buoy Variables');
  }
}

// Time Range

export type FetchedRiBuoyTimeRange = {
  min: string;
  max: string;
};

const ZodFetchedRiBuoyTimeRange = z.object({
  min: z.string().datetime(),
  max: z.string().datetime(),
});

function validateFetchedRiBuoyTimeRange(timerange: unknown): timerange is FetchedRiBuoyTimeRange {
  try {
    ZodFetchedRiBuoyTimeRange.parse(timerange);
    return true;
  } catch (ex) {
    console.error(ex);
    return false;
  }
}

export async function fetchRiBuoyTimeRange() {
  const timerange = await fetchBuoyTimeRange('ri-buoy');
  if (validateFetchedRiBuoyTimeRange(timerange)) {
    return { min: new Date(timerange.min), max: new Date(timerange.max) };
  } else {
    throw new Error('Invalid data received when fetching RI Buoy Time Range');
  }
}
