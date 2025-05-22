"use server";

import { StreamGageDataSchema } from "./types";


/**
 * Fetches stream gage data in Rhode Island for the given number of past days.
 * @param days The number of past days to fetch data for, including today.
 * @returns A list of gage heights for the specified time period.
 * 
 * Written by galenwinsor https://github.com/ridatadiscoverycenter/gage-viewer/blob/main/actions/getStreamGageData.ts
 */
export async function fetchStreamGageData(days: number) {
  // The instantaneous values service from USGS
  // Documentation: https://waterservices.usgs.gov/docs/instantaneous-values/instantaneous-values-details/
  const USGS_URL = `https://waterservices.usgs.gov/nwis/iv/?stateCd=ri&format=json&period=P${days}D`;
  const response = await fetch(USGS_URL);

  const { error, data } = StreamGageDataSchema.safeParse(await response.json());
  if (error) {
    console.error(error);
    throw new Error("An error occured parsing stream gage data!");
  }

  return data.value.timeSeries.filter((timePoint) =>
    timePoint.variable.variableName.includes("Gage height")
  );
}
