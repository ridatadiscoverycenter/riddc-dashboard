/**
 * Fetch Weather Data from RCC ACIS in a specified time window.
 * @param startDate
 * @param endDate
 * @returns {WeatherData[]}
 */
export async function fetchWeatherData(startDate: Date, endDate: Date) {
  if (startDate >= endDate)
    throw new Error(`Start date (${startDate}) must be less than end date (${endDate})`);
  const queryPayload = JSON.stringify({
    sid: 'PVDthr 9',
    sdate: `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`,
    edate: `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`,
    elems: [
      { name: 'maxt', interval: 'dly' },
      { name: 'mint', interval: 'dly' },
      { name: 'avgt', interval: 'dly' },
      { name: 'pcpn', interval: 'dly' },
    ],
  });
  const response = await fetch('https://data.rcc-acis.org/StnData', {
    method: 'POST',
    body: queryPayload,
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.status === 200) {
    const { data } = (await response.json()) as {
      meta: unknown;
      data: Array<[string, string, string, string, string]>;
    };
    return formatWeatherData(data);
  } else {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
}

/**
 * Convert Farenheit temperatures to celcius, rounded to two digits.
 * @param temp Temperature
 * @returns Temperature in celcius
 */
function farenheitToCelcius(temp: number) {
  return Math.round(100 * (((temp - 32) * 5) / 9)) / 100;
}

/**
 * Formats the data array from rcc-acis as a JS object
 * @param dailyData
 * @returns
 */
function formatWeatherData(dailyData: Array<[string, string, string, string, string]>) {
  return dailyData.map(
    ([dateString, tempMaxString, tempMinString, tempAvgString, precipitationString]) => ({
      date: new Date(dateString),
      maxTemp: farenheitToCelcius(Number(tempMaxString)),
      minTemp: farenheitToCelcius(Number(tempMinString)),
      avgTemp: farenheitToCelcius(Number(tempAvgString)),
      precipitation: Number(precipitationString),
    })
  );
}

export type WeatherData = ReturnType<typeof formatWeatherData>[number];
