import { PageProps } from '@/types';
import {
  MA_BUOY_VARIABLES,
  MaBuoyVariable,
  OSOM_VARIABLES,
  OsomBuoyVariable,
  REAL_TIME_BUOY_VARIABLES,
  RealTimeBuoyVariable,
  RI_BUOY_VARIABLES,
  RiBuoyVariable,
} from '../data/api/buoy';
import { PLANKTON_VARIABLES, PlanktonVariable } from '../data/api/buoy/plankton';

export type ParsedParam<T> = { error: string; value: undefined } | { error: undefined; value: T };
type Param = Exclude<PageProps['searchParams'], undefined>[string];

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

/**
 * A helper function to find any errors resulting from search param parsing
 * and return the params as a typed map.
 * @param params A map of string / ParsedParams
 * @param missingDataErrorCodes A list of all "missing param" error codes for the required parameters.
 * @returns A map of correctly typed param data.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractParams<T extends Record<string, ParsedParam<any>>>(
  params: T,
  missingDataErrorCodes: string[]
): string | { [K in keyof T]: Exclude<T[K]['value'], undefined> } {
  // Get all errors from parsed param objects, filtering for correctly parsed params.
  const allErrors = Object.values(params)
    .map(({ error }) => error)
    .filter((error) => error !== undefined);
  // If every "missingDataErrorCode" is included in the set of allErrors,
  // set the paramsError to NO_SEARCH_PARAMS. Otherwise, select the
  // first error (which may be undefined).
  const paramsError = missingDataErrorCodes.every((missingDataErrorCode) =>
    allErrors.includes(missingDataErrorCode)
  )
    ? ERROR_CODES.NO_SEARCH_PARAMS
    : allErrors.pop();
  // If there was an encountered error, return it. Otherwise, send back the params data.
  if (paramsError) return paramsError;
  // Unwrap the map and extract the values which will be defined (there were no parsing errors).
  return Object.fromEntries(Object.entries(params).map(([k, v]) => [k, v.value])) as {
    [K in keyof T]: Exclude<T[K]['value'], undefined>;
  };
}

/**
 * Param parsers
 * Helper Functions that validate the presence and type of a search parameter, and return errors in an optional `error` field.
 */

export function parseParamBuoyIds(buoysParam: Param): ParsedParam<string[]> {
  if (buoysParam === undefined) return { error: ERROR_CODES.NO_BUOYS, value: undefined };
  if (buoysParam instanceof Array) return { error: ERROR_CODES.BAD_BUOYS, value: undefined };

  return { error: undefined, value: buoysParam.split(',') };
}

export function parseParamBuoyVariablesRI(variablesParam: Param): ParsedParam<RiBuoyVariable[]> {
  if (variablesParam === undefined) return { error: ERROR_CODES.NO_VARS, value: undefined };
  if (variablesParam instanceof Array) return { error: ERROR_CODES.BAD_VARS, value: undefined };
  const variables = variablesParam.split(',');
  if (variables.every((vari) => RI_BUOY_VARIABLES.includes(vari as RiBuoyVariable)))
    return { error: undefined, value: variables as RiBuoyVariable[] };
  return { error: ERROR_CODES.INVALID_VARS, value: undefined };
}

export function parseParamBuoyVariablesMA(variablesParam: Param): ParsedParam<MaBuoyVariable[]> {
  if (variablesParam === undefined) return { error: ERROR_CODES.NO_VARS, value: undefined };
  if (variablesParam instanceof Array) return { error: ERROR_CODES.BAD_VARS, value: undefined };
  const variables = variablesParam.split(',');
  if (variables.every((vari) => MA_BUOY_VARIABLES.includes(vari as MaBuoyVariable)))
    return { error: undefined, value: variables as MaBuoyVariable[] };
  return { error: ERROR_CODES.INVALID_VARS, value: undefined };
}

export function parseParamBuoyVariablesPlankton(
  variablesParam: Param
): ParsedParam<PlanktonVariable[]> {
  if (variablesParam === undefined) return { error: ERROR_CODES.NO_VARS, value: undefined };
  if (variablesParam instanceof Array) return { error: ERROR_CODES.BAD_VARS, value: undefined };
  const variables = variablesParam.split(',');
  if (variables.every((vari) => PLANKTON_VARIABLES.includes(vari as PlanktonVariable)))
    return { error: undefined, value: variables as PlanktonVariable[] };
  return { error: ERROR_CODES.INVALID_VARS, value: undefined };
}

export function parseParamBuoyVariablesRT(
  variablesParam: Param
): ParsedParam<RealTimeBuoyVariable[]> {
  if (variablesParam === undefined) return { error: ERROR_CODES.NO_VARS, value: undefined };
  if (variablesParam instanceof Array) return { error: ERROR_CODES.BAD_VARS, value: undefined };
  const variables = variablesParam.split(',');
  if (variables.every((vari) => REAL_TIME_BUOY_VARIABLES.includes(vari as RealTimeBuoyVariable)))
    return { error: undefined, value: variables as RealTimeBuoyVariable[] };
  return { error: ERROR_CODES.INVALID_VARS, value: undefined };
}

export function parseParamBuoyVariablesOsom(
  variablesParam: Param
): ParsedParam<OsomBuoyVariable[]> {
  if (variablesParam === undefined) return { error: ERROR_CODES.NO_VARS, value: undefined };
  if (variablesParam instanceof Array) return { error: ERROR_CODES.BAD_VARS, value: undefined };
  const variables = variablesParam.split(',');
  if (variables.every((vari) => OSOM_VARIABLES.includes(vari as OsomBuoyVariable)))
    return { error: undefined, value: variables as OsomBuoyVariable[] };
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
