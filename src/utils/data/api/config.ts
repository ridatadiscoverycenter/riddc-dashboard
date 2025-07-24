export const CONFIG_NAMES = [
  'ri-buoy',
  'osom',
  'ma-buoy',
  'plankton',
  'buoy-telemetry',
  'fish',
] as const;
export type DatasetConfigName = (typeof CONFIG_NAMES)[number];
export type DatasetConfig = {
  route?: string;
  datasetId: string;
};
export const CONFIG: { [key in DatasetConfigName]: DatasetConfig } = {
  'ri-buoy': {
    route: 'buoy',
    datasetId: 'combined_e784_bee5_492e',
  },
  osom: {
    route: 'model',
    datasetId: 'model_data_77bb_15c2_6ab3',
  },
  'ma-buoy': {
    route: 'mabuoy',
    datasetId: 'ma_buoy_data_a6c9_12eb_1ec5',
  },
  plankton: {
    route: 'plankton',
    datasetId: 'plankton_time_series_7615_c513_ef8e',
  },
  'buoy-telemetry': {
    route: 'telemetry-raw',
    datasetId: 'buoy_telemetry_0ffe_2dc0_916e',
  },
  fish: {
    datasetId: 'fish_trawl_3ce2_fedf_6833',
  },
};

export function getConfig(configName: DatasetConfigName) {
  return CONFIG[configName];
}
