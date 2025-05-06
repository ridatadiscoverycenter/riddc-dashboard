import { BuoyPageSkeleton, ExploreForm } from '@/components';
import { BuoySummary } from '@/components/visualizations/BuoySummary/BuoySummary';
import { BuoyVariablesCard } from '@/components/visualizations/BuoyVariablesCard';
import { BuoyLocations } from '@/components/visualizations/Maps/BuoyLocations';
import { PageProps } from '@/types';
import { fetchWeatherData } from '@/utils/data';
import {
  fetchMaBuoyCoordinates,
  fetchMaBuoyData,
  fetchMaSummaryData,
  MaBuoyViewerVariable,
} from '@/utils/data/api/buoy';
import { getParams } from '@/utils/fns';

type PageWrapperProps = {
  description: React.ReactNode;
  params: PageProps['searchParams'];
  errorLinks: { href: string; description: string }[];
};

export async function PageWrapper({ description, params, errorLinks }: PageWrapperProps) {
  const parsed = getParams(params, 'ma');
  return (
    <BuoyPageSkeleton
      graph={
        <BuoyVariablesCard
          params={parsed}
          errorLinks={errorLinks}
          buoyDataFetcher={(ids, vars, start, end) =>
            fetchMaBuoyData(ids, vars as MaBuoyViewerVariable[], start, end)
          }
          weatherDataFetcher={fetchWeatherData}
          description={'description'}
        />
      }
      form={<ExploreFormWrapper parsed={parsed} />}
      map={<BuoyLocations fetcher={fetchMaBuoyCoordinates} />}
      summary={<BuoySummary location="ma" fetcher={fetchMaSummaryData} />}
      description={description}
    />
  );
}

async function ExploreFormWrapper({ parsed }: { parsed: ReturnType<typeof getParams> }) {
  const coordinates = await fetchMaBuoyCoordinates();
  return (
    <ExploreForm
      buoys={coordinates}
      location="ma"
      dateBounds={{
        startDate: new Date('2017-05-26'),
        endDate: new Date('2018-1-09'),
      }}
      init={typeof parsed === 'string' ? undefined : parsed}
    />
  );
}
