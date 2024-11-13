'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

import { RiBuoyCoordinate, RiBuoyVariables } from '@/utils/erddap/api/buoy';
import { Multiselect } from '../Multiselect';
import { Label } from '../Label';

type ExploreFormProps = {
  buoys: RiBuoyCoordinate[];
  variables: RiBuoyVariables[];
};

export function ExploreForm({ buoys, variables }: ExploreFormProps) {
  const router = useRouter();
  const [selectedBuoys, setSelectedBuoys] = React.useState<string[]>([]);
  const [selectedVars, setSelectedVars] = React.useState<string[]>([]);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  const onSubmit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      router.push('/');
    },
    [router]
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <Multiselect
        label="Buoys"
        options={buoys.map(({ stationName, buoyId }) => ({ label: stationName, value: buoyId }))}
        onChange={setSelectedBuoys}
      />
      <Multiselect
        label="Variables (up to four)"
        options={variables.map(({ name }) => name)}
        onChange={setSelectedVars}
      />
      <div className="w-full flex sm:flex-row flex-col gap-2 [&>label]:flex-1">
        <Label label="Start">
          <input
            value={startDate.toISOString().split('T')[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            type="date"
            className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 shadow-sm dark:border-slate-600 dark:border-1"
          />
        </Label>
        <Label label="End">
          <input
            value={endDate.toISOString().split('T')[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            type="date"
            className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 shadow-sm dark:border-slate-600 dark:border-1"
          />
        </Label>
      </div>
      <input
        type="submit"
        value="Explore!"
        className=" bg-cyan-300 hover:bg-cyan-400 focus:bg-cyan-400 dark:bg-cyan-700 hover:dark:bg-cyan-600 focus:dark:bg-cyan-600 p-2 rounded-md drop-shadow-md hover:drop-shadow-lg focus:drop-shadow-lg transition duration-500"
      />
    </form>
  );
}
