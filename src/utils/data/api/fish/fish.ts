import type {
  FetchedFishCoordinate,
  FetchedTemperature,
  FishCoordinate,
  Info,
  Sample,
  SampleBase,
  Temperature,
} from '@/types';
import { getAnimalFromSpecies, getTitleFromSpecies } from '../../shared';
import { erddapAPIGet } from '../erddap';

/**
 * Fetches Coordinate information from ERDDAP.
 * @returns {Promise<FishCoordinate[]>}
 */
export async function fetchCoordinates() {
  const coordinates = await erddapAPIGet<FetchedFishCoordinate[]>('fish/coordinates');
  return coordinates.map(
    (coordinate) =>
      ({
        ...coordinate,
        stationName: coordinate.station_name,
        buoyId: coordinate.station_name,
      }) as FishCoordinate
  );
}

/**
 * Fetches Sample information from ERDDAP and computes an animal name
 * @returns {Promise<Sample[]>}
 */
export async function fetchSamples() {
  const rawSamples = await erddapAPIGet<SampleBase[]>('fish/species');
  return rawSamples.map(
    (sample) => ({ ...sample, animal: getAnimalFromSpecies(sample.species) }) as Sample
  );
}

/**
 * Alias for fetchTemperatures (backwards compatible).
 * @returns {Promise<Temperature[]>}
 */
export async function fetchTemps() {
  return fetchTemperatures();
}

/**
 * Fetches Temperature information from ERDDAP.
 * @returns {Promise<Temperature[]>}
 */
export async function fetchTemperatures() {
  const temperatures = await erddapAPIGet<FetchedTemperature[]>('fish/temps');
  return temperatures.map(
    (temperature) =>
      ({
        ...temperature,
        station: temperature.Station,
        timestamp: new Date(temperature.year_month),
        year: new Date(temperature.year_month).getUTCFullYear(),
        meanTemp: temperature.mean_temp,
        monthlyMean: temperature.monthly_mean,
      }) as Temperature
  );
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

/**
 * Fetch sample data and return a list of unique species in alphabetic order.
 * @returns {Promise<string[]>}
 */
export async function fetchSpecies() {
  const samples = await fetchSamples();
  return Array.from(new Set(samples.map(({ species }) => species)))
    .sort()
    .map((species) => getTitleFromSpecies(species))
    .map((species) => ({ value: species, label: getTitleFromSpecies(species) }));
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
