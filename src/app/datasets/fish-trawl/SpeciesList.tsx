'use client';
import React from 'react';
import { Modal } from '@/components';
import { FishInfoPanel } from '@/components/FishInfoPanel';
import { Info } from '@/types';

type ModalLaunchProps = {
  item: Info;
};

type SpeciesListProps = {
  list: Info[];
};

function ModalLauncher({ item }: ModalLaunchProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button className="underline text-teal-800 hover:text-teal-500" onClick={() => setOpen(true)}>
        {item.name}
      </button>
      <Modal open={open} setOpen={setOpen}>
        <FishInfoPanel species={item} />
      </Modal>
    </>
  );
}

//right now acting like this is a list of species labels
export function SpeciesList({ list }: SpeciesListProps) {
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

  if (last === undefined) throw new Error('Invalid fish');

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
