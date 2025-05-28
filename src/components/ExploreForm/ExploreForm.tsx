'use client';
import React from 'react';

import {
  RI_BUOY_VIEWER_VARIABLES,
  RiBuoyCoordinate,
  MA_BUOY_VIEWER_VARIABLES,
} from '@/utils/data/api/buoy';
import { Multiselect, Label, Input, Form } from '@/components';

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
  location: 'ri' | 'ma';
  dateBounds: dateBound;
  init?: InitialFormData;
};

const DEFAULT_INITIAL_DATA: InitialFormData = {
  buoys: [],
  vars: [],
};

export function ExploreForm({
  buoys,
  location,
  dateBounds,
  init = DEFAULT_INITIAL_DATA,
}: ExploreFormProps) {
  const [selectedBuoys, setSelectedBuoys] = React.useState<string[]>(buoys.length === 1 ? buoys.map(({ buoyId }) => buoyId) : init.buoys);
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
        location === 'ri'
          ? `/datasets/rhode-island-buoys?${buoys ? `${buoys}&` : ''}${vars ? `${vars}&` : ''}${start}&${end}`
          : `/datasets/massachusetts-buoys?${buoys ? `${buoys}&` : ''}${vars ? `${vars}&` : ''}${start}&${end}`
      );
    },
    [selectedBuoys, selectedVars, startDate, endDate, location]
  );

  return (
    <Form onSubmit={onSubmit} className="flex flex-col gap-2 justify-center">
      {buoys.length > 1 ? (
        <Multiselect
          label="Buoys"
          options={buoys.map(({ stationName, buoyId }) => ({ label: stationName, value: buoyId }))}
          onChange={setSelectedBuoys}
          init={init.buoys}
        />
      ) : undefined}
      <Multiselect
        label="Variables (up to four)"
        options={location === 'ri' ? [...RI_BUOY_VIEWER_VARIABLES] : [...MA_BUOY_VIEWER_VARIABLES]}
        onChange={setSelectedVars}
        init={init.vars}
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
