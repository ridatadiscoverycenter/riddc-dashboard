'use client';
import React from 'react';

import {
  Button,
  DownloadBuoyDataForm,
  ExternalLink,
  Modal,
  type DownloadDataFormProps,
} from '@/components';
import { type RiBuoyViewerVariable, type MaBuoyViewerVariable } from '@/utils/data/api/buoy';
import { ERDDAP_DATASET_LINK_RI_BUOY } from '@/utils/data/erddap';

type RiOrMa = 'ri' | 'ma';

type downloadDataHelper<T extends RiOrMa> = T extends 'ri'
  ? RiBuoyViewerVariable[]
  : T extends 'ma'
    ? MaBuoyViewerVariable[]
    : never;

type Params = {
  buoys: string[];
  start?: Date;
  end?: Date;
  region: RiOrMa;
};

type DownloadDataProps<T extends RiOrMa> = T extends 'ri'
  ? Params & { variables: downloadDataHelper<'ri'> }
  : T extends 'ma'
    ? Params & { variables: downloadDataHelper<'ma'> }
    : never;

export function DownloadBuoyData<T extends RiOrMa>({
  variables,
  buoys,
  start = undefined,
  end = undefined,
  region,
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
          region,
        } as DownloadDataFormProps<T>)}
        {/* <DownloadBuoyDataForm
          variables={variables}
          buoys={buoys}
          start={start}
          end={end}
          region={region}
        /> */}
        <h4>
          Or, download the data directly from{' '}
          <ExternalLink href={ERDDAP_DATASET_LINK_RI_BUOY}>ERDDAP</ExternalLink>.
        </h4>
      </Modal>
    </>
  );
}
