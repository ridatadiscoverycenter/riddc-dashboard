import { z } from 'zod';

import { getAnimalFromSpecies } from '../../shared';
import { erddapAPIGet } from '../erddap';
import type { FetchedFishCoordinate, FetchedTemperature, Info, SampleBase } from '@/types';

/**
 * Fetches Coordinate information from ERDDAP.
 * @returns {Promise<FishCoordinate[]>}
 */
const ZodFetchedFishCoordinate = z.object({
  station_name: z.any(),
  longitude: z.any(),
  latitude: z.any(),
});

function validateFetchedFishCoordinate(
  coordinates: unknown[]
): coordinates is FetchedFishCoordinate[] {
  try {
    z.array(ZodFetchedFishCoordinate).parse(coordinates);
    return true;
  } catch (ex) {
    console.error(ex)
    return false;
  }
}
function formatFishCoordinate(fetchedData: FetchedFishCoordinate) {
  return {
    stationName: fetchedData.station_name,
    latitude: fetchedData.latitude,
    longitude: fetchedData.longitude,
    buoyId: fetchedData.station_name,
  };
}

export type FishCoordinate = ReturnType<typeof formatFishCoordinate>;

export async function fetchCoordinates() {
  const fetchedCoordinates = await erddapAPIGet<unknown[]>('fish/coordinates');
  if (validateFetchedFishCoordinate(fetchedCoordinates)) {
    return fetchedCoordinates.map(formatFishCoordinate);
  } else {
    throw new Error('Invalid data received when fetching fish coordinates');
  }
}

/**
 * Fetches Sample information from ERDDAP and computes an animal name
 * @returns {Promise<Sample[]>}
 */
const ZodFetchedSamples = z.array(
  z.object({
    species: z.string(),
    title: z.string(),
    station: z.string(),
    year: z.number(),
    abun: z.union([z.number(), z.null()]),
  })
);

function validateFetchedSamples(sampleData: unknown): sampleData is { data: SampleBase[] } {
  try {
    ZodFetchedSamples.parse(sampleData);
    return true;
  } catch (ex) {
    console.error(ex)
    return false;
  }
}

function formatFishSamples(sampleData: SampleBase) {
  return {
    species: sampleData.species,
    title: sampleData.title,
    station: sampleData.station,
    year: sampleData.year,
    abun: sampleData.abun || undefined,
    animal: getAnimalFromSpecies(sampleData.species),
  };
}

export type Sample = ReturnType<typeof formatFishSamples>;

export async function fetchSamples() {
  const rawSamples = await erddapAPIGet<SampleBase[]>('fish/species');
  if (validateFetchedSamples(rawSamples)) {
    return rawSamples.map(formatFishSamples);
  } else {
    throw new Error('Invalid data received when fetching Fish Sample Data');
  }
}

/**
 * Fetches Temperature information from ERDDAP.
 * @returns {Promise<Temperature[]>}
 */
const LEVELS = ['Surface', 'Bottom'] as const;
const ZodFetchedTemperature = z.object({
  level: z.enum(LEVELS),
  month: z.number(),
  delta: z.union([z.number(), z.null()]),
  Station: z.string(),
});

function validateFetchedTemperature(temperatures: unknown[]): temperatures is FetchedTemperature[] {
  try {
    z.array(ZodFetchedTemperature).parse(temperatures);
    return true;
  } catch (ex) {
    console.error(ex)
    return false;
  }
}
function formatTemperature(fetchedData: FetchedTemperature) {
  return {
    station: fetchedData.Station,
    timestamp: new Date(fetchedData.year_month),
    year: new Date(fetchedData.year_month).getUTCFullYear(),
    delta: fetchedData.delta,
    avg: fetchedData.delta,
    level: fetchedData.level,
  };
}

export type Temperature = ReturnType<typeof formatTemperature>;

export async function fetchTemperatures() {
  const fetchedTemperatures = await erddapAPIGet<FetchedTemperature[]>('fish/temps');
  if (validateFetchedTemperature(fetchedTemperatures)) {
    return fetchedTemperatures.map(formatTemperature);
  } else {
    throw new Error('Invalid data received when fetching water temperature');
  }
}

export async function fetchInfo(species: string) {
  const speciesInfo = await erddapAPIGet<Info>(`/fish/info/${species}`);
  return speciesInfo;
}

/**
 * Fetches coordinate, sample, and temperature information.
 * @returns {Promise<{coordinates: Coordinate[], samples: Sample[], temperatures: Temperature[]}>}
 */
export async function fetchBaseData() {
  const [coordinates, samples, temperatures] = await Promise.all([
    fetchCoordinates(),
    fetchSamples(),
    fetchTemperatures(),
  ]);
  return {
    coordinates,
    samples,
    temperatures,
  };
}

export const FISH_TITLES = [
  'Alewife',
  'Atlantic Herring',
  'Bluefish',
  'Butterfish',
  'Cancer Crab',
  'Cunner',
  'Fourspot Flounder',
  'Horseshoe Crab',
  'Lady Crab',
  'Little Skate',
  'Lobster',
  'Long Finned_squid',
  'Longhorn Sculpin',
  'Northern Searobin',
  'Red Hake',
  'Scup',
  'Starfish',
  'Silver Hake',
  'Spider Crabs',
  'Striped Searobin',
  'Summer Flounder',
  'Tautog',
  'Weakfish',
  'Windowpane Flounder',
  'Winter Flounder',
];

export const FISH_SPECIES = [
  'Alosa_spp',
  'Atlantic_herring',
  'Bluefish',
  'Butterfish',
  'Cancer_crab',
  'Cunner',
  'Fourspot_flounder',
  'Horseshoe_crab',
  'Lady_crab',
  'Little_skate',
  'Lobster',
  'Long_finned_Squid',
  'Longhorned_sculpin',
  'Northern_searobin',
  'Red_Hake',
  'Scup',
  'Sea_star',
  'Silver_hake',
  'Spider_crab',
  'Striped_searobin',
  'Summer_flounder',
  'Tautog',
  'Weakfish',
  'Windowpane',
  'Winter_flounder',
] as const;

export type FishVariable = (typeof FISH_SPECIES)[number];
