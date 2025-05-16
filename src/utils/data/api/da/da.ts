import { erddapAPIGet } from '../erddap';
import {
  DomoicAcidSample,
  formatDomoicAcidCoordinate,
  formatDomoicAcidSample,
  validateFetchedDomoicAcidCoordiate,
  validateFetchedDomoicAcidSamples,
} from './types';

export async function fetchDomoicAcidCoordinates() {
  const coordinates = await erddapAPIGet('da/coordinates');
  if (validateFetchedDomoicAcidCoordiate(coordinates)) {
    return coordinates.map(formatDomoicAcidCoordinate);
  } else {
    throw new Error('Invalid Data Received when fetching Domoic Acid Coordinates');
  }
}

export async function fetchDomoicAcidSample() {
  const fetchedSamples = await erddapAPIGet('da/samples');
  if (validateFetchedDomoicAcidSamples(fetchedSamples)) {
    return fetchedSamples.map(formatDomoicAcidSample);
  } else {
    throw new Error('Invalid Data Received when fetching Domoic Acid Samples');
  }
}

export async function getDatesFromSamples(samples: DomoicAcidSample[]) {
  return Array.from(new Set(samples.map(({ date }) => date))).sort();
}
