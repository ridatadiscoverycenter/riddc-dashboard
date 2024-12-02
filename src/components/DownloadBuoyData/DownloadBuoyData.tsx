'use client';
import React from 'react';
import { RiBuoyCoordinate, RiBuoyVariables } from '@/utils/erddap/api/buoy';
import { Multiselect, Input, Select, Form } from '@/components';

type DownloadDataProps = {
  buoys: RiBuoyCoordinate[];
  variables: RiBuoyVariables[];
};

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

export function DownloadBuoyData({ buoys, variables }: DownloadDataProps) {
  const [selectedBuoys, setSelectedBuoys] = React.useState<string[]>([]);
  const [selectedVariables, setSelectedVariables] = React.useState<string[]>([]);
  return (
    <Form>
      <Select label="Data Format" options={DATA_FORMATS} />
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
      <Input
        type="submit"
        value="Download"
        onSubmit={(ev) => {
          ev.preventDefault();
          // Do things with data;
        }}
      />
    </Form>
  );
}
