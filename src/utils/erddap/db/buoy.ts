import { z } from 'zod';
import { Comparators, extractValues, queryErddapTable } from './db';

type RiBuoyParams = string | Array<RiBuoyParamTime>;
type RiBuoyParamTime = { key: 'time'; comparator: Comparators; value: Date };

export async function fetchRiBuoy(params: RiBuoyParams = '') {
  try {
    const samples = await queryRiBuoy(params);
    return formatRiBuoy(samples);
  } catch (ex) {
    throw new Error(`An error occured while fetching Rhode Island Buoy Data. ${ex}`);
  }
}

export function formatRiBuoy(buoyData: RiBuoyRow[]): RiBuoyData[] {
  return buoyData.map(
    ({
      time,
      stationName,
      latitude,
      longitude,
      chlorophyllsurface,
      o2percentsurface,
      depth,
      phsurface,
      spcondsurface,
      fspercentsurface,
      o2surface,
      watertempsurface,
      salinitysurface,
      densitysurface,
      salinitybottom,
      o2percentbottom,
      depthbottom,
      phbottom,
      turbiditybottom,
      spcondbottom,
      watertempbottom,
      o2bottom,
      densitybottom,
    }) => ({
      time: new Date(time),
      station: stationName,
      latitude,
      longitude,
      bottom: {
        oxygenPercent: o2percentbottom ?? undefined,
        oxygen: o2bottom ?? undefined,
        salinity: salinitybottom ?? undefined,
        ph: phbottom ?? undefined,
        depth: depthbottom ?? undefined,
        turbidity: turbiditybottom ?? undefined,
        specificConductance: spcondbottom ?? undefined,
        temperature: watertempbottom ?? undefined,
        density: densitybottom ?? undefined,
      } as RiBuoyReadingBottom,
      surface: {
        oxygenPercent: o2percentsurface ?? undefined,
        oxygen: o2surface ?? undefined,
        salinity: salinitysurface ?? undefined,
        ph: phsurface ?? undefined,
        depth: depth ?? undefined,
        chlorophyll: chlorophyllsurface ?? undefined,
        totalFluorescence: fspercentsurface ?? undefined,
        specificConductance: spcondsurface ?? undefined,
        temperature: watertempsurface ?? undefined,
        density: densitysurface ?? undefined,
      } as RiBuoyReadingSurface,
    })
  );
}

export function getRiBuoyVarFromData(data: RiBuoyData, variable: RiBuoyVariable) {
  if (variable === RI_BUOY_VARIABLES_MAP.oxygenPercentBottom) return data.bottom.oxygenPercent;
  if (variable === RI_BUOY_VARIABLES_MAP.oxygenBottom) return data.bottom.oxygen;
  if (variable === RI_BUOY_VARIABLES_MAP.salinityBottom) return data.bottom.salinity;
  if (variable === RI_BUOY_VARIABLES_MAP.phBottom) return data.bottom.oxygenPercent;
  if (variable === RI_BUOY_VARIABLES_MAP.depthBottom) return data.bottom.oxygenPercent;
  if (variable === RI_BUOY_VARIABLES_MAP.turbidityBottom) return data.bottom.oxygenPercent;
  if (variable === RI_BUOY_VARIABLES_MAP.specCondBottom) return data.bottom.specificConductance;
  if (variable === RI_BUOY_VARIABLES_MAP.tempBottom) return data.bottom.temperature;
  if (variable === RI_BUOY_VARIABLES_MAP.densityBottom) return data.bottom.density;
  if (variable === RI_BUOY_VARIABLES_MAP.oxygenPercentSurface) return data.surface.oxygenPercent;
  if (variable === RI_BUOY_VARIABLES_MAP.oxygenSurface) return data.surface.oxygen;
  if (variable === RI_BUOY_VARIABLES_MAP.salinitySurface) return data.surface.salinity;
  if (variable === RI_BUOY_VARIABLES_MAP.phSurface) return data.surface.ph;
  if (variable === RI_BUOY_VARIABLES_MAP.depthSurface) return data.surface.depth;
  if (variable === RI_BUOY_VARIABLES_MAP.chlorophyllSurface) return data.surface.chlorophyll;
  if (variable === RI_BUOY_VARIABLES_MAP.totalFluorescenceSurface)
    return data.surface.totalFluorescence;
  if (variable === RI_BUOY_VARIABLES_MAP.specCondSurface) return data.surface.specificConductance;
  if (variable === RI_BUOY_VARIABLES_MAP.tempSurface) return data.surface.temperature;
  if (variable === RI_BUOY_VARIABLES_MAP.densitySurface) return data.surface.density;
  throw new Error(`No variable matching ${variable}`);
}

export const RI_BUOY_VARIABLES_MAP = {
  oxygenPercentBottom: 'Oxygen Percent (Bottom)',
  oxygenBottom: 'Oxygen (Bottom)',
  salinityBottom: 'Salinity (Bottom)',
  phBottom: 'PH (Bottom)',
  depthBottom: 'Depth (Bottom)',
  turbidityBottom: 'Turbidity (Bottom)',
  specCondBottom: 'Specific Conductance (Bottom)',
  tempBottom: 'Temperature (Bottom)',
  densityBottom: 'Density (Bottom)',
  oxygenPercentSurface: 'Oxygen Percent (Surface)',
  oxygenSurface: 'Oxygen (Surface)',
  salinitySurface: 'Salinity (Surface)',
  phSurface: 'PH (Surface)',
  depthSurface: 'Depth (Surface)',
  chlorophyllSurface: 'Chlorophyll (Surface)',
  totalFluorescenceSurface: 'Total Fluorescence (Surface)',
  specCondSurface: 'Specific Conductance (Surface)',
  tempSurface: 'Temperature (Surface)',
  densitySurface: 'Density (Surface)',
} as const;

export const RI_BUOY_VARIABLES = Object.values(
  RI_BUOY_VARIABLES_MAP
) as unknown as (typeof RI_BUOY_VARIABLES_MAP)[keyof typeof RI_BUOY_VARIABLES_MAP];

export type RiBuoyVariable = typeof RI_BUOY_VARIABLES;

export type RiBuoyData = {
  time: Date;
  station: string;
  latitude: number;
  longitude: number;
  surface: RiBuoyReadingSurface;
  bottom: RiBuoyReadingBottom;
};

type RiBuoyReadingSurface = RiBuoyReadingBase & {
  chlorophyll: number | undefined;
  totalFluorescence: number | undefined;
};

type RiBuoyReadingBottom = RiBuoyReadingBase & {
  turbidity: number | undefined;
};

type RiBuoyReadingBase = {
  oxygenPercent: number | undefined;
  oxygen: number | undefined;
  salinity: number | undefined;
  ph: number | undefined;
  depth: number | undefined;
  specificConductance: number | undefined;
  temperature: number | undefined;
  density: number | undefined;
};

export async function queryRiBuoy(params: RiBuoyParams = '') {
  const riBuoyData = extractValues(await queryErddapTable(BUOY_DATASETS.ri, params));
  console.log({ s: riBuoyData[0] });
  // Validate Formatted schema with Zod.
  if (dbRowIsRiBuoyRow(riBuoyData)) {
    return riBuoyData;
  } else {
    throw new Error('ERDDAP Buoy data did not match expected schema');
  }
}

export const BUOY_DATASETS = {
  ri: 'combined_e784_bee5_492e',
  osom: 'model_data_77bb_15c2_6ab3',
  ma: 'ma_buoy_data_a6c9_12eb_1ec5',
  plankton: 'plankton_time_series_7615_c513_ef8e',
  telemetry: 'buoy_telemetry_0ffe_2dc0_916e',
};

function dbRowIsRiBuoyRow(buoyData: unknown[]): buoyData is RiBuoyRow[] {
  try {
    z.array(ZodRiBuoyRow).parse(buoyData);
    return true;
  } catch (ex) {
    return false;
  }
}

type RiBuoyRow = {
  // Note (AM): These nulls are taken from one row, and numbers may be "number|null".
  time: string;
  stationName: string;
  latitude: number;
  longitude: number;
  o2percentsurface: number | null;
  o2percentbottom: number | null;
  depth: number | null;
  salinitybottom: number | null;
  phbottom: number | null;
  depthbottom: number | null;
  turbiditybottom: number | null;
  chlorophyllsurface: number | null;
  phsurface: number | null;
  spcondsurface: number | null;
  spcondbottom: number | null;
  fspercentsurface: number | null;
  watertempbottom: number | null;
  o2surface: number | null;
  o2bottom: number | null;
  watertempsurface: number | null;
  salinitysurface: number | null;
  densitysurface: number | null;
  densitybottom: number | null;
};

const ZodRiBuoyRow = z.object({
  time: z.string().datetime(),
  stationName: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  o2percentsurface: z.union([z.number(), z.null()]),
  o2percentbottom: z.union([z.number(), z.null()]),
  depth: z.union([z.number(), z.null()]),
  salinitybottom: z.union([z.number(), z.null()]),
  phbottom: z.union([z.number(), z.null()]),
  depthbottom: z.union([z.number(), z.null()]),
  turbiditybottom: z.union([z.number(), z.null()]),
  chlorophyllsurface: z.union([z.number(), z.null()]),
  phsurface: z.union([z.number(), z.null()]),
  spcondsurface: z.union([z.number(), z.null()]),
  spcondbottom: z.union([z.number(), z.null()]),
  fspercentsurface: z.union([z.number(), z.null()]),
  watertempbottom: z.union([z.number(), z.null()]),
  o2bottom: z.union([z.number(), z.null()]),
  o2surface: z.union([z.number(), z.null()]),
  watertempsurface: z.union([z.number(), z.null()]),
  salinitysurface: z.union([z.number(), z.null()]),
  densitysurface: z.union([z.number(), z.null()]),
  densitybottom: z.union([z.number(), z.null()]),
});
