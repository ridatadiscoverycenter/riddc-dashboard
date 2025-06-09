/*import { test, expect } from '@playwright/test';
import { buoy } from '@/utils/erddap/api';
const { fetchRiSummaryData, fetchRiBuoyCoordinates, fetchRiBuoyVariables, fetchRiBuoyTimeRange } =
  buoy;

test('fetchRiSummaryData', async () => {
  const buoyData = await fetchRiSummaryData();
  expect(buoyData instanceof Array).toBe(true);
  expect(buoyData.length).toBeGreaterThanOrEqual(1);
  const firstData = buoyData.pop();
  expect(firstData).not.toBe(undefined);
  expect(Object.keys(firstData as Exclude<typeof firstData, undefined>).length).toBe(22);
});

test('fetchRiBuoyCoordinates', async () => {
  const buoyCoordinates = await fetchRiBuoyCoordinates();
  expect(buoyCoordinates instanceof Array).toBe(true);
  expect(buoyCoordinates.length).toBeGreaterThanOrEqual(1);
  const firstCoordinate = buoyCoordinates.pop();
  expect(firstCoordinate).not.toBe(undefined);
  expect(Object.keys(firstCoordinate as Exclude<typeof firstCoordinate, undefined>).length).toBe(4);
});

test('fetchRiBuoyVariables', async () => {
  const buoyVariables = await fetchRiBuoyVariables();
  expect(buoyVariables instanceof Array).toBe(true);
  expect(buoyVariables.length).toBeGreaterThanOrEqual(1);
  const firstVariable = buoyVariables.pop();
  expect(firstVariable).not.toBe(undefined);
  expect(Object.keys(firstVariable as Exclude<typeof firstVariable, undefined>).length).toBe(2);
});

test.only('fetchRiBuoyTimeRange', async () => {
  const timerange = await fetchRiBuoyTimeRange();
  expect(typeof timerange).toBe('object');
  expect(Object.keys(timerange).length).toBe(2);
});
*/
