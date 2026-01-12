import { z } from 'zod';

/**
 * Domoic Acid Coordinates
 */

const ZodDomoicAcidCoordiate = z.object({
  longitude: z.number(),
  latitude: z.number(),
  station_name: z.string(),
});

export type FetchedDomoicAcidCoordiate = z.infer<typeof ZodDomoicAcidCoordiate>;

export function formatDomoicAcidCoordinate({
  longitude,
  latitude,
  station_name,
}: FetchedDomoicAcidCoordiate) {
  return {
    longitude,
    latitude,
    stationName: station_name,
  };
}

export type DomoicAcidCoordinate = ReturnType<typeof formatDomoicAcidCoordinate>;

export function validateFetchedDomoicAcidCoordiate(
  coordinates: unknown
): coordinates is FetchedDomoicAcidCoordiate[] {
  try {
    z.array(ZodDomoicAcidCoordiate).parse(coordinates);
    return true;
  } catch (ex) {
    console.error(ex);
    return false;
  }
}

/**
 * Domoic Acid Samples
 */

const ZodDomoicAcidSample = z.object({
  pDA: z.number(),
  normDA: z.number(),
  station_name: z.string(),
  date: z.string(),
});

export type FetchedDomoicAcidSample = z.infer<typeof ZodDomoicAcidSample>;

export function formatDomoicAcidSample({
  station_name,
  date,
  pDA,
  normDA,
}: FetchedDomoicAcidSample) {
  return {
    stationName: station_name,
    pDA,
    normDA,
    date: new Date(date),
  };
}

export type DomoicAcidSample = ReturnType<typeof formatDomoicAcidSample>;

export function validateFetchedDomoicAcidSamples(
  samples: unknown
): samples is FetchedDomoicAcidSample[] {
  try {
    z.array(ZodDomoicAcidSample).parse(samples);
    return true;
  } catch (ex) {
    console.error(ex);
    return false;
  }
}
