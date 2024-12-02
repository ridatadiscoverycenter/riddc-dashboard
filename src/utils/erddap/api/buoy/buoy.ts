import { erddapAPIGet } from '../erddap';

const MODEL_LINEWIDTH = 0.8;
const MEASUREMENT_LINEWIDTH = 1.8;
export const CONFIG_NAMES = ['ri-buoy', 'osom', 'ma-buoy', 'plankton', 'buoy-telemetry'] as const;
export type BuoyConfigName = (typeof CONFIG_NAMES)[number];
export type BuoyConfig = {
  name: BuoyConfigName;
  route: string;
  datasetId: string;
  lineWidth: number;
  title: string;
};
export const CONFIG: { [key in BuoyConfigName]: BuoyConfig } = {
  'ri-buoy': {
    name: 'ri-buoy',
    route: 'buoy',
    datasetId: 'combined_e784_bee5_492e',
    lineWidth: MEASUREMENT_LINEWIDTH,
    title: 'Historical',
  },
  osom: {
    name: 'osom',
    route: 'model',
    datasetId: 'model_data_77bb_15c2_6ab3',
    lineWidth: MODEL_LINEWIDTH,
    title: 'OSOM',
  },
  'ma-buoy': {
    name: 'ma-buoy',
    route: 'mabuoy',
    datasetId: 'ma_buoy_data_a6c9_12eb_1ec5',
    lineWidth: MEASUREMENT_LINEWIDTH,
    title: 'Historical',
  },
  plankton: {
    name: 'plankton',
    route: 'plankton',
    datasetId: 'plankton_time_series_7615_c513_ef8e',
    lineWidth: MEASUREMENT_LINEWIDTH,
    title: 'Plankton',
  },
  'buoy-telemetry': {
    name: 'buoy-telemetry',
    route: 'telemetry-raw',
    datasetId: 'buoy_telemetry_0ffe_2dc0_916e',
    lineWidth: MEASUREMENT_LINEWIDTH,
    title: 'Real Time',
  },
};

function getConfig(configName: BuoyConfigName) {
  return CONFIG[configName];
}

export async function fetchSummaryData(configName: BuoyConfigName, bustCache = false) {
  const config = getConfig(configName);
  const bustCacheParam = bustCache ? `?cacheBust=${Math.random()}` : '';
  return await erddapAPIGet<unknown[]>(`${config.route}/summary${bustCacheParam}`);
}

export async function fetchBuoyCoordinates(configName: BuoyConfigName) {
  const config = getConfig(configName);
  return await erddapAPIGet<unknown[]>(`/${config.route}/coordinates`);

  /*
    c.fullName = `${c.station_name} (${c.buoyId})`;
    this.coordinates = coordinates;
    const colorMap = useColorMap();
    colorMap.update({ ids: coordinates.map((v) => v.station_name) });
    */
}

export async function fetchBuoyVariables(configName: BuoyConfigName) {
  const config = getConfig(configName);
  return await erddapAPIGet<unknown[]>(`/${config.route}/variables`);
}

export async function fetchBuoyTimeRange(configName: BuoyConfigName) {
  const config = getConfig(configName);
  return await erddapAPIGet(`/${config.route}/timerange`);
}

function formatDateForQueryParams(d: Date) {
  return d.toISOString().split('T')[0];
}

export async function fetchBuoyData(
  configName: BuoyConfigName,
  ids: string[],
  vars: string[],
  startDate: Date,
  endDate: Date
) {
  const config = getConfig(configName);
  const url = `${config.route}/query?ids=${ids.join(',')}&variables=${vars.join(',')}&start=${formatDateForQueryParams(startDate)}&end=${formatDateForQueryParams(endDate)}`;
  return await erddapAPIGet<unknown>(url);
  /*
  // Note (AM): Get a better sense of where this data comes from.
  //const ids = undefined;
  //const vars = undefined;
  //const startDate = undefined;
  //const endDate = undefined;
  const dataset: BuoyDataset = {
    downsampled: fetchedDataset.downsampled,
    data: fetchedDataset.data.map(
      (data) => ({ ...data, stationName: data.station_name }) as BuoyData
    ),
  };
  return dataset;
  */
}
