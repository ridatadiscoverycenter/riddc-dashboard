'use client';
import React from 'react';
import {
  MaBuoyVariable,
  PlanktonVariable,
  RealTimeBuoyVariable,
  RiBuoyVariable,
} from '@/utils/data/api/buoy';
import { Input, Select, Form } from '@/components';
import {
  createMaBuoyDownloadUrl,
  createRealTimeDownloadUrl,
  createRiBuoyDownloadUrl,
  createPlanktonDownloadUrl,
  DATA_FORMATS,
  DF,
} from '@/utils/data/erddap';
import type { Dataset, downloadDataHelper } from '@/utils/data/api/buoy/types';

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
    : T extends 'plankton'
      ? Params & { variables: downloadDataHelper<'plankton'> }
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
          ? createRiBuoyDownloadUrl(format, variables as RiBuoyVariable[], buoys, {
              start,
              end,
            })
          : dataset === 'ma'
            ? createMaBuoyDownloadUrl(format, variables as MaBuoyVariable[], buoys, {
                start,
                end,
              })
            : dataset === 'plankton'
              ? createPlanktonDownloadUrl(format, variables as PlanktonVariable[], buoys, {
                  start,
                  end,
                })
              : createRealTimeDownloadUrl(format, variables as RealTimeBuoyVariable[], buoys, {
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
        onChange={(e) => setFormat((e as { value: DF }).value)}
      />
      <Input
        type="submit"
        value="Download"
        className="bg-cyan-300 hover:bg-cyan-400 focus:bg-cyan-400 dark:bg-cyan-700 hover:dark:bg-cyan-600 focus:dark:bg-cyan-600 drop-shadow-md hover:drop-shadow-lg focus:drop-shadow-lg transition duration-500"
      />
    </Form>
  );
}
