import type { RiBuoyViewerVariable, MaBuoyViewerVariable, PlanktonVariable } from './data/api/buoy';

export type Dataset = 'ri' | 'ma' | 'real-time' | 'plankton';
export type downloadDataHelper<T extends Dataset> = T extends 'ri'
  ? RiBuoyViewerVariable[]
  : T extends 'ma'
    ? MaBuoyViewerVariable[]
    : T extends 'plankton'
      ? PlanktonVariable[]
      : never;
