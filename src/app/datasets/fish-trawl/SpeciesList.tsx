'use client';
import React from 'react';
import { Modal } from '@/components';
import { FishInfoPanel } from '@/components/FishInfoPanel';

type ModalLaunchProps = {
  item: string | undefined;
};

function ModalLauncher({ item }: ModalLaunchProps) {
  console.log(item);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>{item}</button>
      <Modal open={open} setOpen={setOpen}>
        <FishInfoPanel species={item} />
      </Modal>
    </>
  );
}

//right now acting like this is a list of species labels
export function SpeciesList({ list }: { list: string[] }) {
  if (list.length === 0) return '';
  if (list.length === 1) return <ModalLauncher item={list[0]} />;
  if (list.length === 2)
    return (
      <>
        <ModalLauncher item={list[0]} /> and <ModalLauncher item={list[1]} />
      </>
    );
  const listCopy = [...list];
  const last = listCopy.pop();

  return (
    <>
      {listCopy.map((item) => (
        <>
          <ModalLauncher item={item} />
          {', '}
        </>
      ))}
      and <ModalLauncher item={last} />
    </>
  );
}
