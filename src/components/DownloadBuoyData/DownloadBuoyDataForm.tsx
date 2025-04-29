'use client';
import React from 'react';
import { MaBuoyViewerVariable, RiBuoyViewerVariable } from '@/utils/data/api/buoy';
import { Input, Select, Form } from '@/components';
import {
  createMaBuoyDownloadUrl,
  createRiBuoyDownloadUrl,
  DATA_FORMATS,
  DF,
} from '@/utils/data/erddap';
import { PlanktonVariable } from '@/utils/data/api/buoy/plankton';

type Region = 'ri' | 'ma' | 'plankton';

type downloadDataHelper<T extends Region> = T extends 'ri'
  ? RiBuoyViewerVariable[]
  : T extends 'ma'
    ? MaBuoyViewerVariable[]
    : T extends 'plankton'
      ? PlanktonVariable
      : never;

type Params = {
  buoys: string[];
  start?: Date;
  end?: Date;
  region: Region;
};

export type DownloadDataFormProps<T extends Region> = T extends 'ri'
  ? Params & { variables: downloadDataHelper<'ri'> }
  : T extends 'ma'
    ? Params & { variables: downloadDataHelper<'ma'> }
    : T extends 'plankton'
      ? Params & { variables: downloadDataHelper<'plankton'> }
      : never;

export function DownloadBuoyDataForm<T extends Region>({
  variables,
  buoys,
  start = undefined,
  end = undefined,
  region,
}: DownloadDataFormProps<T>) {
  const [format, setFormat] = React.useState([...DATA_FORMATS][0]);
  const doSubmit = React.useCallback(() => {
    window
      .open(
        region === 'ri'
          ? createRiBuoyDownloadUrl(format, variables as RiBuoyViewerVariable[], buoys, {
              start,
              end,
            })
          : createMaBuoyDownloadUrl(format, variables as MaBuoyViewerVariable[], buoys, {
              start,
              end,
            }),
        '_blank'
      )
      ?.focus();
  }, [buoys, variables, start, end, region, format]);
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
      <Input
        type="submit"
        value="Download"
        className="bg-cyan-300 hover:bg-cyan-400 focus:bg-cyan-400 dark:bg-cyan-700 hover:dark:bg-cyan-600 focus:dark:bg-cyan-600 drop-shadow-md hover:drop-shadow-lg focus:drop-shadow-lg transition duration-500"
      />
    </Form>
  );
}
