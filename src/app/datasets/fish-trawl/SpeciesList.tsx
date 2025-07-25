'use client';
import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { FishInfoPanel } from '@/components/FishInfoPanel';
import { fishInfo } from '@/assets/fishInfo';
import type { FishVariable } from '@/utils/data/api/fish';

type ModalLaunchProps = {
  item: FishVariable;
};

type SpeciesListProps = {
  list: FishVariable[];
};

function ModalLauncher({ item }: ModalLaunchProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button className="underline text-teal-800 hover:text-teal-500" onClick={() => setOpen(true)}>
        {fishInfo[item].name}
      </button>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-slate-600/75 dark:bg-slate-900/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-600 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <FishInfoPanel species={fishInfo[item]} />
            </DialogPanel>
          </div>
        </div>
      </Dialog>
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
