import React from 'react';
import { Card, Header, Loading } from '@/components';
import { ExploreForm } from '@/components/ExploreForm';

type BuoyPageSkeletonProps = {
  graph: React.ReactNode;
  form: React.ReactNode;
  map: React.ReactNode;
  summary: React.ReactNode;
  description: React.ReactNode;
};

export function BuoyPageSkeleton({
  graph,
  form,
  map,
  summary,
  description,
}: BuoyPageSkeletonProps) {
  return (
    <div className="m-4 grid grid-cols-2 md:grid-cols-3 grid-flow-row gap-4">
      <Card className="bg-white/90 md:col-span-2 col-span-3 flex flex-col items-center justify-around gap-3">
        {graph}
      </Card>
      {form}
      <div className="col-span-1 relative flex flex-col items-center justify-around">
        <Header size="sm" variant="normal" className="top-2 left-0 w-full text-center">
          Where are these buoys?
        </Header>
        {map}
      </div>
      <Card className="bg-white/90 col-span-2 items-center">{summary}</Card>
      <div className="col-span-3 flex flex-col items-center justify-center">
        <Header size="lg">About this Dataset</Header>
        {description}
      </div>
    </div>
  );
}

/**
 * A default version of the buoy page used as a placeholder on
 * the client before data has finished loading.
 */
export function DefaultBuoyPage({ description }: { description: React.ReactNode }) {
  return (
    <BuoyPageSkeleton
      graph={<Loading />}
      form={
        <ExploreForm
          buoys={[]}
          dataset={'ri'}
          dateBounds={{
            startDate: new Date(),
            endDate: new Date(),
          }}
        />
      }
      map={<Loading />}
      summary={<Loading />}
      description={description}
    ></BuoyPageSkeleton>
  );
}
