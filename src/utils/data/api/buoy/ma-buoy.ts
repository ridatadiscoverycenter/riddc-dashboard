import { z } from 'zod';
import {
  fetchSummaryData,
  fetchBuoyData,
  fetchBuoyCoordinates,
  fetchBuoyVariables,
  fetchBuoyTimeRange,
} from './buoy';

export const MA_QUALIFIERS = [
  'ChlorophyllQualifiersSurface',
  'DepthQualifiersBottom',
  'DepthQualifiersSurface',
  'NitrateNQualifiersSurface',
  'O2PercentQualifiersBottom',
  'O2QualifiersBottom',
  'O2QualifiersSurface',
  'pHQualifiersBottom',
  'pHQualifiersSurface',
  'PhycoerythrinQualifiersBottom',
  'PhycoerythrinQualifiersSurface',
  'SalinityQualifiersBottom',
  'SalinityQualifiersSurface',
  'SpCondQualifiersBottom',
  'SpCondQualifiersSurface',
  'WaterTempQualifiersBottom',
  'WaterTempQualifiersSurface',
];
export const MA_BUOY_ERDDAP_VARIABLES = [
  'ChlorophyllBottom',
  'ChlorophyllSurface',
  'depth',
  'DepthBottom',
  'DepthSurface',
  'NitrateNSurface',
  'O2Bottom',
  'O2PercentBottom',
  'O2PercentSurface',
  'O2Surface',
  'pHBottom',
  'pHSurface',
  'PhycoerythrinBottom',
  'PhycoerythrinSurface',
  'SalinityBottom',
  'SalinitySurface',
  'SpCondBottom',
  'SpCondSurface',
  'WaterTempBottom',
  'WaterTempSurface',
] as const;
export const MA_BUOY_VIEWER_VARIABLES = [
  'ChlorophyllBottom',
  'ChlorophyllSurface',
  'depth',
  'DepthBottom',
  'DepthSurface',
  'NitrateNSurface',
  'O2Bottom',
  'O2PercentBottom',
  'O2PercentSurface',
  'O2Surface',
  'pHBottom',
  'pHSurface',
  'PhycoerythrinBottom',
  'PhycoerythrinSurface',
  'SalinityBottom',
  'SalinitySurface',
  'SpCondBottom',
  'SpCondSurface',
  'WaterTempBottom',
  'WaterTempSurface',
] as const;

export type MaQualifiers = (typeof MA_QUALIFIERS)[number];
export type MaBuoyViewerVariable = (typeof MA_BUOY_VIEWER_VARIABLES)[number];
export type MaBuoyErddapVariable = (typeof MA_BUOY_ERDDAP_VARIABLES)[number];

const VARIABLE_PAIRS: { viewer: MaBuoyViewerVariable; erddap: MaBuoyErddapVariable }[] = [
  { viewer: 'depth', erddap: 'depth' },
  { viewer: 'DepthSurface', erddap: 'DepthSurface' },
  { viewer: 'pHBottom', erddap: 'pHBottom' },
  { viewer: 'ChlorophyllBottom', erddap: 'ChlorophyllBottom' },
  { viewer: 'ChlorophyllSurface', erddap: 'ChlorophyllSurface' },
  { viewer: 'NitrateNSurface', erddap: 'NitrateNSurface' },
  { viewer: 'O2Bottom', erddap: 'O2Bottom' },
  { viewer: 'O2PercentBottom', erddap: 'O2PercentBottom' },
  { viewer: 'O2PercentSurface', erddap: 'O2PercentSurface' },
  { viewer: 'O2Surface', erddap: 'O2Surface' },
  { viewer: 'pHSurface', erddap: 'pHSurface' },
  { viewer: 'PhycoerythrinBottom', erddap: 'PhycoerythrinBottom' },
  { viewer: 'PhycoerythrinSurface', erddap: 'PhycoerythrinSurface' },
  { viewer: 'SalinityBottom', erddap: 'SalinityBottom' },
  { viewer: 'SalinitySurface', erddap: 'SalinitySurface' },
  { viewer: 'SpCondBottom', erddap: 'SpCondBottom' },
  { viewer: 'SpCondSurface', erddap: 'SpCondSurface' },
  { viewer: 'WaterTempBottom', erddap: 'WaterTempBottom' },
  { viewer: 'WaterTempSurface', erddap: 'WaterTempSurface' },
] as const;

const QUALIFIER_PAIRS: { variable: MaBuoyErddapVariable; qualifier: MaQualifiers }[] = [
  { variable: 'ChlorophyllSurface', qualifier: 'ChlorophyllQualifiersSurface' },
  { variable: 'DepthSurface', qualifier: 'DepthQualifiersSurface' },
  { variable: 'NitrateNSurface', qualifier: 'NitrateNQualifiersSurface' },
  { variable: 'O2PercentBottom', qualifier: 'O2PercentQualifiersBottom' },
  { variable: 'O2Bottom', qualifier: 'O2QualifiersBottom' },
  { variable: 'O2Surface', qualifier: 'O2QualifiersSurface' },
  { variable: 'pHBottom', qualifier: 'pHQualifiersBottom' },
  { variable: 'pHSurface', qualifier: 'pHQualifiersSurface' },
  { variable: 'PhycoerythrinBottom', qualifier: 'PhycoerythrinQualifiersBottom' },
  { variable: 'PhycoerythrinSurface', qualifier: 'PhycoerythrinQualifiersSurface' },
  { variable: 'SalinityBottom', qualifier: 'SalinityQualifiersBottom' },
  { variable: 'SalinitySurface', qualifier: 'SalinityQualifiersSurface' },
  { variable: 'SpCondBottom', qualifier: 'SpCondQualifiersBottom' },
  { variable: 'SpCondSurface', qualifier: 'SpCondQualifiersSurface' },
  { variable: 'WaterTempBottom', qualifier: 'WaterTempQualifiersBottom' },
  { variable: 'WaterTempSurface', qualifier: 'WaterTempQualifiersSurface' },
];

function erddapToViewer(v: MaBuoyErddapVariable) {
  const foundPair = VARIABLE_PAIRS.find((pair) => pair.erddap === v);
  if (foundPair !== undefined) return foundPair.viewer;
  throw new Error(`No viewer variable for erddap variable "${v}"`);
}

function viewerToErddap(v: MaBuoyViewerVariable) {
  const foundPair = VARIABLE_PAIRS.find((pair) => pair.viewer === v);
  if (foundPair !== undefined) return foundPair.erddap;
  throw new Error(`No viewer variable for erddap variable "${v}"`);
}

function variableToQualifier(v: MaBuoyErddapVariable) {
  const foundPair = QUALIFIER_PAIRS.find((pair) => pair.variable === v);
  if (foundPair !== undefined) return foundPair.qualifier;
}

export const MA_VARIABLE_CONVERTER = {
  erddapToViewer,
  viewerToErddap,
  variableToQualifier,
};

/**
 * Buoy Data
 */

type FetchedMaBuoyData = {
  variable: MaBuoyErddapVariable;
  value: number | null;
  station_name: string;
  time: string;
  units: string;
};

const ZodFetchedMaBuoyData = z.object({
  data: z.array(
    z.object({
      variable: z.enum(MA_BUOY_ERDDAP_VARIABLES),
      value: z.union([z.number(), z.null()]),
      station_name: z.string(),
      time: z.string().datetime(),
      units: z.string(),
    })
  ),
});

function validateFetchedMaBuoyData(buoyData: unknown): buoyData is { data: FetchedMaBuoyData[] } {
  try {
    ZodFetchedMaBuoyData.parse(buoyData);
    return true;
  } catch (ex) {
    return false;
  }
}

function formatMaBuoyData(buoyData: FetchedMaBuoyData) {
  return {
    variable: MA_VARIABLE_CONVERTER.erddapToViewer(buoyData.variable),
    value: buoyData.value || undefined,
    stationName: buoyData.station_name,
    time: new Date(buoyData.time),
    units: buoyData.units,
  };
}

export type MaBuoyData = ReturnType<typeof formatMaBuoyData>;

export async function fetchMaBuoyData(
  ids: string[],
  vars: MaBuoyViewerVariable[],
  startDate: Date,
  endDate: Date
) {
  const fetchedMaBuoyData = await fetchBuoyData(
    'ma-buoy',
    ids,
    vars.map(viewerToErddap),
    startDate,
    endDate
  );
  if (validateFetchedMaBuoyData(fetchedMaBuoyData)) {
    return fetchedMaBuoyData.data.map(formatMaBuoyData);
  } else {
    throw new Error('Invalid data received when fetching MA Buoy Summary Data.');
  }
}

/**
 * Buoy Summary Data
 */

export type FetchedMaSummaryData = {
  depth: number;
  DepthSurface: number;
  SalinityBottom: number;
  pHBottom: number;
  ChlorophyllBottom: number;
  ChlorophyllQualifiersSurface: number;
  ChlorophyllSurface: number;
  DepthQualifiersBottom: number;
  DepthQualifiersSurface: number;
  NitrateNQualifiersSurface: number;
  NitrateNSurface: number;
  O2Bottom: number;
  O2PercentBottom: number;
  O2PercentQualifiersBottom: number;
  O2PercentSurface: number;
  O2QualifiersBottom: number;
  O2QualifiersSurface: number;
  O2Surface: number;
  pHQualifiersBottom: number;
  pHQualifiersSurface: number;
  pHSurface: number;
  PhycoerythrinBottom: number;
  PhycoerythrinQualifiersBottom: number;
  PhycoerythrinQualifiersSurface: number;
  PhycoerythrinSurface: number;
  station_name: string;
  SalinityQualifiersBottom: number;
  SalinityQualifiersSurface: number;
  SalinitySurface: number;
  SpCondBottom: number;
  SpCondQualifiersBottom: number;
  SpCondQualifiersSurface: number;
  SpCondSurface: number;
  time: string;
  WaterTempBottom: number;
  WaterTempQualifiersBottom: number;
  WaterTempQualifiersSurface: number;
  WaterTempSurface: number;
  buoyId: string;
};

const ZodFetchedMaSummaryData = z.object({
  depth: z.number(),
  DepthSurface: z.number(),
  SalinityBottom: z.number(),
  pHBottom: z.number(),
  ChlorophyllBottom: z.number(),
  ChlorophyllQualifiersSurface: z.number(),
  ChlorophyllSurface: z.number(),
  DepthQualifiersBottom: z.number(),
  DepthQualifiersSurface: z.number(),
  NitrateNQualifiersSurface: z.number(),
  NitrateNSurface: z.number(),
  O2Bottom: z.number(),
  O2PercentBottom: z.number(),
  O2PercentQualifiersBottom: z.number(),
  O2PercentSurface: z.number(),
  O2QualifiersBottom: z.number(),
  O2QualifiersSurface: z.number(),
  O2Surface: z.number(),
  pHQualifiersBottom: z.number(),
  pHQualifiersSurface: z.number(),
  pHSurface: z.number(),
  PhycoerythrinBottom: z.number(),
  PhycoerythrinQualifiersBottom: z.number(),
  PhycoerythrinQualifiersSurface: z.number(),
  PhycoerythrinSurface: z.number(),
  SalinityQualifiersBottom: z.number(),
  SalinityQualifiersSurface: z.number(),
  SalinitySurface: z.number(),
  SpCondBottom: z.number(),
  SpCondQualifiersBottom: z.number(),
  SpCondQualifiersSurface: z.number(),
  SpCondSurface: z.number(),
  station_name: z.string(),
  time: z.string().datetime(),
  WaterTempBottom: z.number(),
  WaterTempQualifiersBottom: z.number(),
  WaterTempQualifiersSurface: z.number(),
  WaterTempSurface: z.number(),
  buoyId: z.string(),
});

function validateFetchedMaBuoySummary(summary: unknown[]): summary is FetchedMaSummaryData[] {
  try {
    z.array(ZodFetchedMaSummaryData).parse(summary);
    return true;
  } catch (ex) {
    return false;
  }
}

function formatMaSummaryData(fetchedData: FetchedMaSummaryData) {
  return {
    stationName: fetchedData.station_name,
    time: new Date(fetchedData.time),
    buoyId: fetchedData.buoyId,
    depth: fetchedData.depth,
    DepthSurface: fetchedData.DepthSurface,
    pHBottom: fetchedData.pHBottom,
    ChlorophyllBottom: fetchedData.ChlorophyllBottom,
    ChlorophyllQualifiersSurface: fetchedData.ChlorophyllQualifiersSurface,
    ChlorophyllSurface: fetchedData.ChlorophyllSurface,
    DepthQualifiersBottom: fetchedData.DepthQualifiersBottom,
    DepthQualifiersSurface: fetchedData.DepthQualifiersSurface,
    NitrateNQualifiersSurface: fetchedData.NitrateNQualifiersSurface,
    NitrateNSurface: fetchedData.NitrateNSurface,
    O2Bottom: fetchedData.O2Bottom,
    O2PercentBottom: fetchedData.O2PercentBottom,
    O2PercentQualifiersBottom: fetchedData.O2PercentQualifiersBottom,
    O2PercentSurface: fetchedData.O2PercentSurface,
    O2QualifiersBottom: fetchedData.O2QualifiersBottom,
    O2QualifiersSurface: fetchedData.O2QualifiersSurface,
    O2Surface: fetchedData.O2Surface,
    pHQualifiersBottom: fetchedData.pHQualifiersBottom,
    pHQualifiersSurface: fetchedData.pHQualifiersSurface,
    'pHSurface (SU)': fetchedData.pHSurface,
    'PhycoerythrinBottom (RFU)': fetchedData.PhycoerythrinBottom,
    PhycoerythrinQualifiersBottom: fetchedData.PhycoerythrinQualifiersBottom,
    PhycoerythrinQualifiersSurface: fetchedData.PhycoerythrinQualifiersSurface,
    'PhycoerythrinSurface (RFU)': fetchedData.PhycoerythrinSurface,
    'SalinityBottom (PSU)': fetchedData.SalinityBottom,
    SalinityQualifiersBottom: fetchedData.SalinityQualifiersBottom,
    SalinityQualifiersSurface: fetchedData.SalinityQualifiersSurface,
    'SalinitySurface (PSU)': fetchedData.SalinitySurface,
    'SpCondBottom (mS cm-1)': fetchedData.SpCondBottom,
    SpCondQualifiersBottom: fetchedData.SpCondQualifiersBottom,
    SpCondQualifiersSurface: fetchedData.SpCondQualifiersSurface,
    'SpCondSurface (mS cm-1)': fetchedData.SpCondSurface,
    'WaterTempBottom (°C)': fetchedData.WaterTempBottom,
    WaterTempQualifiersBottom: fetchedData.WaterTempQualifiersBottom,
    WaterTempQualifiersSurface: fetchedData.WaterTempQualifiersSurface,
    'WaterTempSurface (°C)': fetchedData.WaterTempSurface,
  };
}

export type MaBuoySummaryData = ReturnType<typeof formatMaSummaryData>;

export async function fetchMaSummaryData(bustCache = false) {
  const fetchedMaSummaryData = await fetchSummaryData('ma-buoy', bustCache);
  if (validateFetchedMaBuoySummary(fetchedMaSummaryData)) {
    return fetchedMaSummaryData.map(formatMaSummaryData);
  } else {
    throw new Error('Invalid data received when fetching MA Buoy Summary Data.(359)');
  }
}

/**
 * Buoy Coordinates
 */

export type FetchedMaBuoyCoordinate = {
  station_name: string;
  longitude: number;
  latitude: number;
  buoyId: string;
};

const ZodFetchedMaBuoyCoordinate = z.object({
  station_name: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  buoyId: z.string(),
});

function validateFetchedMaBuoyCoordinate(
  coordinates: unknown[]
): coordinates is FetchedMaBuoyCoordinate[] {
  try {
    z.array(ZodFetchedMaBuoyCoordinate).parse(coordinates);
    return true;
  } catch (ex) {
    return false;
  }
}

function formatMaBuoyCoordinate(fetchedData: FetchedMaBuoyCoordinate) {
  return {
    stationName: fetchedData.station_name,
    buoyId: fetchedData.buoyId,
    longitude: fetchedData.longitude,
    latitude: fetchedData.latitude,
  };
}

export type MaBuoyCoordinate = ReturnType<typeof formatMaBuoyCoordinate>;

export async function fetchMaBuoyCoordinates() {
  const fetchedCoordinates = await fetchBuoyCoordinates('ma-buoy');
  if (validateFetchedMaBuoyCoordinate(fetchedCoordinates)) {
    return fetchedCoordinates.map(formatMaBuoyCoordinate);
  } else {
    throw new Error('Invalid data received when fetching MA Buoy Coordinates');
  }
}

export async function fetchMaStationCoordinates(siteName: string) {
  const coordinates = await fetchMaBuoyCoordinates();
  const coordinatesWithSite = coordinates.filter(({ stationName }) => stationName === siteName);
  if (coordinatesWithSite.length > 0) {
    const { longitude, latitude } = coordinatesWithSite[0];
    return [longitude, latitude];
  } else throw new Error(`No MA coordinates found for "${siteName}"`);
}

/**
 * Buoy Variables
 */

/**
 * Note (AM): This might be better as a static list?
 */

export type FetchedMaBuoyVariables = {
  name: string;
  units: string;
};

const ZodFetchedMaBuoyVariables = z.object({
  name: z.string(),
  units: z.union([z.string(), z.null()]),
});

function validateFetchedMaBuoyVariables(
  variables: unknown[]
): variables is FetchedMaBuoyVariables[] {
  try {
    z.array(ZodFetchedMaBuoyVariables).parse(variables);
    return true;
  } catch (ex) {
    return false;
  }
}

function formatMaBuoyVariables(fetchedData: FetchedMaBuoyVariables) {
  return fetchedData;
}

export type MaBuoyVariables = ReturnType<typeof formatMaBuoyVariables>;

export async function fetchMaBuoyVariables() {
  const fetchedVariables = await fetchBuoyVariables('ma-buoy');
  if (validateFetchedMaBuoyVariables(fetchedVariables)) {
    return fetchedVariables.map(formatMaBuoyVariables);
  } else {
    throw new Error('Invalid data received when fetching MA Buoy Variables');
  }
}

// Time Range

export type FetchedMaBuoyTimeRange = {
  min: string;
  max: string;
};

const ZodFetchedMaBuoyTimeRange = z.object({
  min: z.string().datetime(),
  max: z.string().datetime(),
});

function validateFetchedMaBuoyTimeRange(timerange: unknown): timerange is FetchedMaBuoyTimeRange {
  try {
    ZodFetchedMaBuoyTimeRange.parse(timerange);
    return true;
  } catch (ex) {
    return false;
  }
}

export async function fetchMaBuoyTimeRange() {
  const timerange = await fetchBuoyTimeRange('ma-buoy');
  if (validateFetchedMaBuoyTimeRange(timerange)) {
    return { min: new Date(timerange.min), max: new Date(timerange.max) };
  } else {
    throw new Error('Invalid data received when fetching MA Buoy Time Range');
  }
}
