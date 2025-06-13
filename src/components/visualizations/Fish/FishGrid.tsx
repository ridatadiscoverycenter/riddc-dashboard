import type { Sample } from '@/types';
import React from 'react';
import { FullBleedColumn } from '@/components/PageSkeletons';
import { getTitleFromSpecies } from '@/utils/data/shared';
import { FishTrawl } from '../Vega/FishTrawl';

type FishGridParams = {
  fishSamples: Sample[];
};

export function FishGrid({ fishSamples }: FishGridParams) {
  return <FishTrawl data={fishSamples}></FishTrawl>;
}
