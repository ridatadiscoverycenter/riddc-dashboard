'use client';
import React from 'react';
//import { RiBuoyCoordinate, RiBuoyVariables } from '@/utils/data/api/buoy';
import { /*Multiselect,*/ Input, Select, Form } from '@/components';
/*
type DownloadDataProps = {
  buoys: RiBuoyCoordinate[];
  variables: RiBuoyVariables[];
};
*/
const DATA_FORMATS = [
  'htmlTable',
  'csv',
  'nc',
  'geoJson',
  'mat',
  'xhtml',
  'graph',
  'tsv',
  'html',
  'dataTable',
];

export function DownloadBuoyDataForm() {
  //const [selectedBuoys, setSelectedBuoys] = React.useState<string[]>([]);
  //const [selectedVariables, setSelectedVariables] = React.useState<string[]>([]);
  const [format, setFormat] = React.useState(DATA_FORMATS[0]);
  return (
    <Form
      onSubmit={(ev) => {
        ev.preventDefault();
        // Do things with data;
        console.log({ format });
      }}
    >
      <Select
        label="Data Format"
        options={DATA_FORMATS}
        onChange={(e) => setFormat(e.target.value)}
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
