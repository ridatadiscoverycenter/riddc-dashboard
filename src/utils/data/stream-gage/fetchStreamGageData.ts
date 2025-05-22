import { z } from 'zod';

export const StreamGageDataSchema = z.object({
  value: z.object({
    timeSeries: z.array(
      z.object({
        sourceInfo: z.object({
          siteName: z.string(),
          geoLocation: z.object({
            geogLocation: z.object({
              latitude: z.number(),
              longitude: z.number(),
            }),
          }),
        }),
        variable: z.object({
          variableName: z.string(),
        }),
        values: z.array(
          z.object({
            value: z.array(
              z.object({
                value: z.string(),
                dateTime: z.string(),
              })
            ),
          })
        ),
      })
    ),
  }),
});


/**
 * Fetches stream gage data in Rhode Island for the given number of past days.
 * @param days The number of past days to fetch data for, including today.
 * @returns A list of gage heights for the specified time period.
 *
 * Written by galenwinsor https://github.com/ridatadiscoverycenter/gage-viewer/blob/main/actions/getStreamGageData.ts
 */
export async function fetchStreamGageData(days: number, variable: string) {
  // The instantaneous values service from USGS
  // Documentation: https://waterservices.usgs.gov/docs/instantaneous-values/instantaneous-values-details/
  const USGS_URL = `https://waterservices.usgs.gov/nwis/iv/?stateCd=ri&format=json&period=P${days}D`;
  const response = await fetch(USGS_URL);

  const { error, data } = StreamGageDataSchema.safeParse(await response.json());
  if (error) {
    console.error(error);
    throw new Error('An error occured parsing stream gage data!');
  }

  return formatFetchedStreamGageData(data, variable);
}

function formatFetchedStreamGageData(
  fetchedData: z.infer<typeof StreamGageDataSchema>,
  variableName: string
) {
  const filteredData = fetchedData.value.timeSeries.filter((timePoint) =>
    timePoint.variable.variableName.toLowerCase().includes(variableName.toLowerCase())
  );

  return filteredData.map((v) => {
    const { siteName, geoLocation: { geogLocation: { longitude, latitude } } } = v.sourceInfo;
    const { variableName } = v.variable;
    const values = v.values.flat().map(({ value }) => value).flat().map(({ value, dateTime }) => ({ value: Number(value), dateTime: new Date(dateTime) }));
    return {
      siteName,
      longitude,
      latitude,
      variableName,
      values,
    };
  });
}

export type StreamGageData = ReturnType<typeof formatFetchedStreamGageData>;
