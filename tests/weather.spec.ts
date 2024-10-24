import { test, expect } from '@playwright/test';

import { fetchWeatherData } from '@/utils/weather';

test('fetchWeatherData', async () => {
  // Valid under normal conditions
  const weatherData = await fetchWeatherData(new Date('01/01/2023'), new Date('01/02/2023'));
  await expect(weatherData).toBeInstanceOf(Array);
  await expect(weatherData.length).toBeGreaterThan(0);
  await expect(weatherData[0]).toBeInstanceOf(Object);
  await expect(Object.keys(weatherData[0]).sort()).toMatchObject(
    ['date', 'maxTemp', 'minTemp', 'avgTemp', 'precipitation'].sort()
  );
});

test('fetchWeatherData With Bad Args', async () => {
  // Error with bad args?
  await expect(() =>
    fetchWeatherData(new Date('01/02/2023'), new Date('01/01/2023'))
  ).rejects.toThrowError();
});
