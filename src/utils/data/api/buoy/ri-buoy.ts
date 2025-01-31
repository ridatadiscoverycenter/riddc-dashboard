import { z } from 'zod';
import {
  fetchSummaryData,
  fetchBuoyData,
  fetchBuoyCoordinates,
  fetchBuoyVariables,
  fetchBuoyTimeRange,
} from './buoy';

export const RI_BUOY_ERDDAP_VARIABLES = [
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
export const RI_BUOY_VIEWER_VARIABLES = [
  'oxygenPercentSurface',
  'oxygenPercentBottom',
  'depthBottom',
  'depthSurface',
  'pHBottom',
  'pHSurface',
  'specificConductanceSurface',
  'specificConductanceBottom',
  'temperatureBottom',
  'temperatureSurface',
  'oxygenSurface',
  'oxygenBottom',
  'salinityBottom',
  'salinitySurface',
  'densitySurface',
  'densityBottom',
  'turbidity',
  'chlorophyll',
  'totalFluorescence',
] as const;

export type RiBuoyViewerVariable = (typeof RI_BUOY_VIEWER_VARIABLES)[number];
export type RiBuoyErddapVariable = (typeof RI_BUOY_ERDDAP_VARIABLES)[number];

const VARIABLE_PAIRS: { viewer: RiBuoyViewerVariable; erddap: RiBuoyErddapVariable }[] = [
  { viewer: 'oxygenPercentSurface', erddap: 'O2PercentSurface' },
  { viewer: 'oxygenPercentBottom', erddap: 'O2PercentBottom' },
  { viewer: 'depthBottom', erddap: 'DepthBottom' },
  { viewer: 'depthSurface', erddap: 'depth' },
  { viewer: 'pHBottom', erddap: 'pHBottom' },
  { viewer: 'pHSurface', erddap: 'pHSurface' },
  { viewer: 'specificConductanceSurface', erddap: 'SpCondSurface' },
  { viewer: 'specificConductanceBottom', erddap: 'SpCondBottom' },
  { viewer: 'temperatureBottom', erddap: 'WaterTempBottom' },
  { viewer: 'temperatureSurface', erddap: 'WaterTempSurface' },
  { viewer: 'oxygenSurface', erddap: 'O2Surface' },
  { viewer: 'oxygenBottom', erddap: 'O2Bottom' },
  { viewer: 'salinityBottom', erddap: 'SalinityBottom' },
  { viewer: 'salinitySurface', erddap: 'SalinitySurface' },
  { viewer: 'densitySurface', erddap: 'DensitySurface' },
  { viewer: 'densityBottom', erddap: 'DensityBottom' },
  { viewer: 'turbidity', erddap: 'TurbidityBottom' },
  { viewer: 'chlorophyll', erddap: 'ChlorophyllSurface' },
  { viewer: 'totalFluorescence', erddap: 'FSpercentSurface' },
] as const;

function erddapToViewer(v: RiBuoyErddapVariable) {
  const foundPair = VARIABLE_PAIRS.find((pair) => pair.erddap === v);
  if (foundPair !== undefined) return foundPair.viewer;
  throw new Error(`No viewer variable for erddap variable "${v}"`);
}

function viewerToErddap(v: RiBuoyViewerVariable) {
  const foundPair = VARIABLE_PAIRS.find((pair) => pair.viewer === v);
  if (foundPair !== undefined) return foundPair.erddap;
  throw new Error(`No viewer variable for erddap variable "${v}"`);
}

export const RI_VARIABLE_CONVERTER = {
  erddapToViewer,
  viewerToErddap,
};

/**
 * Buoy Data
 */

type FetchedRiBuoyData = {
  variable: RiBuoyErddapVariable;
  value: number | null;
  station_name: string;
  time: string;
  units: string;
};

const ZodFetchedRiBuoyData = z.object({
  data: z.array(
    z.object({
      variable: z.enum(RI_BUOY_ERDDAP_VARIABLES),
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
    return false;
  }
}

function formatRiBuoyData(buoyData: FetchedRiBuoyData) {
  return {
    variable: RI_VARIABLE_CONVERTER.erddapToViewer(buoyData.variable),
    value: buoyData.value || undefined,
    stationName: buoyData.station_name,
    time: new Date(buoyData.time),
    units: buoyData.units,
  };
}

export type RiBuoyData = ReturnType<typeof formatRiBuoyData>;

export async function fetchRiBuoyData(
  ids: string[],
  vars: RiBuoyViewerVariable[],
  startDate: Date,
  endDate: Date
) {
  const fetchedRiBuoyData = await fetchBuoyData(
    'ri-buoy',
    ids,
    vars.map(viewerToErddap),
    startDate,
    endDate
  );
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
    return false;
  }
}

function formatRiSummaryData(fetchedData: FetchedRiSummaryData) {
  return {
    stationName: fetchedData.station_name,
    time: new Date(fetchedData.time),
    buoyId: fetchedData.buoyId,
    oxygenPercentSurface: fetchedData.O2PercentSurface,
    oxygenPercentBottom: fetchedData.O2PercentBottom,
    depthBottom: fetchedData.DepthBottom,
    depthSurface: fetchedData.depth,
    pHBottom: fetchedData.pHBottom,
    pHSurface: fetchedData.pHSurface,
    specificConductanceSurface: fetchedData.SpCondSurface,
    specificConductanceBottom: fetchedData.SpCondBottom,
    temperatureBottom: fetchedData.WaterTempBottom,
    temperatureSurface: fetchedData.WaterTempSurface,
    oxygenSurface: fetchedData.O2Surface,
    oxygenBottom: fetchedData.O2Bottom,
    salinityBottom: fetchedData.SalinityBottom,
    salinitySurface: fetchedData.SalinitySurface,
    densitySurface: fetchedData.DensitySurface,
    densityBottom: fetchedData.DensityBottom,
    turbidity: fetchedData.TurbidityBottom,
    chlorophyll: fetchedData.ChlorophyllSurface,
    totalFluorescence: fetchedData.FSpercentSurface,
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
