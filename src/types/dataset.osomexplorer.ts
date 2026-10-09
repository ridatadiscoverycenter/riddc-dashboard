import { z } from 'zod';

export const OSOM_EXPLORER_VARIABLES = [
  'SalinityBottom',
  'SalinitySurface',
  'WaterTempBottom',
  'WaterTempSurface',
  'SurfaceHeight',
  'VelocityEastwardBottom',
  'VelocityEastwardSurface',
  'VelocityNorthwardBottom',
  'VelocityNorthwardSurface',
  'KineticEnergyBottom',
  'KineticEnergySurface',
] as const;

export type OsomExplorerVariable = (typeof OSOM_EXPLORER_VARIABLES)[number];

export const OSOM_EXPLORER_DATASETS = ['monthly_avg'] as const;

export type OsomExplorerDataset = (typeof OSOM_EXPLORER_DATASETS)[number];

export const OsomExplorerDatasetSchema = z.union(
  OSOM_EXPLORER_DATASETS.map((dataset) => z.literal(dataset))
);

export const OsomExplorerVariableSchema = z.union(
  OSOM_EXPLORER_VARIABLES.map((variable) => z.literal(variable))
);
