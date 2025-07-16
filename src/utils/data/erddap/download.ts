import { ERDDAP_URL } from '@/static/urls';
import {
  CONFIG,
  MA_VARIABLE_CONVERTER,
  REAL_TIME_VARIABLE_CONVERTER,
  type RiBuoyVariable,
  type MaBuoyVariable,
  type RealTimeBuoyVariable,
  PlanktonVariable,
} from '@/utils/data/api/buoy';

const BASE_URL = `${ERDDAP_URL}/erddap/tabledap`;

export const DATA_FORMATS = [
  'htmlTable',
  'csv',
  'nc',
  'geoJson',
  'mat',
  'xhtml',
  'graph',
  'tsv',
  'html',
  'dataTable',
] as const;

export type DF = (typeof DATA_FORMATS)[number];

export function createDownloadUrl(datasetId: string, fileFormat: DF, params = '') {
  return `${BASE_URL}/${datasetId}.${fileFormat}${params && `?${params}`}`;
}

type StartAndOrEndDate =
  | { start: Date; end: Date }
  | { start: Date; end?: Date }
  | { start?: Date; end: Date }
  | { start?: Date; end?: Date };

// Note (AM): This probably shouldn't exist.
export const ERDDAP_DATASET_LINK_RI_BUOY =
  'https://pricaimcit.services.brown.edu/erddap/tabledap/combined_e784_bee5_492e.html';

export function createRiBuoyDownloadUrl(
  fileFormat: DF,
  variables: RiBuoyVariable[],
  buoys: string[],
  time: StartAndOrEndDate | undefined = undefined
) {
  const vars = [...variables, 'time', 'latitude', 'longitude', 'station_name'].join(',');
  const stations = buoys.join('|');
  const start = time && time.start ? `&time>=${time.start.toISOString().split('T')[0]}` : '';
  const end = time && time.end ? `&time<=${time.end.toISOString().split('T')[0]}` : '';
  return createDownloadUrl(
    CONFIG['ri-buoy'].datasetId,
    fileFormat,
    `${vars}&station_name=~"(${stations})"${start}${end}`
  );
}

export function createPlanktonDownloadUrl(
  fileFormat: DF,
  variables: PlanktonVariable[],
  buoys: string[],
  time: StartAndOrEndDate | undefined = undefined
) {
  const vars = [...variables, 'time', 'latitude', 'longitude', 'station_name'].join(',');
  const stations = buoys.join('|');
  const start = time && time.start ? `&time>=${time.start.toISOString().split('T')[0]}` : '';
  const end = time && time.end ? `&time<=${time.end.toISOString().split('T')[0]}` : '';
  return createDownloadUrl(
    CONFIG['plankton'].datasetId,
    fileFormat,
    `${vars}&station_name=~"(${stations})"${start}${end}`
  );
}

export function createMaBuoyDownloadUrl(
  fileFormat: DF,
  variables: MaBuoyVariable[],
  buoys: string[],
  time: StartAndOrEndDate | undefined = undefined
) {
  const vars = [
    ...variables,
    ...variables
      .map(MA_VARIABLE_CONVERTER.variableToQualifier)
      .filter((element) => element !== undefined),
    'time',
    'latitude',
    'longitude',
    'station_name',
  ].join(',');
  const stations = buoys.join('|');
  const start = time && time.start ? `&time>=${time.start.toISOString().split('T')[0]}` : '';
  const end = time && time.end ? `&time<=${time.end.toISOString().split('T')[0]}` : '';
  return createDownloadUrl(
    CONFIG['ma-buoy'].datasetId,
    fileFormat,
    `${vars}&station_name=~"(${stations})"${start}${end}`
  );
}

export function createRealTimeDownloadUrl(
  fileFormat: DF,
  variables: RealTimeBuoyVariable[],
  buoys: string[],
  time: StartAndOrEndDate | undefined = undefined
) {
  const vars = [
    ...variables,
    ...variables
      .map(REAL_TIME_VARIABLE_CONVERTER.variableToQualifier)
      .filter((element) => element !== undefined),
    'time',
    'latitude',
    'longitude',
    'station_name',
  ].join(',');
  const stations = buoys.join('|');
  const start = time && time.start ? `&time>=${time.start.toISOString().split('T')[0]}` : '';
  const end = time && time.end ? `&time<=${time.end.toISOString().split('T')[0]}` : '';
  return createDownloadUrl(
    CONFIG['buoy-telemetry'].datasetId,
    fileFormat,
    `${vars}&station_name=~"(${stations})"${start}${end}`
  );
}
