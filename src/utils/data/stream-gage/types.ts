import { z } from "zod";

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

export type StreamGageData = z.infer<typeof StreamGageDataSchema>["value"]["timeSeries"][number];