import { PageProps } from '@/types';
import {
  MA_BUOY_VIEWER_VARIABLES,
  MaBuoyViewerVariable,
  RI_BUOY_VIEWER_VARIABLES,
  RiBuoyViewerVariable,
} from '../data/api/buoy';

type Param = Exclude<PageProps['searchParams'], undefined>[string];
type RiOrMa = 'ri' | 'ma';
type parseVariablesHelper<T extends RiOrMa> = T extends 'ri'
  ? RiBuoyViewerVariable[]
  : T extends 'ma'
    ? MaBuoyViewerVariable[]
    : never;

// parseVariablesHelper
//type ParmsWhat = {
//  buoys: ReturnType<typeof parseBuoyIds>;
//  start: ReturnType<typeof parseDate>;
//  end: ReturnType<typeof parseDate>;
//};

//type GetParamsReturn<T extends RiOrMa> = T extends 'ri'
//  ? ParmsWhat & { vars: parseVariablesHelper<'ri'> }
//  : T extends 'ma'
//    ? ParmsWhat & { vars: parseVariablesHelper<'ma'> }
//    : never;

export const ERROR_CODES = {
  NO_SEARCH_PARAMS: 'no-search-params',
  MISSING_START_DATE: 'No start date given. Select a start date, and click "explore"!',
  INVALID_START_DATE_TYPE:
    'Received multiple start dates. Delete one from the URL to view the vizualiation.',
  BAD_START_DATE: "The given start date couldn't be parsed. Select a different start date.",
  MISSING_END_DATE: 'No end date given. Select an end date, and click "explore"!',
  INVALID_END_DATE_TYPE:
    'Received multiple end dates. Delete one from the URL to view the vizualiation.',
  BAD_END_DATE: "The given end date couldn't be parsed. Select a different end date.",
  BAD_DATE_ORDER: 'The end date needs to be after the start date. Select a valid pair of dates.',
  NO_BUOYS: 'No buoys selected for this visualization. Select a buoy, and click "explore"!',
  BAD_BUOYS:
    'Multiple different buoy parameters were given. Delete one from the URL to view the vizualization.',
  NO_VARS:
    'No variables were selected for this visualization. Select up to 4, and click "explore"!',
  BAD_VARS:
    'Multiple different variable parameters were given. Delete one from the URL to view the vizualization.',
  INVALID_VARS:
    'An invalid variable was selected for the visualization. Select a different variable to view the vizualization.',
};
/*
export function getParams<T extends RiOrMa>(
  searchParams: PageProps['searchParams'],
  region: T
): GetParamsReturn<T> | string {
  try {
    if (searchParams === undefined) throw new Error(ERROR_CODES.NO_SEARCH_PARAMS);

    // Get relevant data from search params.

    const buoys = searchParams['buoys'];
    const variables = searchParams['vars'];
    const startDate = searchParams['start'];
    const endDate = searchParams['end'];

    if (
      buoys === undefined &&
      variables === undefined &&
      startDate === undefined &&
      endDate === undefined
    )
      throw new Error(ERROR_CODES.NO_SEARCH_PARAMS);
    const start = parseDate(startDate, 'start');
    const end = parseDate(endDate, 'end');
    if (start.valueOf() >= end.valueOf()) throw new Error(ERROR_CODES.BAD_DATE_ORDER);
    return {
      buoys: parseBuoyIds(buoys),
      vars: region === 'ri' ? parseVariables(variables, region) : parseVariables(variables, region),
      start: parseDate(startDate, 'start'),
      end: parseDate(endDate, 'end'),
    } as GetParamsReturn<T>;
  } catch (ex) {
    return (ex as { message: string }).message;
  }
}
*/
export type ParsedParam<T> = { error: string; value: undefined } | { error: undefined; value: T };

export function parseParamBuoyIds(buoysParam: Param): ParsedParam<string[]> {
  if (buoysParam === undefined) return { error: ERROR_CODES.NO_BUOYS, value: undefined };
  if (buoysParam instanceof Array) return { error: ERROR_CODES.BAD_BUOYS, value: undefined };
  return { error: undefined, value: buoysParam.split(',') };
}

export function parseParamBuoyVariablesRI(
  variablesParam: Param
): ParsedParam<RiBuoyViewerVariable[]> {
  if (variablesParam === undefined) return { error: ERROR_CODES.NO_VARS, value: undefined };
  if (variablesParam instanceof Array) return { error: ERROR_CODES.BAD_VARS, value: undefined };
  const variables = variablesParam.split(',');
  if (variables.every((vari) => RI_BUOY_VIEWER_VARIABLES.includes(vari as RiBuoyViewerVariable)))
    return { error: undefined, value: variables as RiBuoyViewerVariable[] };
  return { error: ERROR_CODES.INVALID_VARS, value: undefined };
}

export function parseParamBuoyVariablesMA(
  variablesParam: Param
): ParsedParam<MaBuoyViewerVariable[]> {
  if (variablesParam === undefined) return { error: ERROR_CODES.NO_VARS, value: undefined };
  if (variablesParam instanceof Array) return { error: ERROR_CODES.BAD_VARS, value: undefined };
  const variables = variablesParam.split(',');
  if (variables.every((vari) => MA_BUOY_VIEWER_VARIABLES.includes(vari as MaBuoyViewerVariable)))
    return { error: undefined, value: variables as MaBuoyViewerVariable[] };
  return { error: ERROR_CODES.INVALID_VARS, value: undefined };
}

export function parseParamDate(dateParam: Param, dateType: 'start' | 'end'): ParsedParam<Date> {
  if (dateParam === undefined)
    return {
      error: dateType === 'start' ? ERROR_CODES.MISSING_START_DATE : ERROR_CODES.MISSING_END_DATE,
      value: undefined,
    };
  if (dateParam instanceof Array)
    return {
      error:
        dateType === 'start'
          ? ERROR_CODES.INVALID_START_DATE_TYPE
          : ERROR_CODES.INVALID_END_DATE_TYPE,
      value: undefined,
    };
  const parsedStartDate = new Date(dateParam);
  if (isNaN(parsedStartDate.valueOf()))
    return {
      error: dateType === 'start' ? ERROR_CODES.BAD_START_DATE : ERROR_CODES.BAD_END_DATE,
      value: undefined,
    };
  return { error: undefined, value: parsedStartDate };
}

function parseVariables(variablesParam: Param, region: RiOrMa): parseVariablesHelper<RiOrMa> {
  if (variablesParam === undefined) throw new Error(ERROR_CODES.NO_VARS);
  if (variablesParam instanceof Array) throw new Error(ERROR_CODES.BAD_VARS);
  const variables = variablesParam.split(',');
  if (region === 'ri') {
    if (variables.every((vari) => RI_BUOY_VIEWER_VARIABLES.includes(vari as RiBuoyViewerVariable)))
      return variables as RiBuoyViewerVariable[];
  } else if (region === 'ma') {
    if (variables.every((vari) => MA_BUOY_VIEWER_VARIABLES.includes(vari as MaBuoyViewerVariable)))
      return variables as MaBuoyViewerVariable[];
  }
  throw new Error(ERROR_CODES.INVALID_VARS);
}
