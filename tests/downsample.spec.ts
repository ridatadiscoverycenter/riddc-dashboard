import { readFileSync } from 'fs';
import { test, expect } from '@playwright/test';

import {
  fetchStreamGageData,
  downsampleStreamGageData,
  StreamGageData,
} from '@/utils/data/stream-gage';

test('fetchStreamGageData', async () => {
  // Valid under normal conditions
  const streamGageData = await fetchStreamGageData(1, 'Gage height');
  await expect(streamGageData).toBeInstanceOf(Array);
  await expect(streamGageData.length).toBeGreaterThan(0);
  await expect(streamGageData[0]).toBeInstanceOf(Object);
  await expect(Object.keys(streamGageData[0]).sort()).toMatchObject(
    ['siteName', 'longitude', 'latitude', 'variableName', 'values'].sort()
  );
});

test('downsample Stream Gage', async () => {
  const rawStreamGageData = JSON.parse(
    readFileSync('./tests/stream-gage-raw.json').toString()
  ) as StreamGageData[];
  // Raw stream gage data has dates stored as strings. These need to be re-formatted as Dates.
  const streamGageData = rawStreamGageData.map(({ values, ...rest }) => ({
    ...rest,
    values: values.map(({ dateTime, ...props }) => ({ ...props, dateTime: new Date(dateTime) })),
  }));
  const downsampled = downsampleStreamGageData(streamGageData, 'hour');
  await expect(downsampled).toBeInstanceOf(Array);
  await expect(downsampled.length).toBeGreaterThan(0);
  await expect(downsampled[0]).toBeInstanceOf(Object);
  await expect(Object.keys(downsampled[0]).sort()).toMatchObject(
    ['siteName', 'longitude', 'latitude', 'variableName', 'values'].sort()
  );
});
