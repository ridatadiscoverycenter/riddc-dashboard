import { z } from 'zod';
import { fetchSummaryData, fetchBuoyData, fetchBuoyCoordinates } from './buoy';

/**
 * Types
 */

export const REAL_TIME_BUOY_VARIABLES = [
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

export type RealTimeBuoyVariable = (typeof REAL_TIME_BUOY_VARIABLES)[number];

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
      variable: z.enum(REAL_TIME_BUOY_VARIABLES),
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
  vars: RealTimeBuoyVariable[],
  startDate: Date,
  endDate: Date
) {
  const fetchedRealTimeBuoyData = await fetchBuoyData(
    'buoy-telemetry',
    ids,
    vars,
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
    variable: buoyData.variable,
    value: buoyData.value || undefined,
    stationName: buoyData.station_name,
    time: new Date(buoyData.time),
    units: buoyData.units,
  };
}

export type RealTimeBuoyData = ReturnType<typeof formatRealTimeBuoyData>;
