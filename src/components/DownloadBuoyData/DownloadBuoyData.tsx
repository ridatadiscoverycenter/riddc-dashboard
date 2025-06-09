'use client';
import React from 'react';

import {
  Button,
  DownloadBuoyDataForm,
  ExternalLink,
  Modal,
  type DownloadDataFormProps,
} from '@/components';
import { ERDDAP_DATASET_LINK_RI_BUOY } from '@/utils/data/erddap';
import type { Dataset, downloadDataHelper } from '@/utils/data/api/buoy/types';

type Params = {
  buoys: string[];
  start?: Date;
  end?: Date;
  dataset: Dataset;
};

type DownloadDataProps<T extends Dataset> = T extends 'ri'
  ? Params & { variables: downloadDataHelper<'ri'> }
  : T extends 'ma'
    ? Params & { variables: downloadDataHelper<'ma'> }
    : T extends 'plankton'
      ? Params & { variables: downloadDataHelper<'plankton'> }
      : never;

export function DownloadBuoyData<T extends Dataset>({
  variables,
  buoys,
  start = undefined,
  end = undefined,
  dataset,
}: DownloadDataProps<T>) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Download Data</Button>
      <Modal open={open} setOpen={setOpen}>
        <h3>How would you like to download this data?</h3>
        {React.createElement(DownloadBuoyDataForm, {
          variables,
          buoys,
          start,
          end,
          dataset,
        } as DownloadDataFormProps<T>)}
        <h4>
          Or, download the data directly from{' '}
          <ExternalLink href={ERDDAP_DATASET_LINK_RI_BUOY}>ERDDAP</ExternalLink>.
        </h4>
      </Modal>
    </>
  );
}
