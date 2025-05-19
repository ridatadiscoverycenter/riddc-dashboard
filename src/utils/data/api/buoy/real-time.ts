import { z } from 'zod';
import { fetchSummaryData, fetchBuoyData, fetchBuoyCoordinates } from './buoy';

/**
 * Types
 */

const REAL_TIME_BUOY_ERDDAP_VARIABLES = [
  'FluorescenceCounts',
  'FDOM',
  'FDOMDespike',
  'FDOMGlobalRangeQC',
  'FDOMStuckValueQC',
  'WaterTempSurface',
  'WaterTempSurfaceDespike',
  'WaterTempSurfaceGlobalRangeQC',
  'WaterTempSurfaceSeasonalNBRangeQC',
  'WaterTempSurfaceStuckValueQC',
  'SpCondSurface',
  'O2Surface',
  'O2SurfaceDespike',
  'O2SurfaceGlobalRangeQC',
  'O2SurfaceStuckValueQC',
  'SalinitySurface',
  'SalinitySurfaceDespike',
  'SalinitySurfaceGlobalRangeQC',
  'SalinitySurfaceSeasonalNBRangeQC',
  'SalinitySurfaceStuckValueQC',
  'ChlorophyllSurface',
  'ChlorophyllSurfaceDespike',
  'ChlorophyllSurfaceSeasonalNBRangeQC',
  'ChlorophyllSurfaceStuckValueQC',
  'TurbiditySurface',
  'TurbiditySurfaceDespike',
  'TurbiditySurfaceStuckValueQC',
  'pHSurface',
  'pHSurfaceDespike',
  'pHSurfaceGlobalRangeQC',
  'pHSurfaceStuckValueQC',
  'PhosphateSurface',
  'PhosphateSurfaceQCFlag',
  'PhosphateSurfaceBubbleFlag',
  'PhosphateSurfaceCoVFlag',
  'PhosphateSurfaceLowSigFlag',
  'PhosphateSurfaceOoRFlag',
  'PhosphateSurfaceMixingFlag',
  'HydrocycleCalibrationFlag',
  'PhosphateSurfaceDespike',
  'PhosphateSurfaceSeasonalNBRangeQC',
  'PhosphateSurfaceStuckValueQC',
  'NitrateNSurface',
  'NitrateNSurfaceDespike',
  'NitrateNSurfaceGlobalRangeQC',
  'NitrateNSurfaceSeasonalNBRangeQC',
  'NitrateNSurfaceStuckValueQC',
  'PARSurface',
  'PARSurfaceDespike',
  'PARSurfaceInstrumentRangeQC',
  'PARSurfaceStuckValueQC',
  'WindSpeedAverage',
  'WindSpeedAverageDespike',
  'WindSpeedAverageInstrumentRangeQC',
  'WindSpeedAverageStuckValueQC',
  'WindDirectionFrom',
  'WindDirectionFromInstrumentRangeQC',
  'WindDirectionFromStuckValueQC',
  'WindSpeedGust',
  'WindSpeedGustDespike',
  'WindSpeedGustInstrumentRangeQC',
  'WindSpeedGustStuckValueQC',
  'WindGustDirectionFrom',
  'WindGustDirectionFromInstrumentRangeQC',
  'WindGustDirectionFromStuckValueQC',
  'AirTemp',
  'AirTempDespike',
  'AirTempInstrumentRangeQC',
  'AirTempStuckValueQC',
  'AirPressure',
  'AirPressureDespike',
  'AirPressureInstrumentRangeQC',
  'AirPressureStuckValueQC',
  'HumiditySurface',
  'HumiditySurfaceDespike',
  'HumiditySurfaceInstrumentRangeQC',
  'HumiditySurfaceStuckValueQC',
  'Precipitation',
  'PrecipitationDespike',
  'PrecipitationInstrumentRangeQC',
  'PrecipitationStuckValueQC',
  'SolarIrradiance',
  'SolarIrradianceDespike',
  'SolarIrradianceInstrumentRangeQC',
  'SolarIrradianceStuckValueQC',
] as const;
export const REAL_TIME_BUOY_VIEWER_VARIABLES = [
  'fluorescenceCounts',
  'fdom',
  'fdomDespike',
  'fdmonGlobalRangeQC',
  'fdomStuckValueQC',
  'waterTemperature',
  'waterTemperatureDespike',
  'waterTemperatureGlobalRangeQC',
  'waterTemperatureSeasonalNBRangeQC',
  'waterTemperatureStuckValueQC',
  'temperatureSurfaceGlobalRangeQC',
  'temperatureSurfaceSeasonalNBRangeQC',
  'temperatureSurfaceStuckValueQC',
  'specificConductance',
  'oxygen',
  'oxygenDespike',
  'oxygenGlobalRangeQC',
  'oxygenStuckValueQC',
  'salinity',
  'salinityDespike',
  'salinityGlobalRangeQC',
  'salinitySeasonalNBRangeQC',
  'salinityStuckValueQC',
  'chlorophyll',
  'chlorophyllDespike',
  'chlorophyllSeasonalNBRangeQC',
  'chlorophyllStuckValueQC',
  'turbidity',
  'turbidityDespike',
  'turbidityStuckValueQC',
  'pH',
  'pHDespike',
  'pHGlobalRangeQC',
  'pHStuckValueQC',
  'phosphate',
  'phosphateQCFlag',
  'phosphateBubbleFlag',
  'phosphateCoVFlag',
  'phosphateLowSigFlag',
  'phosphateOoRFlag',
  'phosphateMixingFlag',
  'hydrocycleCalibrationFlag',
  'phosphateDespike',
  'phosphateSeasonalNBRangeQC',
  'phosphateStuckValueQC',
  'nitrate',
  'nitrateDespike',
  'nitrateGlobalRangeQC',
  'nitrateSeasonalNBRangeQC',
  'nitrateStuckValueQC',
  'par',
  'parDespike',
  'parInstrumentRangeQC',
  'parStuckValueQC',
  'windSpeedAverage',
  'windSpeedAverageDespike',
  'windSpeedAverageInstrumentRangeQC',
  'windSpeedAverageStuckValueQC',
  'windDirectionFrom',
  'windDirectionFromInstrumentRangeQC',
  'windDirectionFromStuckValueQC',
  'windSpeedGust',
  'windSpeedGustDespike',
  'windSpeedGustInstrumentRangeQC',
  'windSpeedGustStuckValueQC',
  'windGustDirectionFrom',
  'windGustDirectionFromInstrumentRangeQC',
  'windGustDirectionFromStuckValueQC',
  'airTemperature',
  'airTemperatureDespike',
  'airTemperatureInstrumentRangeQC',
  'airTemperatureStuckValueQC',
  'airPressure',
  'airPressureDespike',
  'airPressureInstrumentRangeQC',
  'airPressureStuckValueQC',
  'humiditySurface',
  'humiditySurfaceDespike',
  'humiditySurfaceInstrumentRangeQC',
  'humiditySurfaceStuckValueQC',
  'precipitation',
  'precipitationDespike',
  'precipitationInstrumentRangeQC',
  'precipitationStuckValueQC',
  'solarIrradiance',
  'solarIrradianceDespike',
  'solarIrradianceInstrumentRangeQC',
  'solarIrradianceStuckValueQC',
] as const;

export type RealTimeBuoyViewerVariable = (typeof REAL_TIME_BUOY_VIEWER_VARIABLES)[number];
export type RealTimeBuoyErddapVariable = (typeof REAL_TIME_BUOY_ERDDAP_VARIABLES)[number];

const VARIABLE_PAIRS: { viewer: RealTimeBuoyViewerVariable; erddap: RealTimeBuoyErddapVariable }[] =
  [
    { viewer: 'fluorescenceCounts', erddap: 'FluorescenceCounts' },
    { viewer: 'fdom', erddap: 'FDOM' },
    { viewer: 'fdomDespike', erddap: 'FDOMDespike' },
    { viewer: 'fdmonGlobalRangeQC', erddap: 'FDOMGlobalRangeQC' },
    { viewer: 'fdomStuckValueQC', erddap: 'FDOMStuckValueQC' },
    { viewer: 'waterTemperature', erddap: 'WaterTempSurface' },
    { viewer: 'waterTemperatureDespike', erddap: 'WaterTempSurfaceDespike' },
    { viewer: 'waterTemperatureGlobalRangeQC', erddap: 'WaterTempSurfaceGlobalRangeQC' },
    { viewer: 'waterTemperatureSeasonalNBRangeQC', erddap: 'WaterTempSurfaceSeasonalNBRangeQC' },
    { viewer: 'waterTemperatureStuckValueQC', erddap: 'WaterTempSurfaceStuckValueQC' },
    { viewer: 'temperatureSurfaceGlobalRangeQC', erddap: 'WaterTempSurfaceGlobalRangeQC' },
    { viewer: 'temperatureSurfaceSeasonalNBRangeQC', erddap: 'WaterTempSurfaceSeasonalNBRangeQC' },
    { viewer: 'temperatureSurfaceStuckValueQC', erddap: 'WaterTempSurfaceStuckValueQC' },
    { viewer: 'specificConductance', erddap: 'SpCondSurface' },
    { viewer: 'oxygen', erddap: 'O2Surface' },
    { viewer: 'oxygenDespike', erddap: 'O2SurfaceDespike' },
    { viewer: 'oxygenGlobalRangeQC', erddap: 'O2SurfaceGlobalRangeQC' },
    { viewer: 'oxygenStuckValueQC', erddap: 'O2SurfaceStuckValueQC' },
    { viewer: 'salinity', erddap: 'SalinitySurface' },
    { viewer: 'salinityDespike', erddap: 'SalinitySurfaceDespike' },
    { viewer: 'salinityGlobalRangeQC', erddap: 'SalinitySurfaceGlobalRangeQC' },
    { viewer: 'salinitySeasonalNBRangeQC', erddap: 'SalinitySurfaceSeasonalNBRangeQC' },
    { viewer: 'salinityStuckValueQC', erddap: 'SalinitySurfaceStuckValueQC' },
    { viewer: 'chlorophyll', erddap: 'ChlorophyllSurface' },
    { viewer: 'chlorophyllDespike', erddap: 'ChlorophyllSurfaceDespike' },
    { viewer: 'chlorophyllSeasonalNBRangeQC', erddap: 'ChlorophyllSurfaceSeasonalNBRangeQC' },
    { viewer: 'chlorophyllStuckValueQC', erddap: 'ChlorophyllSurfaceStuckValueQC' },
    { viewer: 'turbidity', erddap: 'TurbiditySurface' },
    { viewer: 'turbidityDespike', erddap: 'TurbiditySurfaceDespike' },
    { viewer: 'turbidityStuckValueQC', erddap: 'TurbiditySurfaceStuckValueQC' },
    { viewer: 'pH', erddap: 'pHSurface' },
    { viewer: 'pHDespike', erddap: 'pHSurfaceDespike' },
    { viewer: 'pHGlobalRangeQC', erddap: 'pHSurfaceGlobalRangeQC' },
    { viewer: 'pHStuckValueQC', erddap: 'pHSurfaceStuckValueQC' },
    { viewer: 'phosphate', erddap: 'PhosphateSurface' },
    { viewer: 'phosphateQCFlag', erddap: 'PhosphateSurfaceQCFlag' },
    { viewer: 'phosphateBubbleFlag', erddap: 'PhosphateSurfaceBubbleFlag' },
    { viewer: 'phosphateCoVFlag', erddap: 'PhosphateSurfaceCoVFlag' },
    { viewer: 'phosphateLowSigFlag', erddap: 'PhosphateSurfaceLowSigFlag' },
    { viewer: 'phosphateOoRFlag', erddap: 'PhosphateSurfaceOoRFlag' },
    { viewer: 'phosphateMixingFlag', erddap: 'PhosphateSurfaceMixingFlag' },
    { viewer: 'hydrocycleCalibrationFlag', erddap: 'HydrocycleCalibrationFlag' },
    { viewer: 'phosphateDespike', erddap: 'PhosphateSurfaceDespike' },
    { viewer: 'phosphateSeasonalNBRangeQC', erddap: 'PhosphateSurfaceSeasonalNBRangeQC' },
    { viewer: 'phosphateStuckValueQC', erddap: 'PhosphateSurfaceStuckValueQC' },
    { viewer: 'nitrate', erddap: 'NitrateNSurface' },
    { viewer: 'nitrateDespike', erddap: 'NitrateNSurfaceDespike' },
    { viewer: 'nitrateGlobalRangeQC', erddap: 'NitrateNSurfaceGlobalRangeQC' },
    { viewer: 'nitrateSeasonalNBRangeQC', erddap: 'NitrateNSurfaceSeasonalNBRangeQC' },
    { viewer: 'nitrateStuckValueQC', erddap: 'NitrateNSurfaceStuckValueQC' },
    { viewer: 'par', erddap: 'PARSurface' },
    { viewer: 'parDespike', erddap: 'PARSurfaceDespike' },
    { viewer: 'parInstrumentRangeQC', erddap: 'PARSurfaceInstrumentRangeQC' },
    { viewer: 'parStuckValueQC', erddap: 'PARSurfaceStuckValueQC' },
    { viewer: 'windSpeedAverage', erddap: 'WindSpeedAverage' },
    { viewer: 'windSpeedAverageDespike', erddap: 'WindSpeedAverageDespike' },
    { viewer: 'windSpeedAverageInstrumentRangeQC', erddap: 'WindSpeedAverageInstrumentRangeQC' },
    { viewer: 'windSpeedAverageStuckValueQC', erddap: 'WindSpeedAverageStuckValueQC' },
    { viewer: 'windDirectionFrom', erddap: 'WindDirectionFrom' },
    { viewer: 'windDirectionFromInstrumentRangeQC', erddap: 'WindDirectionFromInstrumentRangeQC' },
    { viewer: 'windDirectionFromStuckValueQC', erddap: 'WindDirectionFromStuckValueQC' },
    { viewer: 'windSpeedGust', erddap: 'WindSpeedGust' },
    { viewer: 'windSpeedGustDespike', erddap: 'WindSpeedGustDespike' },
    { viewer: 'windSpeedGustInstrumentRangeQC', erddap: 'WindSpeedGustInstrumentRangeQC' },
    { viewer: 'windSpeedGustStuckValueQC', erddap: 'WindSpeedGustStuckValueQC' },
    { viewer: 'windGustDirectionFrom', erddap: 'WindGustDirectionFrom' },
    {
      viewer: 'windGustDirectionFromInstrumentRangeQC',
      erddap: 'WindGustDirectionFromInstrumentRangeQC',
    },
    { viewer: 'windGustDirectionFromStuckValueQC', erddap: 'WindGustDirectionFromStuckValueQC' },
    { viewer: 'airTemperature', erddap: 'AirTemp' },
    { viewer: 'airTemperatureDespike', erddap: 'AirTempDespike' },
    { viewer: 'airTemperatureInstrumentRangeQC', erddap: 'AirTempInstrumentRangeQC' },
    { viewer: 'airTemperatureStuckValueQC', erddap: 'AirTempStuckValueQC' },
    { viewer: 'airPressure', erddap: 'AirPressure' },
    { viewer: 'airPressureDespike', erddap: 'AirPressureDespike' },
    { viewer: 'airPressureInstrumentRangeQC', erddap: 'AirPressureInstrumentRangeQC' },
    { viewer: 'airPressureStuckValueQC', erddap: 'AirPressureStuckValueQC' },
    { viewer: 'humiditySurface', erddap: 'HumiditySurface' },
    { viewer: 'humiditySurfaceDespike', erddap: 'HumiditySurfaceDespike' },
    { viewer: 'humiditySurfaceInstrumentRangeQC', erddap: 'HumiditySurfaceInstrumentRangeQC' },
    { viewer: 'humiditySurfaceStuckValueQC', erddap: 'HumiditySurfaceStuckValueQC' },
    { viewer: 'precipitation', erddap: 'Precipitation' },
    { viewer: 'precipitationDespike', erddap: 'PrecipitationDespike' },
    { viewer: 'precipitationInstrumentRangeQC', erddap: 'PrecipitationInstrumentRangeQC' },
    { viewer: 'precipitationStuckValueQC', erddap: 'PrecipitationStuckValueQC' },
    { viewer: 'solarIrradiance', erddap: 'SolarIrradiance' },
    { viewer: 'solarIrradianceDespike', erddap: 'SolarIrradianceDespike' },
    { viewer: 'solarIrradianceInstrumentRangeQC', erddap: 'SolarIrradianceInstrumentRangeQC' },
    { viewer: 'solarIrradianceStuckValueQC', erddap: 'SolarIrradianceStuckValueQC' },
  ];

function erddapToViewer(v: RealTimeBuoyErddapVariable) {
  const foundPair = VARIABLE_PAIRS.find((pair) => pair.erddap === v);
  if (foundPair !== undefined) return foundPair.viewer;
  throw new Error(`No viewer variable for erddap variable "${v}"`);
}

function viewerToErddap(v: RealTimeBuoyViewerVariable) {
  const foundPair = VARIABLE_PAIRS.find((pair) => pair.viewer === v);
  if (foundPair !== undefined) return foundPair.erddap;
  throw new Error(`No viewer variable for erddap variable "${v}"`);
}

export const REAL_TIME_VARIABLE_CONVERTER = {
  erddapToViewer,
  viewerToErddap,
};

/**
 * Buoy Summary
 */

const ZodFetchedRealTimeBuoySummary = z.object({
  FluorescenceCounts: z.number(),
  FDOM: z.number(),
  FDOMDespike: z.number(),
  FDOMGlobalRangeQC: z.number(),
  FDOMStuckValueQC: z.number(),
  WaterTempSurface: z.number(),
  WaterTempSurfaceDespike: z.number(),
  WaterTempSurfaceGlobalRangeQC: z.number(),
  WaterTempSurfaceSeasonalNBRangeQC: z.number(),
  WaterTempSurfaceStuckValueQC: z.number(),
  SpCondSurface: z.number(),
  O2Surface: z.number(),
  O2SurfaceDespike: z.number(),
  O2SurfaceGlobalRangeQC: z.number(),
  O2SurfaceStuckValueQC: z.number(),
  SalinitySurface: z.number(),
  SalinitySurfaceDespike: z.number(),
  SalinitySurfaceGlobalRangeQC: z.number(),
  SalinitySurfaceSeasonalNBRangeQC: z.number(),
  SalinitySurfaceStuckValueQC: z.number(),
  ChlorophyllSurface: z.number(),
  ChlorophyllSurfaceDespike: z.number(),
  ChlorophyllSurfaceSeasonalNBRangeQC: z.number(),
  ChlorophyllSurfaceStuckValueQC: z.number(),
  TurbiditySurface: z.number(),
  TurbiditySurfaceDespike: z.number(),
  TurbiditySurfaceStuckValueQC: z.number(),
  pHSurface: z.number(),
  pHSurfaceDespike: z.number(),
  pHSurfaceGlobalRangeQC: z.number(),
  pHSurfaceStuckValueQC: z.number(),
  PhosphateSurface: z.number(),
  PhosphateSurfaceQCFlag: z.number(),
  PhosphateSurfaceBubbleFlag: z.number(),
  PhosphateSurfaceCoVFlag: z.number(),
  PhosphateSurfaceLowSigFlag: z.number(),
  PhosphateSurfaceOoRFlag: z.number(),
  PhosphateSurfaceMixingFlag: z.number(),
  HydrocycleCalibrationFlag: z.number(),
  PhosphateSurfaceDespike: z.number(),
  PhosphateSurfaceSeasonalNBRangeQC: z.number(),
  PhosphateSurfaceStuckValueQC: z.number(),
  NitrateNSurface: z.number(),
  NitrateNSurfaceDespike: z.number(),
  NitrateNSurfaceGlobalRangeQC: z.number(),
  NitrateNSurfaceSeasonalNBRangeQC: z.number(),
  NitrateNSurfaceStuckValueQC: z.number(),
  PARSurface: z.number(),
  PARSurfaceDespike: z.number(),
  PARSurfaceInstrumentRangeQC: z.number(),
  PARSurfaceStuckValueQC: z.number(),
  WindSpeedAverage: z.number(),
  WindSpeedAverageDespike: z.number(),
  WindSpeedAverageInstrumentRangeQC: z.number(),
  WindSpeedAverageStuckValueQC: z.number(),
  WindDirectionFrom: z.number(),
  WindDirectionFromInstrumentRangeQC: z.number(),
  WindDirectionFromStuckValueQC: z.number(),
  WindSpeedGust: z.number(),
  WindSpeedGustDespike: z.number(),
  WindSpeedGustInstrumentRangeQC: z.number(),
  WindSpeedGustStuckValueQC: z.number(),
  WindGustDirectionFrom: z.number(),
  WindGustDirectionFromInstrumentRangeQC: z.number(),
  WindGustDirectionFromStuckValueQC: z.number(),
  AirTemp: z.number(),
  AirTempDespike: z.number(),
  AirTempInstrumentRangeQC: z.number(),
  AirTempStuckValueQC: z.number(),
  AirPressure: z.number(),
  AirPressureDespike: z.number(),
  AirPressureInstrumentRangeQC: z.number(),
  AirPressureStuckValueQC: z.number(),
  HumiditySurface: z.number(),
  HumiditySurfaceDespike: z.number(),
  HumiditySurfaceInstrumentRangeQC: z.number(),
  HumiditySurfaceStuckValueQC: z.number(),
  Precipitation: z.number(),
  PrecipitationDespike: z.number(),
  PrecipitationInstrumentRangeQC: z.number(),
  PrecipitationStuckValueQC: z.number(),
  SolarIrradiance: z.number(),
  SolarIrradianceDespike: z.number(),
  SolarIrradianceInstrumentRangeQC: z.number(),
  SolarIrradianceStuckValueQC: z.number(),
  station_name: z.string(),
  time: z.string().datetime(),
  buoyId: z.string(),
});

export type FetchedRealTimeBuoySummary = z.infer<typeof ZodFetchedRealTimeBuoySummary>;

export async function fetchRealTimeSummaryData(bustCache = false) {
  const fetchedSummaryData = await fetchSummaryData('buoy-telemetry', bustCache);
  if (validateFetchedRealTimeBuoySummary(fetchedSummaryData)) {
    return fetchedSummaryData.map(formatRealTimeSummaryData);
  } else {
    throw new Error('Invalid data received when fetching RI Buoy Summary Data.');
  }
}

function validateFetchedRealTimeBuoySummary(
  summary: unknown[]
): summary is FetchedRealTimeBuoySummary[] {
  try {
    z.array(ZodFetchedRealTimeBuoySummary).parse(summary);
    return true;
  } catch (ex) {
    return false;
  }
}

function formatRealTimeSummaryData(fetchedData: FetchedRealTimeBuoySummary) {
  return {
    stationName: fetchedData.station_name,
    time: new Date(fetchedData.station_name),
    buoyId: fetchedData.buoyId,
    fluorescenceCounts: fetchedData.FluorescenceCounts,
    fdom: fetchedData.FDOM,
    fdomDespike: fetchedData.FDOMDespike,
    fdmonGlobalRangeQC: fetchedData.FDOMGlobalRangeQC,
    fdomStuckValueQC: fetchedData.FDOMStuckValueQC,
    waterTempSurface: fetchedData.WaterTempSurface,
    waterTempSurfaceDespike: fetchedData.WaterTempSurfaceDespike,
    waterTemperatureGlobalRangeQC: fetchedData.WaterTempSurfaceGlobalRangeQC,
    waterTemperatureSeasonalNBRangeQC: fetchedData.WaterTempSurfaceSeasonalNBRangeQC,
    waterTemperatureStuckValueQC: fetchedData.WaterTempSurfaceStuckValueQC,
    specificConductance: fetchedData.SpCondSurface,
    oxygen: fetchedData.O2Surface,
    oxygenDespike: fetchedData.O2SurfaceDespike,
    oxygenGlobalRangeQC: fetchedData.O2SurfaceGlobalRangeQC,
    oxygenStuckValueQC: fetchedData.O2SurfaceStuckValueQC,
    salinity: fetchedData.SalinitySurface,
    salinityDespike: fetchedData.SalinitySurfaceDespike,
    salinityGlobalRangeQC: fetchedData.SalinitySurfaceGlobalRangeQC,
    salinitySeasonalNBRangeQC: fetchedData.SalinitySurfaceSeasonalNBRangeQC,
    salinityStuckValueQC: fetchedData.SalinitySurfaceStuckValueQC,
    chlorophyll: fetchedData.ChlorophyllSurface,
    chlorophyllDespike: fetchedData.ChlorophyllSurfaceDespike,
    chlorophyllSeasonalNBRangeQC: fetchedData.ChlorophyllSurfaceSeasonalNBRangeQC,
    chlorophyllStuckValueQC: fetchedData.ChlorophyllSurfaceStuckValueQC,
    turbidity: fetchedData.TurbiditySurface,
    turbidityDespike: fetchedData.TurbiditySurfaceDespike,
    turbidityStuckValueQC: fetchedData.TurbiditySurfaceStuckValueQC,
    pH: fetchedData.pHSurface,
    pHDespike: fetchedData.pHSurfaceDespike,
    pHGlobalRangeQC: fetchedData.pHSurfaceGlobalRangeQC,
    pHStuckValueQC: fetchedData.pHSurfaceStuckValueQC,
    phosphate: fetchedData.PhosphateSurface,
    phosphateQCFlag: fetchedData.PhosphateSurfaceQCFlag,
    phosphateBubbleFlag: fetchedData.PhosphateSurfaceBubbleFlag,
    phosphateCoVFlag: fetchedData.PhosphateSurfaceCoVFlag,
    phosphateLowSigFlag: fetchedData.PhosphateSurfaceLowSigFlag,
    phosphateOoRFlag: fetchedData.PhosphateSurfaceOoRFlag,
    phosphateMixingFlag: fetchedData.PhosphateSurfaceMixingFlag,
    hydrocycleCalibrationFlag: fetchedData.HydrocycleCalibrationFlag,
    phosphateDespike: fetchedData.PhosphateSurfaceDespike,
    phosphateSeasonalNBRangeQC: fetchedData.PhosphateSurfaceSeasonalNBRangeQC,
    phosphateStuckValueQC: fetchedData.PhosphateSurfaceStuckValueQC,
    nitrate: fetchedData.NitrateNSurface,
    nitrateDespike: fetchedData.NitrateNSurfaceDespike,
    nitrateGlobalRangeQC: fetchedData.NitrateNSurfaceGlobalRangeQC,
    nitrateSeasonalNBRangeQC: fetchedData.NitrateNSurfaceSeasonalNBRangeQC,
    nitrateStuckValueQC: fetchedData.NitrateNSurfaceStuckValueQC,
    par: fetchedData.PARSurface,
    parDespike: fetchedData.PARSurfaceDespike,
    parInstrumentRangeQC: fetchedData.PARSurfaceInstrumentRangeQC,
    parStuckValueQC: fetchedData.PARSurfaceStuckValueQC,
    windSpeedAverage: fetchedData.WindSpeedAverage,
    windSpeedAverageDespike: fetchedData.WindSpeedAverageDespike,
    windSpeedAverageInstrumentRangeQC: fetchedData.WindSpeedAverageInstrumentRangeQC,
    windSpeedAverageStuckValueQC: fetchedData.WindSpeedAverageStuckValueQC,
    windDirectionFrom: fetchedData.WindDirectionFrom,
    windDirectionFromInstrumentRangeQC: fetchedData.WindDirectionFromInstrumentRangeQC,
    windDirectionFromStuckValueQC: fetchedData.WindDirectionFromStuckValueQC,
    windSpeedGust: fetchedData.WindSpeedGust,
    windSpeedGustDespike: fetchedData.WindSpeedGustDespike,
    windSpeedGustInstrumentRangeQC: fetchedData.WindSpeedGustInstrumentRangeQC,
    windSpeedGustStuckValueQC: fetchedData.WindSpeedGustStuckValueQC,
    windGustDirectionFrom: fetchedData.WindGustDirectionFrom,
    windGustDirectionFromInstrumentRangeQC: fetchedData.WindGustDirectionFromInstrumentRangeQC,
    windGustDirectionFromStuckValueQC: fetchedData.WindGustDirectionFromStuckValueQC,
    airTemperature: fetchedData.AirTemp,
    airTemperatureDespike: fetchedData.AirTempDespike,
    airTemperatureInstrumentRangeQC: fetchedData.AirTempInstrumentRangeQC,
    airTemperatureStuckValueQC: fetchedData.AirTempStuckValueQC,
    airPressure: fetchedData.AirPressure,
    airPressureDespike: fetchedData.AirPressureDespike,
    airPressureInstrumentRangeQC: fetchedData.AirPressureInstrumentRangeQC,
    airPressureStuckValueQC: fetchedData.AirPressureStuckValueQC,
    humiditySurface: fetchedData.HumiditySurface,
    humiditySurfaceDespike: fetchedData.HumiditySurfaceDespike,
    humiditySurfaceInstrumentRangeQC: fetchedData.HumiditySurfaceInstrumentRangeQC,
    humiditySurfaceStuckValueQC: fetchedData.HumiditySurfaceStuckValueQC,
    precipitation: fetchedData.Precipitation,
    precipitationDespike: fetchedData.PrecipitationDespike,
    precipitationInstrumentRangeQC: fetchedData.PrecipitationInstrumentRangeQC,
    precipitationStuckValueQC: fetchedData.PrecipitationStuckValueQC,
    solarIrradiance: fetchedData.SolarIrradiance,
    solarIrradianceDespike: fetchedData.SolarIrradianceDespike,
    solarIrradianceInstrumentRangeQC: fetchedData.SolarIrradianceInstrumentRangeQC,
    solarIrradianceStuckValueQC: fetchedData.SolarIrradianceStuckValueQC,
  };
}

export type RealTimeSummaryData = ReturnType<typeof formatRealTimeSummaryData>;

/**
 * Buoy Coordinates
 */

const ZodFetchedRealTimeBuoyCoordinate = z.object({
  station_name: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  buoyId: z.string(),
});

export type FetchedRealTimeBuoyCoordinate = z.infer<typeof ZodFetchedRealTimeBuoyCoordinate>;

export async function fetchRealTimeBuoyCoordinates() {
  const fetchedCoordinates = await fetchBuoyCoordinates('buoy-telemetry');
  if (validateFetchedRealTimeBuoyCoordinate(fetchedCoordinates)) {
    return fetchedCoordinates.map(formatRealTimeBuoyCoordinate);
  } else {
    throw new Error('Invalid data received when fetching RI Buoy Coordinates');
  }
}

function validateFetchedRealTimeBuoyCoordinate(
  coordinates: unknown[]
): coordinates is FetchedRealTimeBuoyCoordinate[] {
  try {
    z.array(ZodFetchedRealTimeBuoyCoordinate).parse(coordinates);
    return true;
  } catch (ex) {
    return false;
  }
}

function formatRealTimeBuoyCoordinate(fetchedData: FetchedRealTimeBuoyCoordinate) {
  return {
    stationName: fetchedData.station_name,
    buoyId: fetchedData.buoyId,
    longitude: fetchedData.longitude,
    latitude: fetchedData.latitude,
  };
}

export type RealTimeBuoyCoordinate = ReturnType<typeof formatRealTimeBuoyCoordinate>;

/**
 * Buoy Data
 */

const ZodFetchedRealTimeBuoyData = z.object({
  data: z.array(
    z.object({
      variable: z.enum(REAL_TIME_BUOY_ERDDAP_VARIABLES),
      value: z.union([z.number(), z.null()]),
      station_name: z.string(),
      time: z.union([z.string().datetime(), z.number()]),
      units: z.string(),
    })
  ),
});

type FetchedRealTimeBuoyData = z.infer<typeof ZodFetchedRealTimeBuoyData>['data'][number];

export async function fetchRealTimeBuoyData(
  ids: string[],
  vars: RealTimeBuoyViewerVariable[],
  startDate: Date,
  endDate: Date
) {
  const fetchedRealTimeBuoyData = await fetchBuoyData(
    'buoy-telemetry',
    ids,
    vars.map(viewerToErddap),
    startDate,
    endDate
  );
  if (validateFetchedRealTimeBuoyData(fetchedRealTimeBuoyData)) {
    return fetchedRealTimeBuoyData.data.map(formatRealTimeBuoyData);
  } else {
    throw new Error('Invalid data received when fetching RI Buoy Summary Data.');
  }
}

function validateFetchedRealTimeBuoyData(
  buoyData: unknown
): buoyData is { data: FetchedRealTimeBuoyData[] } {
  try {
    ZodFetchedRealTimeBuoyData.parse(buoyData);
    return true;
  } catch (ex) {
    return false;
  }
}

function formatRealTimeBuoyData(buoyData: FetchedRealTimeBuoyData) {
  return {
    variable: REAL_TIME_VARIABLE_CONVERTER.erddapToViewer(buoyData.variable),
    value: buoyData.value || undefined,
    stationName: buoyData.station_name,
    time: new Date(buoyData.time),
    units: buoyData.units,
  };
}

export type RealTimeBuoyData = ReturnType<typeof formatRealTimeBuoyData>;
