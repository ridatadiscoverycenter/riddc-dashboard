'use server';

import { MaBuoySummaryData, RiBuoySummaryData } from '@/utils/data/api/buoy';
import { MaBuoySummary, RiBuoySummary } from '../Vega';

type BuoySummaryProps = {
  location: 'ri' | 'ma';
  fetcher: () => Promise<RiBuoySummaryData[] | MaBuoySummaryData[]>;
};

export async function BuoySummary({ location, fetcher }: BuoySummaryProps) {
  const summaryData = await fetcher();
  if (location === 'ri') return <RiBuoySummary data={summaryData as RiBuoySummaryData[]} />;
  else return <MaBuoySummary data={summaryData as MaBuoySummaryData[]} />;
}
