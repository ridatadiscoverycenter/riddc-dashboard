'use client';
import React from 'react';

import { Label, Input, Form, Select } from '@/components';
import {
  RI_BUOY_VARIABLES,
  RiBuoyCoordinate,
  MA_BUOY_VARIABLES,
  REAL_TIME_BUOY_VARIABLES,
  PLANKTON_VARIABLES,
} from '@/utils/data/api/buoy';

import { type Dataset } from '@/utils/data/api/buoy/types';
import { fetchSpecies, FISH_SPECIES } from '@/utils/data/api/fish';

type InitialFormData = {
  buoys: string[];
  vars: string[];
};

type dateBound = {
  startDate: Date;
  endDate: Date;
};

type ExploreFormProps = {
  buoys: RiBuoyCoordinate[];
  dataset: Dataset;
  dateBounds: dateBound;
  init?: InitialFormData;
};

const DEFAULT_INITIAL_DATA: InitialFormData = {
  buoys: [],
  vars: [],
};

// TODO: make this take in the buoy viewer variable?
// TODO: plankton only has one buoy -- how to handle?
export function ExploreForm({
  buoys,
  dataset,
  dateBounds,
  init = DEFAULT_INITIAL_DATA,
}: ExploreFormProps) {
  const [selectedBuoys, setSelectedBuoys] = React.useState<string[]>(
    buoys.length === 1 ? buoys.map(({ buoyId }) => buoyId) : init.buoys
  );
  const [selectedVars, setSelectedVars] = React.useState<string[]>(init.vars);
  const [startDate, setStartDate] = React.useState(dateBounds.startDate);
  const [endDate, setEndDate] = React.useState(dateBounds.endDate);

  const onSubmit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      const buoys = selectedBuoys.length === 0 ? '' : `buoys=${selectedBuoys.join(',')}`;
      const vars = selectedVars.length === 0 ? '' : `vars=${selectedVars.join(',')}`;
      const start = `start=${startDate.toISOString().split('T')[0]}`;
      const end = `end=${endDate.toISOString().split('T')[0]}`;
      window.location.replace(
        dataset === 'ri'
          ? `/datasets/rhode-island-buoys?${buoys ? `${buoys}&` : ''}${vars ? `${vars}&` : ''}${start}&${end}`
          : dataset === 'ma'
            ? `/datasets/massachusetts-buoys?${buoys ? `${buoys}&` : ''}${vars ? `${vars}&` : ''}${start}&${end}`
            : dataset === 'plankton'
              ? `/datasets/plankton?${buoys ? `${buoys}&` : ''}${vars ? `${vars}&` : ''}${start}&${end}`
              : dataset === 'fish'
                ? `/datasets/fish-trawl?${buoys ? `${buoys}&` : ''}${vars ? `${vars}&` : ''}${start}&${end}`
                : `/datasets/real-time?${buoys ? `${buoys}&` : ''}${vars ? `${vars}&` : ''}${start}&${end}`
      );
    },
    [selectedBuoys, selectedVars, startDate, endDate, dataset]
  );

  return (
    <Form onSubmit={onSubmit} className="flex flex-col gap-2 justify-center">
      <Select
        isMulti
        label="Buoys"
        options={buoys.map(({ stationName, buoyId }) => ({ label: stationName, value: buoyId }))}
        onChange={(newBuoys) =>
          setSelectedBuoys(
            (newBuoys as { label: string; value: string }[]).map((selected) => selected.value)
          )
        }
        dataset={dataset}
      />
      <Select
        isMulti
        label="Variables (up to four)"
        options={
          dataset === 'ri'
            ? [...RI_BUOY_VARIABLES]
            : dataset === 'ma'
              ? [...MA_BUOY_VARIABLES]
              : dataset === 'plankton'
                ? [...PLANKTON_VARIABLES]
                : dataset === 'fish'
                  ? [...FISH_SPECIES]
                  : [...REAL_TIME_BUOY_VARIABLES]
        }
        onChange={(newVars) =>
          setSelectedVars(
            (newVars as { label: string; value: string }[]).map((selected) => selected.value)
          )
        }
        dataset={dataset}
      />
      <div className="w-full flex lg:flex-row flex-col gap-2 [&>label]:flex-1">
        <Label label="Start">
          <Input
            value={startDate.toISOString().split('T')[0]}
            min={dateBounds.startDate.toISOString().split('T')[0]}
            max={dateBounds.endDate.toISOString().split('T')[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            type="date"
          />
        </Label>
        <Label label="End">
          <Input
            value={endDate.toISOString().split('T')[0]}
            min={dateBounds.startDate.toISOString().split('T')[0]}
            max={dateBounds.endDate.toISOString().split('T')[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            type="date"
          />
        </Label>
      </div>
      <Input
        type="submit"
        value="Explore!"
        className="bg-cyan-300 hover:bg-cyan-400 focus:bg-cyan-400 dark:bg-cyan-700 hover:dark:bg-cyan-600 focus:dark:bg-cyan-600 drop-shadow-md hover:drop-shadow-lg focus:drop-shadow-lg transition duration-500"
      />
    </Form>
  );
}
