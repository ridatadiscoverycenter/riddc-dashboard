'use client';
import React from 'react';

import { Button, DownloadBuoyDataForm, ExternalLink, Modal } from '@/components';
import { RiBuoyViewerVariable } from '@/utils/data/api/buoy';
import { ERDDAP_DATASET_LINK_RI_BUOY } from '@/utils/data/erddap';

type DownloadDataProps = {
  variables: RiBuoyViewerVariable[];
  buoys: string[];
  start?: Date;
  end?: Date;
};

export function DownloadBuoyData({
  variables,
  buoys,
  start = undefined,
  end = undefined,
}: DownloadDataProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Download Data</Button>
      <Modal open={open} setOpen={setOpen}>
        <h3>How would you like to download this data?</h3>
        <DownloadBuoyDataForm variables={variables} buoys={buoys} start={start} end={end} />
        <h4>Or, explore the data directly on <ExternalLink href={ERDDAP_DATASET_LINK_RI_BUOY}>ERDDAP</ExternalLink>.</h4>
      </Modal>
    </>
  );
}
