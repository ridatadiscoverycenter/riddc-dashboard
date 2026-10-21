import { format, eachMonthOfInterval, addHours } from 'date-fns';
import { LngLatBoundsLike } from 'maplibre-gl';
import { UTCDate } from '@date-fns/utc';

import { OsomExplorerVariable, OsomExplorerDataset } from '@/types';

export const VARIABLE_OPTS: Array<{ label: string; value: OsomExplorerVariable }> = [
  { label: 'Salinity (Bottom)', value: 'SalinityBottom' },
  { label: 'Salinity (Surface)', value: 'SalinitySurface' },
  { label: 'Water Temperature (Bottom)', value: 'WaterTempBottom' },
  { label: 'Water Temperature (Surface)', value: 'WaterTempSurface' },
  { label: 'Surface Height', value: 'SurfaceHeight' },
  { label: 'Velocity East (Bottom)', value: 'VelocityEastwardBottom' },
  { label: 'Velocity East (Surface)', value: 'VelocityEastwardSurface' },
  { label: 'Velocity North (Bottom)', value: 'VelocityNorthwardBottom' },
  { label: 'Velocity North (Surface)', value: 'VelocityNorthwardSurface' },
  { label: 'Kinetic Energy (Bottom)', value: 'KineticEnergyBottom' },
  { label: 'Kinetic Energy (Surface)', value: 'KineticEnergySurface' },
];

export const DATASET_OPTS: Array<{ label: string; value: OsomExplorerDataset }> = [
  { label: 'Monthly Averages', value: 'monthly_avg' },
  { label: 'Hurricane Irene', value: 'hurricane_irene' },
];

export const VARIABLE_UNITS: Record<OsomExplorerVariable, string> = {
  WaterTempBottom: 'ºC',
  WaterTempSurface: 'ºC',
  SalinityBottom: 'PSU',
  SalinitySurface: 'PSU',
  KineticEnergyBottom: 'J/Kg',
  KineticEnergySurface: 'J/Kg',
  SurfaceHeight: 'm',
  VelocityEastwardBottom: 'm/s',
  VelocityEastwardSurface: 'm/s',
  VelocityNorthwardBottom: 'm/s',
  VelocityNorthwardSurface: 'm/s',
};

export const VARIABLE_BOUNDS_MONTHLY_AVG: Record<
  OsomExplorerVariable,
  { min: string; max: string }
> = {
  WaterTempBottom: {
    min: '-3.99',
    max: '28.85',
  },
  WaterTempSurface: {
    min: '-4.00',
    max: '28.28',
  },
  SalinityBottom: {
    min: '6.43e-41',
    max: '36.95',
  },
  SalinitySurface: {
    min: '5.52e-41',
    max: '34.94',
  },
  KineticEnergyBottom: {
    min: '1.50e-07',
    max: '0.66',
  },
  KineticEnergySurface: {
    min: '6.82e-07',
    max: '2.53',
  },
  SurfaceHeight: {
    min: '-0.43',
    max: '0.43',
  },
  VelocityEastwardBottom: {
    min: '-0.50',
    max: '0.60',
  },
  VelocityEastwardSurface: {
    min: '-0.77',
    max: '2.04',
  },
  VelocityNorthwardBottom: {
    min: '-0.62',
    max: '0.52',
  },
  VelocityNorthwardSurface: {
    min: '-1.04',
    max: '0.90',
  },
};

export const VARIABLE_BOUNDS_IRENE: Record<OsomExplorerVariable, { min: string; max: string }> = {
  WaterTempBottom: {
    min: '9.43',
    max: '27.00',
  },
  WaterTempSurface: {
    min: '14.78',
    max: '26.53',
  },
  SalinityBottom: {
    min: '0.00',
    max: '34.55',
  },
  SalinitySurface: {
    min: '0.00',
    max: '33.16',
  },
  KineticEnergyBottom: {
    min: '7.22e-10',
    max: '2.19',
  },
  KineticEnergySurface: {
    min: '1.84e-09',
    max: '8.97',
  },
  SurfaceHeight: {
    min: '-1.20',
    max: '1.55',
  },
  VelocityEastwardBottom: {
    min: '-1.88',
    max: '1.82',
  },
  VelocityEastwardSurface: {
    min: '-2.89',
    max: '4.03',
  },
  VelocityNorthwardBottom: {
    min: '-1.78',
    max: '1.98',
  },
  VelocityNorthwardSurface: {
    min: '-2.77',
    max: '3.42',
  },
};

export const HALINE_GRADIENT =
  'linear-gradient(0.25turn, #2a186e, #125e8e, #3c9486, #80cd64, #fbee97)';
export const THERMAL_GRADIENT =
  'linear-gradient(0.25turn, #032333, #634197, #b5607f, #fa973f, #e7fa5a)';
export const SPEED_GRADIENT =
  'linear-gradient(0.25turn, #fcfccc, #c5ba4c, #538d1f, #0c5d2e, #172213)';
export const AMP_GRADIENT =
  'linear-gradient(0.25turn, #f0ebea, #d59d8a, #be5437, #7e0d29, #3d0912)';
export const DEEP_GRADIENT =
  'linear-gradient(0.25turn, #fdfdcc, #61bea3, #46889c, #41417c, #281a2d)';
export const GRAY_GRADIENT = 'linear-gradient(0.25turn, #000000, #fcfbfa)';

export const VARIABLE_GRADIENTS: Record<OsomExplorerVariable, string> = {
  SalinityBottom: HALINE_GRADIENT,
  SalinitySurface: HALINE_GRADIENT,
  WaterTempBottom: THERMAL_GRADIENT,
  WaterTempSurface: THERMAL_GRADIENT,
  SurfaceHeight: DEEP_GRADIENT,
  VelocityEastwardBottom: SPEED_GRADIENT,
  VelocityEastwardSurface: SPEED_GRADIENT,
  VelocityNorthwardBottom: SPEED_GRADIENT,
  VelocityNorthwardSurface: SPEED_GRADIENT,
  KineticEnergyBottom: AMP_GRADIENT,
  KineticEnergySurface: AMP_GRADIENT,
};

export const AUTOPLAY_SPEED_MS = 2000;

export const OSOM_BOUNDS: LngLatBoundsLike = [
  [-72.7, 41.9],
  [-69.96, 40.5],
];

// yyyy-MM-dd formatted dates between 2005-01-01 and 2022-12-01
export const TIMEPOINTS_MONTHLY_AVG = eachMonthOfInterval({
  start: new UTCDate(2004, 12, 1),
  end: new UTCDate(2022, 11, 1),
}).map((date) => format(date, 'yyyy-MM-dd'));

// yyyy-MM-dd-HH-MM formatted dates between 2005-01-01 and 2022-12-01
export const TIMEPOINTS_HURRICANE_IRENE = Array.from(Array(64), (_, i) =>
  addHours(new UTCDate(1314403200000), i * 1.5)
).map((date) => format(date, 'yyyy-MM-dd-HH-mm'));

export const TILE_URL_TEMPLATE =
  'https://tile-server.riddc.brown.edu/services/<DATASET>_<VARIABLE>_<TIMEPOINT>/tiles/{z}/{x}/{y}.png';
