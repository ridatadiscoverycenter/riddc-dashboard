import { erddapAPIGet } from '../erddap';
import { getConfig, type DatasetConfigName } from '../config';
import { formatDateForQueryParams } from '../shared';

export async function fetchSummaryData(configName: DatasetConfigName, bustCache = false) {
  const config = getConfig(configName);
  const bustCacheParam = bustCache ? `?cacheBust=${Math.random()}` : '';
  return await erddapAPIGet<unknown[]>(`${config.route}/summary${bustCacheParam}`);
}

export async function fetchSummaryMeanData(configName: DatasetConfigName, bustCache = false) {
  const config = getConfig(configName);
  const bustCacheParam = bustCache ? `?cacheBust=${Math.random()}` : '';
  return await erddapAPIGet<unknown[]>(`${config.route}/summary-mean${bustCacheParam}`);
}

export async function fetchBuoyCoordinates(configName: DatasetConfigName) {
  const config = getConfig(configName);
  return await erddapAPIGet<unknown[]>(`/${config.route}/coordinates`);
}

export async function fetchBuoyVariables(configName: DatasetConfigName) {
  const config = getConfig(configName);
  return await erddapAPIGet<unknown[]>(`/${config.route}/variables`);
}

export async function fetchBuoyTimeRange(configName: DatasetConfigName) {
  const config = getConfig(configName);
  return await erddapAPIGet(`/${config.route}/timerange`);
}

export async function fetchBuoyData(
  configName: DatasetConfigName,
  ids: string[],
  vars: string[],
  startDate: Date,
  endDate: Date
) {
  const config = getConfig(configName);
  const url = `${config.route}/query?ids=${ids.join(',')}&variables=${vars.join(',')}&start=${formatDateForQueryParams(startDate)}&end=${formatDateForQueryParams(endDate)}`;
  return await erddapAPIGet<unknown>(url);
}
