'use server';

import { RiBuoyCoordinate } from '@/utils/data/api/buoy';
import { BuoyLocationsMap } from './BuoyLocationsMap';

type BuoyLocationsProps = {
  fetcher: () => Promise<RiBuoyCoordinate[]>;
};

export async function BuoyLocations({ fetcher }: BuoyLocationsProps) {
  const coordinates = await fetcher();
  return <BuoyLocationsMap locations={coordinates} />;
}
