'use client';
import React from 'react';
import {
  MaBuoyViewerVariable,
  RealTimeBuoyViewerVariable,
  RiBuoyViewerVariable,
} from '@/utils/data/api/buoy';
import { Input, Select, Form } from '@/components';
import {
  createMaBuoyDownloadUrl,
  createRealTimeDownloadUrl,
  createRiBuoyDownloadUrl,
  DATA_FORMATS,
  DF,
} from '@/utils/data/erddap';

type Dataset = 'ri' | 'ma' | 'real-time';

type downloadDataHelper<T extends Dataset> = T extends 'ri'
  ? RiBuoyViewerVariable[]
  : T extends 'ma'
    ? MaBuoyViewerVariable[]
    : RealTimeBuoyViewerVariable[];

type Params = {
  buoys: string[];
  start?: Date;
  end?: Date;
  dataset: Dataset;
};

export type DownloadDataFormProps<T extends Dataset> = T extends 'ri'
  ? Params & { variables: downloadDataHelper<'ri'> }
  : T extends 'ma'
    ? Params & { variables: downloadDataHelper<'ma'> }
    : Params & { variables: downloadDataHelper<'real-time'> };

export function DownloadBuoyDataForm<T extends Dataset>({
  variables,
  buoys,
  start = undefined,
  end = undefined,
  dataset,
}: DownloadDataFormProps<T>) {
  const [format, setFormat] = React.useState([...DATA_FORMATS][0]);
  const doSubmit = React.useCallback(() => {
    window
      .open(
        dataset === 'ri'
          ? createRiBuoyDownloadUrl(format, variables as RiBuoyViewerVariable[], buoys, {
              start,
              end,
            })
          : dataset === 'ma'
            ? createMaBuoyDownloadUrl(format, variables as MaBuoyViewerVariable[], buoys, {
                start,
                end,
              })
            : createRealTimeDownloadUrl(format, variables as RealTimeBuoyViewerVariable[], buoys, {
                start,
                end,
              }),
        '_blank'
      )
      ?.focus();
  }, [buoys, variables, start, end, dataset, format]);
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
