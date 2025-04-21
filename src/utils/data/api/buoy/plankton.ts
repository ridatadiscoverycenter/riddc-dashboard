import { z } from 'zod';

import { fetchBuoyData, fetchBuoyCoordinates } from './buoy';

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
    return planktonData.data;
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

function validateFetchedMaBuoyCoordinate(
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
  if (validateFetchedMaBuoyCoordinate(fetchedCoordinates)) {
    return fetchedCoordinates.map(formatBuoyCoordinate);
  } else {
    throw new Error('Invalid data received when fetching MA Buoy Coordinates');
  }
}
