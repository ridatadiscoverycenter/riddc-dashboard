import { test, expect } from '@playwright/test';
import { buoy } from '@/utils/erddap/db';
const { fetchRiBuoy } = buoy;

test('fetchSamples', async () => {
  const buoyData = await fetchRiBuoy();
  console.log({ buoyData });
  expect('This test').toEqual("isn't done");
});
