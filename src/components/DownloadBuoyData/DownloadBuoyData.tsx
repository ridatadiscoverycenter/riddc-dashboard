'use client';
import React from 'react';

import { Button, DownloadBuoyDataForm, Modal } from '@/components';
import { RiBuoyViewerVariable } from '@/utils/data/api/buoy';

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
      <Button
        onClick={() => setOpen(true)}
        //color="sky"
        //className="bg-cyan-300 hover:bg-cyan-400 focus:bg-cyan-400 dark:bg-cyan-700 hover:dark:bg-cyan-600 focus:dark:bg-cyan-600 drop-shadow-md hover:drop-shadow-lg focus:drop-shadow-lg transition duration-500"
      >
        Download Data
      </Button>
      <Modal open={open} setOpen={setOpen}>
        <h3>How would you like to download this data?</h3>
        <DownloadBuoyDataForm variables={variables} buoys={buoys} start={start} end={end} />
      </Modal>
    </>
  );
}
