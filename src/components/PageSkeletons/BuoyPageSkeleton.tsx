import React from 'react';
import { Card, ExploreForm, Loading } from '@/components';

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
      <Card className="bg-clear-900 md:col-span-2 col-span-3 flex flex-col items-center justify-around gap-3">
        {graph}
      </Card>
      {form}
      <div className="flex flex-col items-center justify-around col-span-1">
        <h2 className="text-xl font-header font-extralight">Where are these buoys?</h2>
        {map}
      </div>
      <Card className="bg-clear-900 col-span-2 items-center">{summary}</Card>
      <div className="col-span-3 flex flex-col items-center justify-center">
        <h2 className="font-header font-bold text-lg">About this dataset</h2>
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
    />
  );
}
