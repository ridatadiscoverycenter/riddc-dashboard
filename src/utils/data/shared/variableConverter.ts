import {
  RiBuoyVariable,
  MaBuoyVariable,
  PlanktonVariable,
  RealTimeBuoyVariable,
  OsomBuoyVariable,
} from '../api/buoy';
import { Dataset } from '../api/buoy/types';
import { getTitleFromSpecies } from './fish';

// Rhode Island Buoys
const RI_VAR_LABELS = [
  '% O2 (Surface)',
  '% O2 (Bottom)',
  'Depth (Bottom) (m)',
  'Depth (Surface) (m)',
  'pH (Bottom)',
  'pH (Surface)',
  'Specific Conductance (Surface) (mS cm-1)',
  'Specific Conductance (Bottom) (mS cm-1)',
  'Temperature (Bottom) (°C)',
  'Temperature (Surface) (°C)',
  'O2 (Surface) (μg L-1)',
  'O2 (Bottom) (μg L-1)',
  'Salinity (Bottom) (PSU)',
  'Salinity (Surface) (PSU)',
  'Density (Surface)',
  'Density (Bottom)',
  'Turbidity (Bottom) (NTU)',
  'Chlorophyll (μg L-1)',
  'Total Fluorescence',
] as const;

const RI_PAIRS: { viewer: (typeof RI_VAR_LABELS)[number]; erddap: RiBuoyVariable }[] = [
  { viewer: '% O2 (Surface)', erddap: 'O2PercentSurface' },
  { viewer: '% O2 (Bottom)', erddap: 'O2PercentBottom' },
  { viewer: 'Depth (Bottom) (m)', erddap: 'DepthBottom' },
  { viewer: 'Depth (Surface) (m)', erddap: 'depth' },
  { viewer: 'pH (Bottom)', erddap: 'pHBottom' },
  { viewer: 'pH (Surface)', erddap: 'pHSurface' },
  { viewer: 'Specific Conductance (Surface) (mS cm-1)', erddap: 'SpCondSurface' },
  { viewer: 'Specific Conductance (Bottom) (mS cm-1)', erddap: 'SpCondBottom' },
  { viewer: 'Temperature (Bottom) (°C)', erddap: 'WaterTempBottom' },
  { viewer: 'Temperature (Surface) (°C)', erddap: 'WaterTempSurface' },
  { viewer: 'O2 (Surface) (μg L-1)', erddap: 'O2Surface' },
  { viewer: 'O2 (Bottom) (μg L-1)', erddap: 'O2Bottom' },
  { viewer: 'Salinity (Bottom) (PSU)', erddap: 'SalinityBottom' },
  { viewer: 'Salinity (Surface) (PSU)', erddap: 'SalinitySurface' },
  { viewer: 'Density (Surface)', erddap: 'DensitySurface' },
  { viewer: 'Density (Bottom)', erddap: 'DensityBottom' },
  { viewer: 'Turbidity (Bottom) (NTU)', erddap: 'TurbidityBottom' },
  { viewer: 'Chlorophyll (μg L-1)', erddap: 'ChlorophyllSurface' },
  { viewer: 'Total Fluorescence', erddap: 'FSpercentSurface' },
] as const;

// MA buoys
const MA_VAR_LABELS = [
  'Chlorophyll (Bottom) (RFU)',
  'Chlorophyll (Surface) (RFU)',
  'Depth (m)',
  'Depth (Bottom) (m)',
  'Depth (Surface) (m)',
  'Nitrate N (Surface) (μmol L-1)',
  'O2 (Bottom) (μg L-1)',
  '% O2 (Bottom)',
  '% O2 (Surface)',
  'O2 (Surface) (μg L-1)',
  'pH (Bottom)',
  'pH (Surface)',
  'Phycoerythrin (Bottom) (RFU)',
  'Phycoerythrin (Surface) (RFU)',
  'Salinity (Bottom) (PSU)',
  'Salinity (Surface) (PSU)',
  'Specific Conductance (Bottom) (mS cm-1)',
  'Specific Conductance (Surface) (mS cm-1)',
  'Water Temperature (Bottom) (°C)',
  'Water Temperature (Surface) (°C)',
] as const;

const MA_PAIRS: { viewer: (typeof MA_VAR_LABELS)[number]; erddap: MaBuoyVariable }[] = [
  { viewer: 'Depth (m)', erddap: 'depth' },
  { viewer: 'Depth (Surface) (m)', erddap: 'DepthSurface' },
  { viewer: 'Depth (Bottom) (m)', erddap: 'DepthBottom' },
  { viewer: 'pH (Bottom)', erddap: 'pHBottom' },
  { viewer: 'Chlorophyll (Bottom) (RFU)', erddap: 'ChlorophyllBottom' },
  { viewer: 'Chlorophyll (Surface) (RFU)', erddap: 'ChlorophyllSurface' },
  { viewer: 'Nitrate N (Surface) (μmol L-1)', erddap: 'NitrateNSurface' },
  { viewer: 'O2 (Bottom) (μg L-1)', erddap: 'O2Bottom' },
  { viewer: '% O2 (Bottom)', erddap: 'O2PercentBottom' },
  { viewer: '% O2 (Surface)', erddap: 'O2PercentSurface' },
  { viewer: 'O2 (Surface) (μg L-1)', erddap: 'O2Surface' },
  { viewer: 'pH (Surface)', erddap: 'pHSurface' },
  { viewer: 'Phycoerythrin (Bottom) (RFU)', erddap: 'PhycoerythrinBottom' },
  { viewer: 'Phycoerythrin (Surface) (RFU)', erddap: 'PhycoerythrinSurface' },
  { viewer: 'Salinity (Bottom) (PSU)', erddap: 'SalinityBottom' },
  { viewer: 'Salinity (Surface) (PSU)', erddap: 'SalinitySurface' },
  { viewer: 'Specific Conductance (Bottom) (mS cm-1)', erddap: 'SpCondBottom' },
  { viewer: 'Specific Conductance (Surface) (mS cm-1)', erddap: 'SpCondSurface' },
  { viewer: 'Water Temperature (Bottom) (°C)', erddap: 'WaterTempBottom' },
  { viewer: 'Water Temperature (Surface) (°C)', erddap: 'WaterTempSurface' },
] as const;

// plankton variables
const PLANKTON_VAR_LABELS = [
  'Silica (Bottom)',
  'NH4 (Surface)',
  'Salinity (Bottom) (PSU)',
  'Chlorophyll (Surface) (μg L-1)',
  'Water Temperature (Bottom) (°C)',
  'NH4 (Bottom)',
  'NO3 (Bottom)',
  'NO2 (Surface)',
  'DIN (Surface)',
  'DIP (Surface)',
  'NO2 (Bottom)',
  'Water Temperature (Surface) (°C)',
  'Chlorophyll (Bottom) (μg L-1)',
  'Phaeo (Bottom)',
  'Silica (Surface)',
  'Salinity (Surface) (PSU)',
  'NO3 (Surface)',
  'DIN (Bottom)',
  'Phaeo (Surface)',
  'DIP (Bottom)',
] as const;

const PLANKTON_PAIRS: { viewer: (typeof PLANKTON_VAR_LABELS)[number]; erddap: PlanktonVariable }[] =
  [
    { viewer: 'Silica (Bottom)', erddap: 'SilicaBottom' },
    { viewer: 'NH4 (Surface)', erddap: 'NH4Surface' },
    { viewer: 'Salinity (Bottom) (PSU)', erddap: 'SalinityBottom' },
    { viewer: 'Chlorophyll (Surface) (μg L-1)', erddap: 'ChlorophyllSurface' },
    { viewer: 'Water Temperature (Bottom) (°C)', erddap: 'WaterTempBottom' },
    { viewer: 'NH4 (Bottom)', erddap: 'NH4Bottom' },
    { viewer: 'NO3 (Bottom)', erddap: 'NO3Bottom' },
    { viewer: 'NO2 (Surface)', erddap: 'NO2Surface' },
    { viewer: 'DIN (Surface)', erddap: 'DINSurface' },
    { viewer: 'DIP (Surface)', erddap: 'DIPSurface' },
    { viewer: 'NO2 (Bottom)', erddap: 'NO2Bottom' },
    { viewer: 'Water Temperature (Surface) (°C)', erddap: 'WaterTempSurface' },
    { viewer: 'Chlorophyll (Bottom) (μg L-1)', erddap: 'ChlorophyllBottom' },
    { viewer: 'Phaeo (Bottom)', erddap: 'PhaeoBottom' },
    { viewer: 'Silica (Surface)', erddap: 'SilicaSurface' },
    { viewer: 'Salinity (Surface) (PSU)', erddap: 'SalinitySurface' },
    { viewer: 'NO3 (Surface)', erddap: 'NO3Surface' },
    { viewer: 'DIN (Bottom)', erddap: 'DINBottom' },
    { viewer: 'Phaeo (Surface)', erddap: 'PhaeoSurface' },
    { viewer: 'DIP (Bottom)', erddap: 'DIPBottom' },
  ] as const;

const REAL_TIME_VAR_LABELS = [
  'Fluorescence Counts',
  'FDOM (ppb)',
  'FDOM (Despike) (ppb)',
  'FDOM Global Range (QC)',
  'FDOM Stuck Value (QC)',
  'Water Temperature (°C)',
  'Water Temperature (Despike) (°C)',
  'Water Temperature Global Range (QC)',
  'Water Temperature Seasonal NB Range (QC)',
  'Water Temperature Stuck Value (QC)',
  'Specific Conductance (mS cm-1)',
  'O2 (ug L-1)',
  'O2 (Despike) (μg L-1)',
  'O2 Global Range (QC)',
  'O2 Stuck Value (QC)',
  'Salinity (PSU)',
  'Salinity (Despike) (PSU)',
  'Salinity Global Range (QC)',
  'Salinity Seasonal NB Range (QC)',
  'Salinity Stuck Value (QC)',
  'Chlorophyll (Surface) (μg L-1)',
  'Chlorophyll (Despike) (μg L-1)',
  'Chlorophyll Seasonal NB Range (QC)',
  'Chlorophyll Stuck Value (QC)',
  'Turbidity (NTU)',
  'Turbidity (Despike) (NTU)',
  'Turbidity Stuck Value (QC)',
  'pH',
  'pH (Despike)',
  'pH Global Range (QC)',
  'pH Stuck Value (QC)',
  'Phosphate (μmol L-1)',
  'Phosphate (QC) Flag',
  'Phosphate Bubble Flag',
  'Phosphate CoV Flag',
  'Phosphate Low Sig Flag',
  'Phosphate OoR Flag',
  'Phosphate Mixing Flag',
  'Hydrocycle Calibration Flag',
  'Phosphate (Despike) (μmol L-1)',
  'Phosphate Seasonal NBR Range (QC)',
  'Phosphate Stuck Value (QC)',
  'Nitrate (μmol L-1)',
  'Nitrate (Despike) (μmol L-1)',
  'Nitrate Global Range (QC)',
  'Nitrate Seasonal NB Range (QC)',
  'Nitrate Stuck Value (QC)',
  'PAR (μmol m-2 s-1)',
  'PAR (Despike) (μmol m-2 s-1)',
  'PAR Instrument Range (QC)',
  'PAR Stuck Value (QC)',
  'Wind Speed Average (m s-1)',
  'Wind Speed Average (Despike) (m s-1)',
  'Wind Speed Average Instrument Range (Despike)',
  'Wind Speed Average Stuck Value (Despike)',
  'Wind Speed Gust (m s-1)',
  'Wind Speed Gust (Despike) (m s-1)',
  'Wind Speed Gust Instrument Range (QC)',
  'Wind Speed Gust Stuck Value (QC)',
  'Air Temperature (°C)',
  'Air Temperature (Despike) (°C)',
  'Air Temperature Instrument Range QC',
  'Air Temperature Stuck Value (QC)',
  'Air Pressure (mBar)',
  'Air Pressure (Despike) (mBar)',
  'Air Pressure Instrument Range (QC)',
  'Air Pressure Stuck Value (QC)',
  'Humidity (Relative)',
  'Humidity (Despike)',
  'Humidity Instrument Range (QC)',
  'Humidity Stuck Value (QC)',
  'Precipitation (mm hr-1)',
  'Precipitation (Despike) (mm hr-1)',
  'Precipitation Instrument Range (QC)',
  'Precipitation Stuck Value (QC)',
  'Solar Irradiance',
  'Solar Irradiance (Despike)',
  'Solar Irradiance Instrument Range (QC)',
  'Solar Irradiance Stuck Value (QC)',
] as const;

const REAL_TIME_PAIRS: {
  viewer: (typeof REAL_TIME_VAR_LABELS)[number];
  erddap: RealTimeBuoyVariable;
}[] = [
  { viewer: 'Fluorescence Counts', erddap: 'FluorescenceCounts' },
  { viewer: 'FDOM (ppb)', erddap: 'FDOM' },
  { viewer: 'FDOM (Despike) (ppb)', erddap: 'FDOMDespike' },
  { viewer: 'Water Temperature (°C)', erddap: 'WaterTempSurface' },
  { viewer: 'Water Temperature (Despike) (°C)', erddap: 'WaterTempSurfaceDespike' },
  { viewer: 'Specific Conductance (mS cm-1)', erddap: 'SpCondSurface' },
  { viewer: 'O2 (ug L-1)', erddap: 'O2Surface' },
  { viewer: 'O2 (Despike) (μg L-1)', erddap: 'O2SurfaceDespike' },
  { viewer: 'Salinity (PSU)', erddap: 'SalinitySurface' },
  { viewer: 'Salinity (Despike) (PSU)', erddap: 'SalinitySurfaceDespike' },
  { viewer: 'Chlorophyll (Surface) (μg L-1)', erddap: 'ChlorophyllSurface' },
  { viewer: 'Chlorophyll (Despike) (μg L-1)', erddap: 'ChlorophyllSurfaceDespike' },
  { viewer: 'Turbidity (NTU)', erddap: 'TurbiditySurface' },
  { viewer: 'Turbidity (Despike) (NTU)', erddap: 'TurbiditySurfaceDespike' },
  { viewer: 'pH', erddap: 'pHSurface' },
  { viewer: 'pH (Despike)', erddap: 'pHSurfaceDespike' },
  { viewer: 'Phosphate (μmol L-1)', erddap: 'PhosphateSurface' },
  { viewer: 'Phosphate (Despike) (μmol L-1)', erddap: 'PhosphateSurfaceDespike' },
  { viewer: 'Nitrate (μmol L-1)', erddap: 'NitrateNSurface' },
  { viewer: 'Nitrate (Despike) (μmol L-1)', erddap: 'NitrateNSurfaceDespike' },
  { viewer: 'PAR (μmol m-2 s-1)', erddap: 'PARSurface' },
  { viewer: 'PAR (Despike) (μmol m-2 s-1)', erddap: 'PARSurfaceDespike' },
  { viewer: 'Wind Speed Average (m s-1)', erddap: 'WindSpeedAverage' },
  { viewer: 'Wind Speed Average (Despike) (m s-1)', erddap: 'WindSpeedAverageDespike' },
  { viewer: 'Wind Speed Gust (m s-1)', erddap: 'WindSpeedGust' },
  { viewer: 'Wind Speed Gust (Despike) (m s-1)', erddap: 'WindSpeedGustDespike' },
  { viewer: 'Air Temperature (°C)', erddap: 'AirTemp' },
  { viewer: 'Air Temperature (Despike) (°C)', erddap: 'AirTempDespike' },
  { viewer: 'Air Pressure (mBar)', erddap: 'AirPressure' },
  { viewer: 'Air Pressure (Despike) (mBar)', erddap: 'AirPressureDespike' },
  { viewer: 'Humidity (Relative)', erddap: 'HumiditySurface' },
  { viewer: 'Humidity (Despike)', erddap: 'HumiditySurfaceDespike' },
  { viewer: 'Precipitation (mm hr-1)', erddap: 'Precipitation' },
  { viewer: 'Precipitation (Despike) (mm hr-1)', erddap: 'PrecipitationDespike' },
  { viewer: 'Solar Irradiance', erddap: 'SolarIrradiance' },
  { viewer: 'Solar Irradiance (Despike)', erddap: 'SolarIrradianceDespike' },
];

const OSOM_VAR_LABELS = [
  'Salinity (Bottom) (PSU)',
  'Salinity (Surface) (PSU)',
  'Temperature (Bottom) (°C)',
  'Temperature (Surface) (°C)',
] as const;

const OSOM_PAIRS: { viewer: (typeof OSOM_VAR_LABELS)[number]; erddap: OsomBuoyVariable }[] = [
  { viewer: 'Salinity (Bottom) (PSU)', erddap: 'SalinityBottom' },
  { viewer: 'Salinity (Surface) (PSU)', erddap: 'SalinitySurface' },
  { viewer: 'Temperature (Bottom) (°C)', erddap: 'WaterTempBottom' },
  { viewer: 'Temperature (Surface) (°C)', erddap: 'WaterTempSurface' },
];

export function variableToLabel(v: string, dataset?: Dataset) {
  if (dataset === undefined) return v;
  if (dataset === 'fish') return getTitleFromSpecies(v);
  const foundPair =
    dataset === 'ri'
      ? RI_PAIRS.find((pair) => pair.erddap === v)
      : dataset === 'ma'
        ? MA_PAIRS.find((pair) => pair.erddap === v)
        : dataset === 'plankton'
          ? PLANKTON_PAIRS.find((pair) => pair.erddap === v)
          : dataset === 'real-time'
            ? REAL_TIME_PAIRS.find((pair) => pair.erddap === v)
            : dataset === 'osom'
              ? OSOM_PAIRS.find((pair) => pair.erddap === v)
              : undefined;
  if (foundPair !== undefined) return foundPair.viewer;
  // Note (AM): Would it be better to log this and just return `v`?
  // throw new Error(`No viewer variable for erddap variable "${v}" in dataset "${dataset}"`);
  console.error(`No viewer variable for erddap variable "${v}" in dataset "${dataset}"`);
  return v;
}
