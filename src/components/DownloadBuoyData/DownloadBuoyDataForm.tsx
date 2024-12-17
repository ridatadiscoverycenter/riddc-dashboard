'use client';
import React from 'react';
import { RiBuoyCoordinate, RiBuoyViewerVariable } from '@/utils/data/api/buoy';
import { /*Multiselect,*/ Input, Select, Form } from '@/components';
import { createRiBuoyDownloadUrl, DATA_FORMATS, DF } from '@/utils/data/erddap';

type DownloadDataProps = {
  variables: RiBuoyViewerVariable[];
  buoys: RiBuoyCoordinate[];
  start?: Date;
  end?: Date;
};



export function DownloadBuoyDataForm({ variables, buoys, start = undefined, end = undefined }: DownloadDataProps) {
  //const [selectedBuoys, setSelectedBuoys] = React.useState<string[]>([]);
  //const [selectedVariables, setSelectedVariables] = React.useState<string[]>([]);
  const [format, setFormat] = React.useState([...DATA_FORMATS][0]);
  const doSubmit = React.useCallback(() => {
    window.open(createRiBuoyDownloadUrl(format, variables, buoys, { start, end }), "_blank")?.focus();
  }, [buoys, variables, start, end, format]);
  return (
    <Form
      onSubmit={(ev) => {
        ev.preventDefault();
        doSubmit();
      }}
    >
      <Select
        label="Data Format"
        options={[...DATA_FORMATS]}
        onChange={(e) => setFormat(e.target.value as DF)}
      />
      {/* 
      <Multiselect
        label="Buoys"
        options={buoys.map(({ stationName, buoyId }) => ({ label: stationName, value: buoyId }))}
        onChange={setSelectedBuoys}
      />
      <Multiselect
        label="Variables"
        options={variables.map(({ name }) => name)}
        onChange={setSelectedVariables}
      />
        */}
      <Input
        type="submit"
        value="Download"
        className="bg-cyan-300 hover:bg-cyan-400 focus:bg-cyan-400 dark:bg-cyan-700 hover:dark:bg-cyan-600 focus:dark:bg-cyan-600 drop-shadow-md hover:drop-shadow-lg focus:drop-shadow-lg transition duration-500"
      />
    </Form>
  );
}
