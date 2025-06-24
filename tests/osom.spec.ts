import { test, expect } from '@playwright/test';

import {
  fetchOsomBuoyCoordinates,
  fetchOsomBuoyData,
  fetchOsomSummaryData,
} from '@/utils/data/api/buoy';

test('fetchOsomBuoyCoordinates', async () => {
  // Valid under normal conditions
  const coordinates = await fetchOsomBuoyCoordinates();
  await expect(coordinates).toBeInstanceOf(Array);
  await expect(coordinates.length).toBeGreaterThan(0);
  await expect(coordinates[0]).toBeInstanceOf(Object);
  await expect(Object.keys(coordinates[0]).sort()).toMatchObject(
    ['buoyId', 'latitude', 'longitude', 'stationName'].sort()
  );
});

test('fetchOsomSummaryData', async () => {
  const summary = await fetchOsomSummaryData();
  await expect(summary).toBeInstanceOf(Array);
  await expect(summary.length).toBeGreaterThan(0);
  await expect(summary[0]).toBeInstanceOf(Object);
  await expect(Object.keys(summary[0]).sort()).toMatchObject(
    [
      'SalinityBottom',
      'SalinitySurface',
      'WaterTempBottom',
      'WaterTempSurface',
      'stationName',
      'time',
      'buoyId',
    ].sort()
  );
});

test('fetchOsomBuoyData', async () => {
  const buoyData = await fetchOsomBuoyData(
    ['bid6'],
    ['WaterTempBottom'],
    new Date('2006-01-01T00:00:00.000Z'),
    new Date('2006-06-01T00:00:00.000Z')
  );
  await expect(buoyData).toBeInstanceOf(Array);
  await expect(buoyData.length).toBeGreaterThan(0);
  await expect(buoyData[0]).toBeInstanceOf(Object);
  await expect(Object.keys(buoyData[0]).sort()).toMatchObject(
    ['variable', 'stationName', 'units', 'value'].sort()
  );
});
