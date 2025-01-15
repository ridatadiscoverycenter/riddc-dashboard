import { CONFIG, RI_VARIABLE_CONVERTER, MA_VARIABLE_CONVERTER, type RiBuoyViewerVariable, type MaBuoyViewerVariable } from '@/utils/data/api/buoy';

const BASE_URL = 'https://pricaimcit.services.brown.edu/erddap/tabledap';

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

export const ERDDAP_DATASET_LINK_RI_BUOY =
  'https://pricaimcit.services.brown.edu/erddap/tabledap/combined_e784_bee5_492e.html';

export function createRiBuoyDownloadUrl(
  fileFormat: DF,
  variables: RiBuoyViewerVariable[],
  buoys: string[],
  time: StartAndOrEndDate | undefined = undefined
) {
  const vars = [
    ...variables.map(RI_VARIABLE_CONVERTER.viewerToErddap),
    'time',
    'latitude',
    'longitude',
    'station_name',
  ].join(',');
  const stations = buoys.join('|');
  const start = time && time.start ? `&time>=${time.start.toISOString().split('T')[0]}` : '';
  const end = time && time.end ? `&time<=${time.end.toISOString().split('T')[0]}` : '';
  return createDownloadUrl(
    CONFIG['ri-buoy'].datasetId,
    fileFormat,
    `${vars}&station_name=~"(${stations})"${start}${end}`
  );
}

export function createMaBuoyDownloadUrl(
  fileFormat: DF,
  variables: MaBuoyViewerVariable[],
  buoys: string[],
  time: StartAndOrEndDate | undefined = undefined
) {
  const vars = [
    ...variables.map(MA_VARIABLE_CONVERTER.viewerToErddap),
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
