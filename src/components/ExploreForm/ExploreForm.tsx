'use client';
import React from 'react';

import { Label, Input, Form, Select } from '@/components';
import {
  RI_BUOY_VARIABLES,
  RiBuoyCoordinate,
  MA_BUOY_VARIABLES,
  REAL_TIME_BUOY_VARIABLES,
  PLANKTON_VARIABLES,
  OSOM_VARIABLES,
  MA_VARIABLE_CONVERTER,
} from '@/utils/data/api/buoy';
import { FISH_SPECIES } from '@/utils/data/api/fish';

import { type Dataset } from '@/utils/data/api/buoy/types';
import { variableToLabel } from '@/utils/data/shared/variableConverter';

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

function selectVarOptions(dataset: Dataset) {
  if (dataset === 'ri') return [...RI_BUOY_VARIABLES];
  if (dataset === 'ma') return [...MA_BUOY_VARIABLES];
  if (dataset === 'plankton') return [...PLANKTON_VARIABLES];
  if (dataset === 'fish') return [...FISH_SPECIES];
  if (dataset === 'real-time') return [...REAL_TIME_BUOY_VARIABLES];
  if (dataset === 'osom') return [...OSOM_VARIABLES];
  return ['~~None Found~~'];
}

// TODO: make this take in the buoy viewer variable?
// TODO: plankton only has one buoy -- how to handle?
export function ExploreForm({
  buoys,
  dataset,
  dateBounds,
  init = DEFAULT_INITIAL_DATA,
}: ExploreFormProps) {
  console.log({ init });
  const [selectedBuoys, setSelectedBuoys] = React.useState<string[]>(
    buoys.length === 1 ? buoys.map(({ buoyId }) => buoyId) : init.buoys
  );
  const [selectedVars, setSelectedVars] = React.useState<string[]>(init.vars);
  const [startDate, setStartDate] = React.useState(dateBounds.startDate);
  const [endDate, setEndDate] = React.useState(dateBounds.endDate);

  const varOptions = React.useMemo(
    () =>
      selectVarOptions(dataset).map((variable) => ({
        label: variableToLabel(variable, dataset),
        value: variable,
      })),
    [dataset]
  );

  const onSubmit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      const buoys = selectedBuoys.length === 0 ? '' : `buoys=${selectedBuoys.join(',')}`;
      const vars = selectedVars.length === 0 ? '' : `vars=${selectedVars.join(',')}`;
      const start = `start=${startDate.toISOString().split('T')[0]}`;
      const end = `end=${endDate.toISOString().split('T')[0]}`;
      const datasetLink =
        dataset === 'ri'
          ? `rhode-island-buoys`
          : dataset === 'ma'
            ? `massachusetts-buoys`
            : dataset === 'plankton'
              ? `plankton`
              : dataset === 'fish'
                ? `fish-trawl`
                : dataset === 'real-time'
                  ? `real-time`
                  : dataset === 'osom'
                    ? `osom`
                    : '';
      window.location.replace(
        `/datasets/${datasetLink}?${buoys ? `${buoys}&` : ''}${vars ? `${vars}&` : ''}${start}&${end}`
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
        value={selectedBuoys
          .map((selectedBuoyId) => buoys.find(({ buoyId }) => selectedBuoyId === buoyId))
          .filter((buoyOrUndefined) => buoyOrUndefined !== undefined)
          .map(({ stationName, buoyId }) => ({ label: stationName, value: buoyId }))}
      />
      <Select
        isMulti
        label="Variables (up to four)"
        options={varOptions}
        onChange={(newVars) =>
          setSelectedVars(
            (newVars as { label: string; value: string }[]).map((selected) => selected.value)
          )
        }
        dataset={dataset}
        value={selectedVars
          .map((selectedVar) => varOptions.find(({ value }) => value === selectedVar))
          .filter((variableOrUndefined) => variableOrUndefined !== undefined)}
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
